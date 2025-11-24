export interface HabitAnalytics {
  habitId: string;
  habitName: string;
  successRate: number;
  totalAttempts: number;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  bestDayOfWeek: string;
  worstDayOfWeek: string;
  averageCompletionTime?: string;
}

export interface DayOfWeekStats {
  day: string;
  completions: number;
  attempts: number;
  successRate: number;
}

export interface MonthlyComparison {
  month: string;
  completions: number;
  perfectDays: number;
  averageCompletion: number;
}

export interface HabitCorrelation {
  habit1Id: string;
  habit1Name: string;
  habit2Id: string;
  habit2Name: string;
  correlationScore: number; // 0-100
  description: string;
}

export interface AnalyticsSummary {
  totalHabits: number;
  overallSuccessRate: number;
  mostConsistentHabit: string;
  leastConsistentHabit: string;
  bestDayOfWeek: string;
  totalDaysTracked: number;
  perfectDaysCount: number;
  currentAverageStreak: number;
}
