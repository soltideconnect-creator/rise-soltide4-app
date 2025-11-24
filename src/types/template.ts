export interface HabitTemplate {
  id: string;
  name: string;
  emoji: string;
  category: TemplateCategory;
  description: string;
  suggestedColor: string;
  suggestedDays: number[]; // 0-6 (Sunday-Saturday)
  suggestedTime?: string;
}

export type TemplateCategory = 
  | 'health'
  | 'fitness'
  | 'productivity'
  | 'mindfulness'
  | 'learning'
  | 'social';

export interface TemplateCategoryInfo {
  id: TemplateCategory;
  name: string;
  emoji: string;
  description: string;
}
