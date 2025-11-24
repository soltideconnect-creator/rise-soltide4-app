import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StickyNote } from 'lucide-react';
import type { Habit } from '@/types/habit';

interface HabitNotesDialogProps {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (notes: string) => void;
}

export function HabitNotesDialog({ habit, open, onOpenChange, onSave }: HabitNotesDialogProps) {
  const [notes, setNotes] = useState(habit.notes || '');

  const handleSave = () => {
    onSave(notes);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{habit.emoji}</span>
            <span>Notes for {habit.name}</span>
          </DialogTitle>
          <DialogDescription>
            Add personal notes, reflections, or reminders for this habit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="notes" className="flex items-center gap-2">
            <StickyNote className="w-4 h-4" />
            Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Write your thoughts, progress, or any reminders..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            {notes.length} / 500 characters
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Notes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
