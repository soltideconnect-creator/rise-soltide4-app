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
      {/* Glassmorphism container with backdrop blur */}
      <div className="relative mx-2 mb-2 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Backdrop blur effect */}
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl" />
        
        {/* Border overlay for subtle definition */}
        <div className="absolute inset-0 rounded-3xl border border-gray-200/50 dark:border-gray-700/50" />
        
        {/* Content */}
        <div className="relative">
          <div className="container max-w-2xl mx-auto px-2">
            <div className="flex items-center justify-around h-20 gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`
                      relative flex flex-col items-center justify-center flex-1 h-14 rounded-2xl
                      transition-all duration-300 ease-out active:scale-95
                      ${isActive 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                      }
                    `}
                    type="button"
                  >
                    {/* Icon with fill effect for active state */}
                    <Icon 
                      className={`w-6 h-6 transition-all duration-300 ${
                        isActive ? 'fill-current stroke-[1.5]' : 'stroke-[2]'
                      }`} 
                    />
                    
                    {/* Label - always visible, bold when active */}
                    <span 
                      className={`text-[10px] mt-1 transition-all duration-300 ${
                        isActive ? 'font-bold' : 'font-medium'
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
