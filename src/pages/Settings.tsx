import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { habitStorage } from '@/services/habitStorage';
import { notifications } from '@/services/notifications';
import { audioService, ALARM_SOUNDS, type AlarmSoundType } from '@/services/audioService';
import { themeService } from '@/services/themeService';
import { sleepStorage } from '@/services/sleepStorage';
import { toast } from 'sonner';
import {
  Moon,
  Sun,
  Bell,
  Download,
  Upload,
  Trash2,
  Info,
  ChevronRight,
  Volume2,
  Play,
  Palette,
  Check,
} from 'lucide-react';
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
import { ShareButton } from '@/components/ShareButton';

interface SettingsProps {
  onNavigateToAbout: () => void;
}

export function Settings({ onNavigateToAbout }: SettingsProps) {
  const [isDarkMode, setIsDarkMode] = useState(themeService.isDarkMode());
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    notifications.getPermission() === 'granted'
  );
  const [isPremium, setIsPremium] = useState(false);
  const [selectedAlarmSound, setSelectedAlarmSound] = useState<AlarmSoundType>('gentle');
  const [playingSound, setPlayingSound] = useState<AlarmSoundType | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState('default');

  useEffect(() => {
    // Check premium status
    const premium = localStorage.getItem('streak_ads_removed') === 'true';
    setIsPremium(premium);

    if (premium) {
      // Load saved alarm sound
      const alarmSettings = sleepStorage.getAlarmSettings();
      setSelectedAlarmSound(alarmSettings.sound);

      // Load saved theme
      const savedTheme = themeService.getCurrentTheme();
      setSelectedThemeId(savedTheme.id);
    }
  }, []);

  const handleThemeToggle = () => {
    const newMode = themeService.toggleDarkMode();
    setIsDarkMode(newMode);
  };

  const handleThemeChange = (themeId: string) => {
    const selectedTheme = themeService.getThemeById(themeId);
    if (selectedTheme) {
      // Save and apply theme
      themeService.setTheme(themeId);
      setSelectedThemeId(themeId);
      toast.success(`Theme changed to ${selectedTheme.name}`);
    }
  };

  const handleAlarmSoundChange = (soundType: AlarmSoundType) => {
    setSelectedAlarmSound(soundType);
    
    // Save to alarm settings
    const currentSettings = sleepStorage.getAlarmSettings();
    sleepStorage.saveAlarmSettings({
      ...currentSettings,
      sound: soundType,
    });

    toast.success(`Alarm sound changed to ${ALARM_SOUNDS.find(s => s.id === soundType)?.name}`);
  };

  const handlePlayPreview = (soundType: AlarmSoundType) => {
    if (playingSound === soundType) {
      // Stop current sound
      audioService.stopSound();
      setPlayingSound(null);
    } else {
      // Stop any playing sound and play new one
      audioService.stopSound();
      audioService.playPreview(soundType);
      setPlayingSound(soundType);

      // Auto-stop after 3 seconds
      setTimeout(() => {
        setPlayingSound(null);
      }, 3000);
    }
  };

  const handleNotificationToggle = async () => {
    if (notificationsEnabled) {
      notifications.cancelAllReminders();
      setNotificationsEnabled(false);
      toast.success('Notifications disabled');
    } else {
      const permission = await notifications.requestPermission();
      if (permission === 'granted') {
        const habits = habitStorage.getHabits();
        notifications.scheduleAllHabits(habits);
        setNotificationsEnabled(true);
        toast.success('Notifications enabled');
      } else {
        toast.error('Notification permission denied');
      }
    }
  };

  const handleExportData = () => {
    try {
      const habits = habitStorage.getHabits();
      const completions = habitStorage.getCompletions();
      const data = {
        habits,
        completions,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `streak-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.habits && data.completions) {
            habitStorage.saveHabits(data.habits);
            localStorage.setItem('streak_completions', JSON.stringify(data.completions));
            toast.success('Data imported successfully. Refreshing...');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            toast.error('Invalid backup file format');
          }
        } catch (error) {
          toast.error('Failed to import data');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearAllData = () => {
    setShowClearDialog(true);
  };

  const confirmClearData = () => {
    localStorage.clear();
    toast.success('All data cleared. Refreshing...');
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleResetOnboarding = () => {
    localStorage.removeItem('streak_onboarding_completed');
    toast.success('Onboarding reset. Refreshing...');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Appearance */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Appearance
          </CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-0.5">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                {isDarkMode ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <Switch
              id="theme-toggle"
              checked={isDarkMode}
              onCheckedChange={handleThemeToggle}
            />
          </div>

          {isPremium && (
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-primary" />
                <Label>Color Theme</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {themeService.getAllThemes().map((themeOption) => (
                  <button
                    key={themeOption.id}
                    type="button"
                    onClick={() => handleThemeChange(themeOption.id)}
                    className={`relative p-3 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                      selectedThemeId === themeOption.id
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{themeOption.name}</span>
                      {selectedThemeId === themeOption.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <div
                        className="w-7 h-7 rounded-full border-2 border-background shadow-sm"
                        style={{ backgroundColor: `hsl(${themeOption.colors.primary})` }}
                      />
                      <div
                        className="w-7 h-7 rounded-full border-2 border-background shadow-sm"
                        style={{ backgroundColor: `hsl(${themeOption.colors.accent})` }}
                      />
                      <div
                        className="w-7 h-7 rounded-full border-2 border-background shadow-sm"
                        style={{ backgroundColor: `hsl(${themeOption.colors.success})` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tap any theme to apply it instantly
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage daily reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications-toggle">Daily Reminders</Label>
              <p className="text-sm text-muted-foreground">
                {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <Switch
              id="notifications-toggle"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Alarm Sound (Premium Only) */}
      {isPremium && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Smart Alarm Sound
            </CardTitle>
            <CardDescription>Choose your wake-up sound (offline)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ALARM_SOUNDS.map((sound) => (
              <div
                key={sound.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedAlarmSound === sound.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleAlarmSoundChange(sound.id)}
              >
                <div className="flex-1">
                  <p className="font-medium">{sound.name}</p>
                  <p className="text-sm text-muted-foreground">{sound.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedAlarmSound === sound.id && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPreview(sound.id);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Play
                      className={`w-4 h-4 ${
                        playingSound === sound.id ? 'text-primary' : ''
                      }`}
                    />
                  </Button>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tap any sound to select it, or tap the play button to preview (3 seconds)
            </p>
          </CardContent>
        </Card>
      )}

      {/* Data Management */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Backup and restore your habits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExportData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleImportData}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleClearAllData}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Data
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleResetOnboarding}
          >
            <Info className="w-4 h-4 mr-2" />
            Reset Onboarding
          </Button>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About
          </CardTitle>
          <CardDescription>Learn more about Rise</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={onNavigateToAbout}
          >
            <span>About Rise</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Share Rise - Viral Growth Feature */}
      <div className="mb-4">
        <ShareButton />
      </div>

      {/* Clear Data Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your habits, completions, and settings. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClearData}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

