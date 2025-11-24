import { format, startOfDay, subDays, eachDayOfInterval, getDay } from 'date-fns';
import { habitStorage } from './habitStorage';
import {
  HabitAnalytics,
  DayOfWeekStats,
  MonthlyComparison,
  HabitCorrelation,
  AnalyticsSummary,
} from '@/types/analytics';
import { Habit } from '@/types/habit';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const analyticsService = {
  getHabitAnalytics(habitId: string, days: number = 30): HabitAnalytics {
    const habits = habitStorage.getHabits();
    const habit = habits.find(h => h.id === habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    const endDate = new Date();
    const startDate = subDays(endDate, days);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    let totalAttempts = 0;
    let totalCompletions = 0;
    const dayOfWeekCompletions: number[] = [0, 0, 0, 0, 0, 0, 0];
    const dayOfWeekAttempts: number[] = [0, 0, 0, 0, 0, 0, 0];

    dateRange.forEach(date => {
      const dayOfWeek = getDay(date);
      if (habit.weekdays.includes(dayOfWeek)) {
        totalAttempts++;
        dayOfWeekAttempts[dayOfWeek]++;

        if (habitStorage.isCompleted(habitId, date)) {
          totalCompletions++;
          dayOfWeekCompletions[dayOfWeek]++;
        }
      }
    });

    const successRate = totalAttempts > 0 ? Math.round((totalCompletions / totalAttempts) * 100) : 0;

    // Find best and worst days
    let bestDay = 0;
    let worstDay = 0;
    let bestRate = -1;
    let worstRate = 101;

    habit.weekdays.forEach(day => {
      if (dayOfWeekAttempts[day] > 0) {
        const rate = (dayOfWeekCompletions[day] / dayOfWeekAttempts[day]) * 100;
        if (rate > bestRate) {
          bestRate = rate;
          bestDay = day;
        }
        if (rate < worstRate) {
          worstRate = rate;
          worstDay = day;
        }
      }
    });

    return {
      habitId,
      habitName: habit.name,
      successRate,
      totalAttempts,
      totalCompletions,
      currentStreak: habitStorage.getHabitStreak(habitId),
      longestStreak: habitStorage.getLongestStreak(habitId),
      bestDayOfWeek: DAY_NAMES[bestDay],
      worstDayOfWeek: DAY_NAMES[worstDay],
    };
  },

  getDayOfWeekStats(days: number = 30): DayOfWeekStats[] {
    const habits = habitStorage.getHabits();
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    const dayStats: DayOfWeekStats[] = DAY_NAMES.map(day => ({
      day,
      completions: 0,
      attempts: 0,
      successRate: 0,
    }));

    dateRange.forEach(date => {
      const dayOfWeek = getDay(date);
      const scheduledHabits = habits.filter(h => h.weekdays.includes(dayOfWeek));
      
      dayStats[dayOfWeek].attempts += scheduledHabits.length;
      
      scheduledHabits.forEach(habit => {
        if (habitStorage.isCompleted(habit.id, date)) {
          dayStats[dayOfWeek].completions++;
        }
      });
    });

    dayStats.forEach(stat => {
      stat.successRate = stat.attempts > 0 ? Math.round((stat.completions / stat.attempts) * 100) : 0;
    });

    return dayStats;
  },

  getMonthlyComparison(months: number = 6): MonthlyComparison[] {
    const result: MonthlyComparison[] = [];
    const habits = habitStorage.getHabits();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

      let completions = 0;
      let perfectDays = 0;
      let totalPercentage = 0;
      let daysWithData = 0;

      monthDays.forEach(day => {
        const dayOfWeek = getDay(day);
        const scheduledHabits = habits.filter(h => h.weekdays.includes(dayOfWeek));
        
        if (scheduledHabits.length > 0) {
          daysWithData++;
          let dayCompletions = 0;

          scheduledHabits.forEach(habit => {
            if (habitStorage.isCompleted(habit.id, day)) {
              completions++;
              dayCompletions++;
            }
          });

          const dayPercentage = (dayCompletions / scheduledHabits.length) * 100;
          totalPercentage += dayPercentage;

          if (dayPercentage === 100) {
            perfectDays++;
          }
        }
      });

      result.push({
        month: format(monthStart, 'MMM yyyy'),
        completions,
        perfectDays,
        averageCompletion: daysWithData > 0 ? Math.round(totalPercentage / daysWithData) : 0,
      });
    }

    return result;
  },

  getHabitCorrelations(): HabitCorrelation[] {
    const habits = habitStorage.getHabits();
    const correlations: HabitCorrelation[] = [];

    if (habits.length < 2) return correlations;

    const endDate = new Date();
    const startDate = subDays(endDate, 30);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    for (let i = 0; i < habits.length; i++) {
      for (let j = i + 1; j < habits.length; j++) {
        const habit1 = habits[i];
        const habit2 = habits[j];

        let bothCompleted = 0;
        let eitherCompleted = 0;

        dateRange.forEach(date => {
          const dayOfWeek = getDay(date);
          const habit1Scheduled = habit1.weekdays.includes(dayOfWeek);
          const habit2Scheduled = habit2.weekdays.includes(dayOfWeek);

          if (habit1Scheduled && habit2Scheduled) {
            const habit1Done = habitStorage.isCompleted(habit1.id, date);
            const habit2Done = habitStorage.isCompleted(habit2.id, date);

            if (habit1Done && habit2Done) {
              bothCompleted++;
              eitherCompleted++;
            } else if (habit1Done || habit2Done) {
              eitherCompleted++;
            }
          }
        });

        if (eitherCompleted > 0) {
          const correlationScore = Math.round((bothCompleted / eitherCompleted) * 100);
          
          let description = '';
          if (correlationScore >= 80) {
            description = 'Strong positive correlation - these habits are often completed together';
          } else if (correlationScore >= 60) {
            description = 'Moderate correlation - these habits are sometimes completed together';
          } else if (correlationScore >= 40) {
            description = 'Weak correlation - these habits are occasionally completed together';
          } else {
            description = 'Low correlation - these habits are rarely completed together';
          }

          correlations.push({
            habit1Id: habit1.id,
            habit1Name: habit1.name,
            habit2Id: habit2.id,
            habit2Name: habit2.name,
            correlationScore,
            description,
          });
        }
      }
    }

    return correlations.sort((a, b) => b.correlationScore - a.correlationScore);
  },

  getAnalyticsSummary(days: number = 30): AnalyticsSummary {
    const habits = habitStorage.getHabits();
    const endDate = new Date();
    const startDate = subDays(endDate, days);
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    let totalAttempts = 0;
    let totalCompletions = 0;
    let perfectDaysCount = 0;
    const habitSuccessRates: { habit: Habit; rate: number }[] = [];

    const dayOfWeekCompletions: number[] = [0, 0, 0, 0, 0, 0, 0];
    const dayOfWeekAttempts: number[] = [0, 0, 0, 0, 0, 0, 0];

    dateRange.forEach(date => {
      const dayOfWeek = getDay(date);
      const scheduledHabits = habits.filter(h => h.weekdays.includes(dayOfWeek));
      
      if (scheduledHabits.length > 0) {
        let dayCompletions = 0;

        scheduledHabits.forEach(habit => {
          totalAttempts++;
          dayOfWeekAttempts[dayOfWeek]++;

          if (habitStorage.isCompleted(habit.id, date)) {
            totalCompletions++;
            dayCompletions++;
            dayOfWeekCompletions[dayOfWeek]++;
          }
        });

        if (dayCompletions === scheduledHabits.length) {
          perfectDaysCount++;
        }
      }
    });

    // Calculate success rate for each habit
    habits.forEach(habit => {
      const analytics = this.getHabitAnalytics(habit.id, days);
      habitSuccessRates.push({ habit, rate: analytics.successRate });
    });

    habitSuccessRates.sort((a, b) => b.rate - a.rate);

    // Find best day of week
    let bestDay = 0;
    let bestRate = -1;
    for (let i = 0; i < 7; i++) {
      if (dayOfWeekAttempts[i] > 0) {
        const rate = (dayOfWeekCompletions[i] / dayOfWeekAttempts[i]) * 100;
        if (rate > bestRate) {
          bestRate = rate;
          bestDay = i;
        }
      }
    }

    const overallSuccessRate = totalAttempts > 0 ? Math.round((totalCompletions / totalAttempts) * 100) : 0;
    const currentStreaks = habits.map(h => habitStorage.getHabitStreak(h.id));
    const currentAverageStreak = currentStreaks.length > 0 
      ? Math.round(currentStreaks.reduce((a, b) => a + b, 0) / currentStreaks.length)
      : 0;

    return {
      totalHabits: habits.length,
      overallSuccessRate,
      mostConsistentHabit: habitSuccessRates[0]?.habit.name || 'N/A',
      leastConsistentHabit: habitSuccessRates[habitSuccessRates.length - 1]?.habit.name || 'N/A',
      bestDayOfWeek: DAY_NAMES[bestDay],
      totalDaysTracked: dateRange.length,
      perfectDaysCount,
      currentAverageStreak,
    };
  },
};
