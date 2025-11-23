import { useState, useEffect } from 'react';
import { Onboarding } from '@/components/Onboarding';
import { Home } from '@/pages/Home';
import { Calendar } from '@/pages/Calendar';
import { Stats } from '@/pages/Stats';
import { HabitForm } from '@/pages/HabitForm';
import { BottomNav } from '@/components/BottomNav';
import { habitStorage } from '@/services/habitStorage';
import type { Habit } from '@/types/habit';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

type View = 'home' | 'calendar' | 'stats' | 'add' | 'edit';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  useEffect(() => {
    if (!habitStorage.isOnboardingCompleted()) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    habitStorage.setOnboardingCompleted();
    setShowOnboarding(false);
  };

  const handleAddHabit = () => {
    setEditingHabit(undefined);
    setCurrentView('add');
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setCurrentView('edit');
  };

  const handleSaveHabit = () => {
    setCurrentView('home');
    setEditingHabit(undefined);
  };

  const handleCancelForm = () => {
    setCurrentView('home');
    setEditingHabit(undefined);
  };

  const handleTabChange = (tab: 'home' | 'calendar' | 'stats') => {
    setCurrentView(tab);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        {currentView === 'home' && (
          <Home onAddHabit={handleAddHabit} onEditHabit={handleEditHabit} />
        )}
        {currentView === 'calendar' && <Calendar />}
        {currentView === 'stats' && <Stats />}
        {(currentView === 'add' || currentView === 'edit') && (
          <HabitForm
            habit={editingHabit}
            onSave={handleSaveHabit}
            onCancel={handleCancelForm}
          />
        )}

        {currentView !== 'add' && currentView !== 'edit' && (
          <BottomNav
            activeTab={currentView as 'home' | 'calendar' | 'stats'}
            onTabChange={handleTabChange}
          />
        )}

        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
