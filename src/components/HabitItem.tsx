import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import type { Habit } from '@/types/habit';
import { Pencil, Trash2, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HabitItemProps {
  habit: Habit;
  streak: number;
  isCompleted: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onNotes?: () => void;
  isPremium?: boolean;
}

export function HabitItem({ habit, streak, isCompleted, onToggle, onEdit, onDelete, onNotes, isPremium }: HabitItemProps) {
  return (
    <Card
      className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer group"
      style={{ borderLeftColor: habit.color, borderLeftWidth: '4px' }}
    >
      <div className="flex-1 flex items-center gap-4" onClick={onToggle}>
        <div className="text-4xl">{habit.emoji}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{habit.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span className="text-base">🔥</span>
            <span className="font-medium text-streak">{streak} day streak</span>
          </div>
          {habit.notes && (
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <StickyNote className="w-3 h-3" />
              <span className="line-clamp-1">{habit.notes}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isPremium && onNotes && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onNotes();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="Add notes"
          >
            <StickyNote className={`w-4 h-4 ${habit.notes ? 'text-primary' : ''}`} />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <Checkbox
          checked={isCompleted}
          onCheckedChange={onToggle}
          className="w-8 h-8 data-[state=checked]:bg-success data-[state=checked]:border-success"
        />
      </div>
    </Card>
  );
}
