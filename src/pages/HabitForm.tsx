import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { EmojiPicker } from '@/components/EmojiPicker';
import { ColorPicker } from '@/components/ColorPicker';
import { WeekdaySelector } from '@/components/WeekdaySelector';
import { habitStorage } from '@/services/habitStorage';
import type { Habit } from '@/types/habit';
import { PRESET_COLORS } from '@/types/habit';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

interface HabitFormProps {
  habit?: Habit;
  onSave: () => void;
  onCancel: () => void;
}

export function HabitForm({ habit, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || '');
  const [emoji, setEmoji] = useState(habit?.emoji || '💪');
  const [color, setColor] = useState(habit?.color || PRESET_COLORS[0]);
  const [reminderTime, setReminderTime] = useState(habit?.reminderTime || '09:00');
  const [weekdays, setWeekdays] = useState<number[]>(habit?.weekdays || [0, 1, 2, 3, 4, 5, 6]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    if (weekdays.length === 0) {
      toast.error('Please select at least one day');
      return;
    }

    if (habit) {
      habitStorage.updateHabit(habit.id, {
        name: name.trim(),
        emoji,
        color,
        reminderTime,
        weekdays,
      });
      toast.success('Habit updated successfully');
    } else {
      habitStorage.addHabit({
        name: name.trim(),
        emoji,
        color,
        reminderTime,
        weekdays,
      });
      toast.success('Habit created successfully');
    }

    onSave();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={onCancel} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{habit ? 'Edit Habit' : 'New Habit'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                placeholder="e.g., Morning Exercise"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Emoji Icon</Label>
              <EmojiPicker value={emoji} onChange={setEmoji} />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <ColorPicker value={color} onChange={setColor} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Daily Reminder</Label>
              <Input
                id="time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Repeat On</Label>
              <WeekdaySelector value={weekdays} onChange={setWeekdays} />
            </div>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {habit ? 'Update Habit' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
