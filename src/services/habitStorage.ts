import type { Habit, HabitCompletion, StreakInfo, DailyStats } from '@/types/habit';
import { startOfDay, format, parseISO, differenceInDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

const HABITS_KEY = 'streak_habits';
const COMPLETIONS_KEY = 'streak_completions';
const ONBOARDING_KEY = 'streak_onboarding_completed';

export const habitStorage = {
  getHabits(): Habit[] {
    const data = localStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveHabits(habits: Habit[]): void {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  },

  addHabit(habit: Omit<Habit, 'id' | 'createdAt'>): Habit {
    const habits = this.getHabits();
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    habits.push(newHabit);
    this.saveHabits(habits);
    return newHabit;
  },

  updateHabit(id: string, updates: Partial<Habit>): void {
    const habits = this.getHabits();
    const index = habits.findIndex(h => h.id === id);
    if (index !== -1) {
      habits[index] = { ...habits[index], ...updates };
      this.saveHabits(habits);
    }
  },

  deleteHabit(id: string): void {
    const habits = this.getHabits().filter(h => h.id !== id);
    this.saveHabits(habits);
    const completions = this.getCompletions().filter(c => c.habitId !== id);
    this.saveCompletions(completions);
  },

  getCompletions(): HabitCompletion[] {
    const data = localStorage.getItem(COMPLETIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveCompletions(completions: HabitCompletion[]): void {
    localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
  },

  toggleCompletion(habitId: string, date: Date): boolean {
    const completions = this.getCompletions();
    const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
    const existingIndex = completions.findIndex(
      c => c.habitId === habitId && c.date === dateStr
    );

    if (existingIndex !== -1) {
      completions[existingIndex].completed = !completions[existingIndex].completed;
    } else {
      completions.push({
        habitId,
        date: dateStr,
        completed: true,
      });
    }

    this.saveCompletions(completions);
    return completions[existingIndex !== -1 ? existingIndex : completions.length - 1].completed;
  },

  isCompleted(habitId: string, date: Date): boolean {
    const completions = this.getCompletions();
    const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
    const completion = completions.find(
      c => c.habitId === habitId && c.date === dateStr
    );
    return completion?.completed ?? false;
  },

  getHabitStreak(habitId: string): number {
    const completions = this.getCompletions()
      .filter(c => c.habitId === habitId && c.completed)
      .map(c => c.date)
      .sort()
      .reverse();

    if (completions.length === 0) return 0;

    let streak = 0;
    const today = startOfDay(new Date());

    for (let i = 0; i < completions.length; i++) {
      const completionDate = startOfDay(parseISO(completions[i]));
      const expectedDate = subDays(today, streak);

      if (differenceInDays(expectedDate, completionDate) === 0) {
        streak++;
      } else if (differenceInDays(expectedDate, completionDate) < 0) {
        continue;
      } else {
        break;
      }
    }

    return streak;
  },

  getLongestStreak(habitId: string): number {
    const completions = this.getCompletions()
      .filter(c => c.habitId === habitId && c.completed)
      .map(c => parseISO(c.date))
      .sort((a, b) => a.getTime() - b.getTime());

    if (completions.length === 0) return 0;

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < completions.length; i++) {
      const daysDiff = differenceInDays(completions[i], completions[i - 1]);
      if (daysDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (daysDiff > 1) {
        currentStreak = 1;
      }
    }

    return maxStreak;
  },

  getTodayProgress(): { completed: number; total: number; percentage: number } {
    const habits = this.getHabits();
    const today = new Date();
    const dayOfWeek = today.getDay();

    const todayHabits = habits.filter(h => h.weekdays.includes(dayOfWeek));
    const completed = todayHabits.filter(h => this.isCompleted(h.id, today)).length;

    return {
      completed,
      total: todayHabits.length,
      percentage: todayHabits.length > 0 ? Math.round((completed / todayHabits.length) * 100) : 0,
    };
  },

  getDailyStats(startDate: Date, endDate: Date): DailyStats[] {
    const habits = this.getHabits();
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map(day => {
      const dayOfWeek = day.getDay();
      const todayHabits = habits.filter(h => h.weekdays.includes(dayOfWeek));
      const completed = todayHabits.filter(h => this.isCompleted(h.id, day)).length;

      return {
        date: format(day, 'yyyy-MM-dd'),
        completedCount: completed,
        totalCount: todayHabits.length,
        percentage: todayHabits.length > 0 ? Math.round((completed / todayHabits.length) * 100) : 0,
      };
    });
  },

  getOverallStats(): StreakInfo {
    const habits = this.getHabits();
    const completions = this.getCompletions().filter(c => c.completed);

    const currentStreaks = habits.map(h => this.getHabitStreak(h.id));
    const longestStreaks = habits.map(h => this.getLongestStreak(h.id));

    const dateGroups = completions.reduce((acc, c) => {
      if (!acc[c.date]) acc[c.date] = [];
      acc[c.date].push(c.habitId);
      return acc;
    }, {} as Record<string, string[]>);

    let perfectDays = 0;
    for (const [date, habitIds] of Object.entries(dateGroups)) {
      const dayOfWeek = parseISO(date).getDay();
      const expectedHabits = habits.filter(h => h.weekdays.includes(dayOfWeek));
      if (Array.isArray(habitIds) && habitIds.length === expectedHabits.length && expectedHabits.length > 0) {
        perfectDays++;
      }
    }

    const today = new Date();
    const last12Weeks = eachDayOfInterval({
      start: subDays(today, 84),
      end: today,
    });

    let perfectWeeks = 0;
    for (let i = 0; i < last12Weeks.length; i += 7) {
      const weekStart = last12Weeks[i];
      const weekEnd = i + 6 < last12Weeks.length ? last12Weeks[i + 6] : last12Weeks[last12Weeks.length - 1];
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

      const allPerfect = weekDays.every(day => {
        const dayOfWeek = day.getDay();
        const expectedHabits = habits.filter(h => h.weekdays.includes(dayOfWeek));
        if (expectedHabits.length === 0) return true;
        const completed = expectedHabits.filter(h => this.isCompleted(h.id, day)).length;
        return completed === expectedHabits.length;
      });

      if (allPerfect) perfectWeeks++;
    }

    return {
      currentStreak: currentStreaks.length > 0 ? Math.max(...currentStreaks) : 0,
      longestStreak: longestStreaks.length > 0 ? Math.max(...longestStreaks) : 0,
      totalCompletions: completions.length,
      perfectDays,
      perfectWeeks,
    };
  },

  isOnboardingCompleted(): boolean {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  },

  setOnboardingCompleted(): void {
    localStorage.setItem(ONBOARDING_KEY, 'true');
  },
};
