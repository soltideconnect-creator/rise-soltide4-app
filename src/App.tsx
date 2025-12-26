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
import { OfflineBilling } from '@/utils/billing-offline';
import { errorRecovery } from '@/utils/errorRecovery';

// Helper function to check if we're on Android
const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

// Helper function to check if we're in development environment
const isDevelopmentEnvironment = () => {
  // Check if running on localhost or development domains
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '';
  const isDevDomain = hostname.includes('dev.') || hostname.includes('staging.');
  
  // NEVER show debug center on production domains
  const isProductionDomain = hostname.includes('medo.dev') || 
                             hostname.includes('netlify.app') ||
                             hostname.includes('vercel.app');
  
  // Only allow debug center on localhost or explicit dev domains
  return (isLocalhost || isDevDomain) && !isProductionDomain;
};

/**
 * ============================================================================
 * NAVIGATION SYSTEM - READ THIS BEFORE ADDING NAVIGATION
 * ============================================================================
 * 
 * This app uses VIEW-BASED NAVIGATION with setCurrentView().
 * 
 * ❌ DO NOT USE:
 *    - window.location.href = '#/stats'
 *    - window.location.hash = '#stats'
 *    - <a href="#/stats">
 *    - Any hash-based navigation
 * 
 * ✅ CORRECT WAY TO NAVIGATE:
 * 
 * 1. Add navigation prop to your component:
 *    interface MyComponentProps {
 *      onNavigateToStats?: () => void;
 *    }
 * 
 * 2. Pass callback from App.tsx:
 *    <MyComponent onNavigateToStats={() => setCurrentView('stats')} />
 * 
 * 3. Use it in your component:
 *    <Button onClick={() => onNavigateToStats?.()}>
 *      Go to Stats
 *    </Button>
 * 
 * EXAMPLE: See Sleep component for correct implementation
 * 
 * ============================================================================
 */

type View = 'home' | 'calendar' | 'stats' | 'analytics' | 'sleep' | 'settings' | 'about' | 'add' | 'edit' | 'debug';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Async initialization function
    const initializeApp = async () => {
      try {
        console.log('App initializing...');
        
        // Initialize error recovery system
        errorRecovery.initializeErrorRecovery();
        
        // Check app health
        const health = errorRecovery.checkAppHealth();
        if (!health.healthy) {
          console.warn('⚠️ App health issues detected:', health.issues);
        }
        
        // ANDROID: Automatically restore purchases on app start
        if (isAndroid()) {
          console.log('Android detected - attempting automatic purchase restoration...');
          try {
            const restored = await OfflineBilling.restore();
            if (restored) {
              console.log('✅ Premium automatically restored from Google Play');
            } else {
              console.log('ℹ️ No previous purchase found');
            }
          } catch (error) {
            console.warn('Could not restore purchases automatically:', error);
            errorRecovery.logError(error as Error, 'purchase_restoration');
            // Don't block app initialization if restoration fails
          }
        }
      
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
        errorRecovery.logError(error as Error, 'app_initialization');
        setIsInitialized(true); // Still set to true to show error state
      }
    };
    
    // Call the async initialization function
    initializeApp();
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
          <div className="text-lg font-medium">Loading Rise...</div>
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
          {currentView === 'sleep' && <Sleep onNavigateToStats={() => setCurrentView('stats')} />}
          {currentView === 'settings' && (
            <Settings 
              onNavigateToAbout={handleNavigateToAbout}
              onNavigateToDebug={isDevelopmentEnvironment() ? () => setCurrentView('debug') : undefined}
            />
          )}
          {currentView === 'about' && <About onBack={handleBackFromAbout} />}
          {isDevelopmentEnvironment() && currentView === 'debug' && (
            <div className="container max-w-2xl mx-auto px-4 py-6">
              <h1 className="text-2xl font-bold mb-4">Debug Center</h1>
              <p className="text-muted-foreground">
                Debug Center is only available on localhost. 
                This page is hidden on production domains (medo.dev, netlify.app, vercel.app).
              </p>
            </div>
          )}
          {(currentView === 'add' || currentView === 'edit') && (
            <HabitForm
              habit={editingHabit}
              onSave={handleSaveHabit}
              onCancel={handleCancelForm}
            />
          )}

          {currentView !== 'add' && currentView !== 'edit' && currentView !== 'about' && currentView !== 'debug' && (
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

export default App

