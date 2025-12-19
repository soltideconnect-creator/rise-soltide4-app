import { Home, Calendar, BarChart3, Activity, Moon, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'calendar' | 'stats' | 'analytics' | 'sleep' | 'settings';
  onTabChange: (tab: 'home' | 'calendar' | 'stats' | 'analytics' | 'sleep' | 'settings') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'calendar' as const, icon: Calendar, label: 'Calendar' },
    { id: 'stats' as const, icon: BarChart3, label: 'Stats' },
    { id: 'analytics' as const, icon: Activity, label: 'Analytics' },
    { id: 'sleep' as const, icon: Moon, label: 'Sleep' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Glassmorphism container with floating effect */}
      <div className="mx-2 mb-2 rounded-2xl overflow-hidden shadow-2xl">
        {/* Multi-layer glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background/80 backdrop-blur-2xl" />
        
        {/* Subtle gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-primary/5 to-transparent pointer-events-none" />
        
        {/* Top border glow effect */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        {/* Content */}
        <div className="relative">
          <div className="flex items-center justify-around h-16 px-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`
                    flex flex-col items-center justify-center flex-1 h-full 
                    transition-all duration-300 active:scale-90 rounded-xl
                    ${isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                  type="button"
                >
                  <div className={`
                    transition-all duration-300 relative
                    ${isActive ? 'scale-110' : 'scale-100'}
                  `}>
                    {/* Active indicator glow */}
                    {isActive && (
                      <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150" />
                    )}
                    <Icon className={`w-6 h-6 relative z-10 ${isActive ? 'fill-current drop-shadow-lg' : ''}`} />
                  </div>
                  <span className={`
                    text-xs mt-1 font-medium transition-all duration-300
                    ${isActive ? 'opacity-100 font-semibold' : 'opacity-60'}
                  `}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
