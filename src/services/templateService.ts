import { HabitTemplate, TemplateCategoryInfo, TemplateCategory } from '@/types/template';

export const templateCategories: TemplateCategoryInfo[] = [
  {
    id: 'health',
    name: 'Health & Wellness',
    emoji: '💚',
    description: 'Build healthy habits for body and mind',
  },
  {
    id: 'fitness',
    name: 'Fitness & Exercise',
    emoji: '💪',
    description: 'Stay active and build strength',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    emoji: '🎯',
    description: 'Get more done and stay focused',
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness & Mental Health',
    emoji: '🧘',
    description: 'Practice mindfulness and self-care',
  },
  {
    id: 'learning',
    name: 'Learning & Growth',
    emoji: '📚',
    description: 'Expand your knowledge and skills',
  },
  {
    id: 'social',
    name: 'Social & Relationships',
    emoji: '👥',
    description: 'Connect with others and build relationships',
  },
];

export const habitTemplates: HabitTemplate[] = [
  // Health & Wellness
  {
    id: 'drink-water',
    name: 'Drink 8 glasses of water',
    emoji: '💧',
    category: 'health',
    description: 'Stay hydrated throughout the day',
    suggestedColor: '#3B82F6',
    suggestedDays: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: 'take-vitamins',
    name: 'Take vitamins',
    emoji: '💊',
    category: 'health',
    description: 'Remember your daily supplements',
    suggestedColor: '#EF4444',
    suggestedDays: [0, 1, 2, 3, 4, 5, 6],
    suggestedTime: '08:00',
  },
  {
    id: 'healthy-breakfast',
    name: 'Eat a healthy breakfast',
    emoji: '🥗',
    category: 'health',
    description: 'Start your day with nutritious food',
    suggestedColor: '#10B981',
    suggestedDays: [0, 1, 2, 3, 4, 5, 6],
    suggestedTime: '07:30',
  },
  {
    id: 'sleep-8-hours',
    name: 'Sleep 8 hours',
    emoji: '😴',
    category: 'health',
    description: 'Get enough rest for recovery',
    suggestedColor: '#8B5CF6',
    suggestedDays: [0, 1, 2, 3, 4, 5, 6],
    suggestedTime: '22:00',
  },

  // Fitness & Exercise
  {
    id: 'morning-workout',
    name: 'Morning workout',
    emoji: '🏃',
    category: 'fitness',
    description: 'Start your day with exercise',
    suggestedColor: '#F59E0B',
    suggestedDays: [1, 2, 3, 4, 5],
    suggestedTime: '06:30',
  },
  {
    id: 'yoga',
    name: 'Practice yoga',
    emoji: '🧘',
    category: 'fitness',
    description: 'Improve flexibility and mindfulness',
    suggestedColor: '#8B5CF6',
    suggestedDays: [0, 2, 4, 6],
    suggestedTime: '07:00',
  },
  {
    id: 'walk-10k-steps',
    name: 'Walk 10,000 steps',
    emoji: '👟',
    category: 'fitness',
    description: 'Stay active throughout the day',
    suggestedColor: '#3B82F6',
    suggestedDays: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: 'stretch',
    name: 'Stretch for 10 minutes',
    emoji: '🤸',
    category: 'fitness',
    description: 'Improve flexibility and prevent injury',
    suggestedColor: '#10B981',
    suggestedDays: [0, 1, 2, 3, 4, 5, 6],
    suggestedTime: '19:00',
  },

  // Productivity
  {
    id: 'plan-day',
    name: 'Plan my day',
    emoji: '📝',
    category: 'productivity',
    description: 'Set intentions and priorities',
    suggestedColor: '#F59E0B',
    suggestedDays: [1, 2, 3, 4, 5],
    suggestedTime: '08:00',
  },
  {
    id: 'deep-work',
    name: '2 hours of deep work',
    emoji: '💻',
    category: 'productivity',
    description: 'Focus on important tasks',
    suggestedColor: '#3B82F6',
    suggestedDays: [1, 2, 3, 4, 5],
    suggestedTime: '09:00',
  },
  {
    id: 'inbox-zero',
    name: 'Clear email inbox',
    emoji: '📧',
    category: 'productivity',
    description: 'Stay on top of communications',
    suggestedColor: '#EF4444',
    suggestedDays: [1, 2, 3, 4, 5],
    suggestedTime: '16:00',
  },
  {
    id: 'review-goals',
    name: 'Review weekly goals',
    emoji: '🎯',
    category: 'productivity',
    description: 'Track progress and adjust plans',
    suggestedColor: '#8B5CF6',
    suggestedDays: [0],
    suggestedTime: '10:00',
  },

  // Mindfulness & Mental Health
  {
    id: 'meditate',
    name: 'Meditate for 10 minutes',
    emoji: '🧘',
    category: 'mindfulness',
    description: 'Practice mindfulness and reduce stress',
    suggestedColor: '#8B5CF6',
    suggestedDays: [0, 1, 2, 3, 4, 5, 6],
    suggestedTime: '07:00',
  },
  {
    id: 'gratitude-journal',
    name: 'Write in gratitude journal',
    emoji: '📔',
    category: 'mindfulness',
    description: 'Reflect on positive moments',
    suggestedColor: '#F59E0B',
    suggestedDays: [0, 1, 2, 3, 4, 5, 6],
    suggestedTime: '21:00',
  },
  {
    id: 'no-phone-morning',
    name: 'No phone for 1 hour after waking',
    emoji: '📵',
    category: 'mindfulness',
    description: 'Start your day mindfully',
    suggestedColor: '#EF4444',
    suggestedDays: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: 'breathing-exercise',
    name: 'Practice breathing exercises',
    emoji: '🌬️',
    category: 'mindfulness',
    description: 'Calm your mind and reduce anxiety',
    suggestedColor: '#3B82F6',
    suggestedDays: [0, 1, 2, 3, 4, 5, 6],
    suggestedTime: '12:00',
  },

  // Learning & Growth
  {
    id: 'read-30-min',
    name: 'Read for 30 minutes',
    emoji: '📚',
    category: 'learning',
    description: 'Expand your knowledge',
    suggestedColor: '#10B981',
    suggestedDays: [0, 1, 2, 3, 4, 5, 6],
    suggestedTime: '20:00',
  },
  {
    id: 'learn-language',
    name: 'Practice a new language',
    emoji: '🗣️',
    category: 'learning',
    description: 'Build language skills daily',
    suggestedColor: '#F59E0B',
    suggestedDays: [0, 1, 2, 3, 4, 5, 6],
    suggestedTime: '18:00',
  },
  {
    id: 'online-course',
    name: 'Complete one lesson',
    emoji: '🎓',
    category: 'learning',
    description: 'Make progress on online courses',
    suggestedColor: '#8B5CF6',
    suggestedDays: [1, 2, 3, 4, 5],
    suggestedTime: '19:00',
  },
  {
    id: 'podcast',
    name: 'Listen to educational podcast',
    emoji: '🎧',
    category: 'learning',
    description: 'Learn while commuting or exercising',
    suggestedColor: '#3B82F6',
    suggestedDays: [1, 2, 3, 4, 5],
  },

  // Social & Relationships
  {
    id: 'call-family',
    name: 'Call family or friends',
    emoji: '📞',
    category: 'social',
    description: 'Stay connected with loved ones',
    suggestedColor: '#EF4444',
    suggestedDays: [0, 3, 6],
    suggestedTime: '19:00',
  },
  {
    id: 'quality-time',
    name: 'Spend quality time with partner',
    emoji: '❤️',
    category: 'social',
    description: 'Nurture your relationship',
    suggestedColor: '#EC4899',
    suggestedDays: [0, 2, 4, 6],
    suggestedTime: '20:00',
  },
  {
    id: 'compliment-someone',
    name: 'Give a genuine compliment',
    emoji: '💬',
    category: 'social',
    description: 'Spread positivity',
    suggestedColor: '#F59E0B',
    suggestedDays: [1, 2, 3, 4, 5],
  },
  {
    id: 'social-activity',
    name: 'Attend a social event',
    emoji: '🎉',
    category: 'social',
    description: 'Build and maintain friendships',
    suggestedColor: '#8B5CF6',
    suggestedDays: [5, 6],
  },
];

export const templateService = {
  getAllTemplates(): HabitTemplate[] {
    return habitTemplates;
  },

  getTemplatesByCategory(category: TemplateCategory): HabitTemplate[] {
    return habitTemplates.filter(t => t.category === category);
  },

  getTemplateById(id: string): HabitTemplate | undefined {
    return habitTemplates.find(t => t.id === id);
  },

  getCategories(): TemplateCategoryInfo[] {
    return templateCategories;
  },

  getCategoryInfo(category: TemplateCategory): TemplateCategoryInfo | undefined {
    return templateCategories.find(c => c.id === category);
  },
};
