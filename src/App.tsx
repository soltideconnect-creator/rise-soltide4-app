import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';

// Simple test to verify React is working
function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('=== STREAK APP DEBUG ===');
    console.log('App component mounted');
    console.log('React is working!');
    setMounted(true);
  }, []);

  console.log('App render, mounted:', mounted);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '2rem',
        padding: '2rem',
        fontFamily: 'system-ui, sans-serif',
        background: '#f5f5f5'
      }}>
        <div style={{ fontSize: '5rem' }}>🔥</div>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold',
          color: '#5E5CE6',
          margin: 0
        }}>
          Streak App
        </h1>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <p style={{ 
            fontSize: '1.5rem', 
            color: '#333',
            marginBottom: '1rem'
          }}>
            ✅ React is working!
          </p>
          <p style={{ 
            fontSize: '1rem', 
            color: '#666',
            marginBottom: '1rem'
          }}>
            If you see this message, the app is loading correctly.
          </p>
          <p style={{ 
            fontSize: '0.9rem', 
            color: '#999',
            fontFamily: 'monospace',
            background: '#f0f0f0',
            padding: '1rem',
            borderRadius: '0.5rem'
          }}>
            Mounted: {mounted ? 'Yes' : 'No'}<br/>
            Check browser console (F12) for debug messages
          </p>
        </div>
        <button
          onClick={() => {
            console.log('Button clicked!');
            alert('Button works! Check console for logs.');
          }}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            background: '#5E5CE6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Test Button
        </button>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;

/* 
ORIGINAL APP CODE - TEMPORARILY DISABLED FOR DEBUGGING

import { useState, useEffect } from 'react';
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
import { ThemeProvider } from 'next-themes';

type View = 'home' | 'calendar' | 'stats' | 'analytics' | 'sleep' | 'settings' | 'about' | 'add' | 'edit';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      console.log('App initializing...');
      
      // Enable premium features by default for testing
      localStorage.setItem('streak_ads_removed', 'true');
      console.log('Premium features enabled');
      
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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
    </ThemeProvider>
  );
}

export default App;

*/
