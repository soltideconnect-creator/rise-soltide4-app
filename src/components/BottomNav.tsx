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
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="container max-w-2xl mx-auto">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-150 active:scale-95 ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                type="button"
              >
                <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
