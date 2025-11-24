import { useState, useEffect } from 'react';
import { CircularProgress } from '@/components/CircularProgress';
import { HabitItem } from '@/components/HabitItem';
import { HabitNotesDialog } from '@/components/HabitNotesDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { habitStorage } from '@/services/habitStorage';
import { haptics } from '@/services/haptics';
import type { Habit } from '@/types/habit';
import { Confetti } from '@/components/Confetti';
import { toast } from 'sonner';
import { MOTIVATIONAL_QUOTES } from '@/types/habit';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface HomeProps {
  onAddHabit: () => void;
  onEditHabit: (habit: Habit) => void;
}

export function Home({ onAddHabit, onEditHabit }: HomeProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [habitForNotes, setHabitForNotes] = useState<Habit | null>(null);
  const [isPremium, setIsPremium] = useState(false);

  const loadData = () => {
    const allHabits = habitStorage.getHabits();
    const today = new Date();
    const dayOfWeek = today.getDay();
    const todayHabits = allHabits.filter(h => h.weekdays.includes(dayOfWeek));
    setHabits(todayHabits);
    setProgress(habitStorage.getTodayProgress());
  };

  useEffect(() => {
    loadData();
    const premium = localStorage.getItem('streak_ads_removed') === 'true';
    setIsPremium(premium);
  }, []);

  const handleToggle = (habitId: string) => {
    const wasCompleted = habitStorage.isCompleted(habitId, new Date());
    const isNowCompleted = habitStorage.toggleCompletion(habitId, new Date());
    loadData();

    if (isNowCompleted && !wasCompleted) {
      const streak = habitStorage.getHabitStreak(habitId);
      const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
      
      haptics.success();
      
      toast.success(randomQuote, {
        duration: 4000,
      });

      if (streak === 7 || streak === 30 || streak === 100) {
        setShowConfetti(true);
        haptics.milestone();
        toast.success(`🎉 Amazing! You've reached a ${streak}-day streak!`, {
          duration: 5000,
        });
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else if (!isNowCompleted && wasCompleted) {
      haptics.light();
    }
  };

  const handleDelete = (habitId: string) => {
    setHabitToDelete(habitId);
  };

  const confirmDelete = () => {
    if (habitToDelete) {
      habitStorage.deleteHabit(habitToDelete);
      loadData();
      toast.success('Habit deleted successfully');
      setHabitToDelete(null);
    }
  };

  const handleSaveNotes = (notes: string) => {
    if (habitForNotes) {
      habitStorage.updateHabit(habitForNotes.id, { notes });
      loadData();
      toast.success('Notes saved successfully');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <Confetti trigger={showConfetti} />
      
      <div className="container max-w-2xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Today's Progress</h1>
          <p className="text-muted-foreground">Keep the streak alive! 🔥</p>
        </div>

        <div className="flex justify-center py-8">
          <CircularProgress percentage={progress.percentage} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Today's Habits</h2>
            <span className="text-sm text-muted-foreground">
              {progress.completed} of {progress.total} completed
            </span>
          </div>

          {habits.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground text-lg">No habits scheduled for today</p>
              <Button onClick={onAddHabit} size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Habit
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  streak={habitStorage.getHabitStreak(habit.id)}
                  isCompleted={habitStorage.isCompleted(habit.id, new Date())}
                  onToggle={() => handleToggle(habit.id)}
                  onEdit={() => onEditHabit(habit)}
                  onDelete={() => handleDelete(habit.id)}
                  onNotes={() => setHabitForNotes(habit)}
                  isPremium={isPremium}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-20 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={onAddHabit}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <AlertDialog open={habitToDelete !== null} onOpenChange={() => setHabitToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this habit and all its completion history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {habitForNotes && (
        <HabitNotesDialog
          habit={habitForNotes}
          open={habitForNotes !== null}
          onOpenChange={(open) => !open && setHabitForNotes(null)}
          onSave={handleSaveNotes}
        />
      )}
    </div>
  );
}
