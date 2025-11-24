export interface Habit {
  id: string;
  name: string;
  emoji: string;
  color: string;
  reminderTime: string;
  weekdays: number[];
  createdAt: string;
  notes?: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string;
  completed: boolean;
  note?: string;
}

export interface DailyStats {
  date: string;
  completedCount: number;
  totalCount: number;
  percentage: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  perfectDays: number;
  perfectWeeks: number;
}

export const PRESET_COLORS = [
  '#5E5CE6',
  '#FF9500',
  '#34C759',
  '#FF3B30',
  '#AF52DE',
  '#FF2D55',
  '#5AC8FA',
  '#FFCC00',
];

export const COMMON_EMOJIS = [
  '💪', '🏃', '📚', '💧', '🧘', '🎯', '✍️', '🎨',
  '🎵', '🎮', '📱', '💻', '🍎', '🥗', '🥤', '☕',
  '🌅', '🌙', '⭐', '🔥', '💎', '🏆', '🎓', '📖',
  '✅', '📝', '📊', '💼', '🏋️', '🚴', '🏊', '⚽',
  '🎾', '🏀', '⛳', '🎣', '🧗', '🤸', '🧘‍♀️', '🏃‍♀️',
  '🚶', '🛌', '🧠', '❤️', '🫁', '🦷', '👁️', '👂',
  '🌱', '🌻', '🌈', '☀️', '🌤️', '⛅', '🌧️', '⚡',
  '❄️', '🌊', '🔔', '📢', '📣', '📯', '🎺', '🎸',
  '🎹', '🥁', '🎤', '🎧', '📻', '📺', '📷', '📹',
  '🎬', '🎭', '🎪', '🎨', '🖌️', '🖍️', '✏️', '📏',
];

export const MOTIVATIONAL_QUOTES = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "It always seems impossible until it's done.",
  "The future depends on what you do today.",
  "You are never too old to set another goal or to dream a new dream.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only impossible journey is the one you never begin.",
  "Don't count the days, make the days count.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Don't wait for opportunity. Create it.",
  "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
  "The key to success is to focus on goals, not obstacles.",
  "Dream it. Believe it. Build it.",
  "Your only limit is you.",
  "Sometimes later becomes never. Do it now.",
  "One day or day one. You decide.",
  "It's not about perfect. It's about effort.",
  "Every accomplishment starts with the decision to try.",
  "Be stronger than your excuses.",
  "The difference between who you are and who you want to be is what you do.",
  "A journey of a thousand miles begins with a single step.",
  "You don't have to be great to start, but you have to start to be great.",
  "The only bad workout is the one that didn't happen.",
  "Strive for progress, not perfection.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don't wish for it, work for it.",
  "Good things come to those who hustle.",
  "Hustle until your haters ask if you're hiring.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "You are what you do, not what you say you'll do.",
  "If it doesn't challenge you, it won't change you.",
  "Make each day your masterpiece.",
  "The only person you should try to be better than is the person you were yesterday.",
  "Small daily improvements are the key to staggering long-term results.",
  "You didn't come this far to only come this far.",
  "Consistency is what transforms average into excellence.",
];
