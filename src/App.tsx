import React, { useState, useEffect } from 'react';
import { Onboarding } from '@/components/Onboarding';
import { Home } from '@/pages/Home';
import { Calendar } from '@/pages/Calendar';
import { Stats } from '@/pages/Stats';
import { Analytics } from '@/pages/Analytics';
import Sleep from '@/pages/Sleep';
import { Settings } from '@/pages/Settings';
import { About } from '@/pages/About';
import { HabitForm } from '@/pages/HabitForm';
import { BottomNav } from '@/components/BottomNav';
import { habitStorage } from '@/services/habitStorage';
import { notifications } from '@/services/notifications';
import { themeService } from '@/services/themeService';
import type { Habit } from '@/types/habit';
import { Toaster } from '@/components/ui/sonner';

type View = 'home' | 'calendar' | 'stats' | 'analytics' | 'sleep' | 'settings' | 'about' | 'add' | 'edit';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      console.log('App initializing...');
      
      // PRODUCTION MODE: Premium must be purchased (no test unlock)
      // Premium is only unlocked after real Paystack or Google Play purchase
      console.log('Premium status:', localStorage.getItem('streak_ads_removed') === 'true' ? 'Unlocked' : 'Locked');
      
      // Initialize theme
      themeService.initializeTheme();
      console.log('Theme initialized');
      
      // Check onboarding status
      const onboardingCompleted = habitStorage.isOnboardingCompleted();
      console.log('Onboarding completed:', onboardingCompleted);
      
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      } else {
        const habits = habitStorage.getHabits();
        console.log('Loaded habits:', habits.length);
        notifications.scheduleAllHabits(habits);
      }
      
      setIsInitialized(true);
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error during app initialization:', error);
      setIsInitialized(true); // Still set to true to show error state
    }
  }, []);

  const handleOnboardingComplete = () => {
    habitStorage.setOnboardingCompleted();
    setShowOnboarding(false);
    const habits = habitStorage.getHabits();
    notifications.scheduleAllHabits(habits);
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
    const habits = habitStorage.getHabits();
    notifications.cancelAllReminders();
    notifications.scheduleAllHabits(habits);
  };

  const handleCancelForm = () => {
    setCurrentView('home');
    setEditingHabit(undefined);
  };

  const handleTabChange = (tab: 'home' | 'calendar' | 'stats' | 'analytics' | 'sleep' | 'settings') => {
    setCurrentView(tab);
  };

  const handleNavigateToAbout = () => {
    setCurrentView('about');
  };

  const handleBackFromAbout = () => {
    setCurrentView('settings');
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔥</div>
          <div className="text-lg font-medium">Loading Streak...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <div className="min-h-screen bg-background">
          {currentView === 'home' && (
            <Home onAddHabit={handleAddHabit} onEditHabit={handleEditHabit} />
          )}
          {currentView === 'calendar' && <Calendar />}
          {currentView === 'stats' && <Stats />}
          {currentView === 'analytics' && <Analytics />}
          {currentView === 'sleep' && <Sleep />}
          {currentView === 'settings' && <Settings onNavigateToAbout={handleNavigateToAbout} />}
          {currentView === 'about' && <About onBack={handleBackFromAbout} />}
          {(currentView === 'add' || currentView === 'edit') && (
            <HabitForm
              habit={editingHabit}
              onSave={handleSaveHabit}
              onCancel={handleCancelForm}
            />
          )}

          {currentView !== 'add' && currentView !== 'edit' && currentView !== 'about' && (
            <BottomNav
              activeTab={currentView as 'home' | 'calendar' | 'stats' | 'analytics' | 'sleep' | 'settings'}
              onTabChange={handleTabChange}
            />
          )}

          <Toaster />
        </div>
      )}
    </>
  );
}

export default App;
