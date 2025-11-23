import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { habitStorage } from '@/services/habitStorage';
import { notifications } from '@/services/notifications';
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

interface SettingsProps {
  onNavigateToAbout: () => void;
}

export function Settings({ onNavigateToAbout }: SettingsProps) {
  const { theme, setTheme } = useTheme();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    notifications.getPermission() === 'granted'
  );

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
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

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Appearance */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Appearance
          </CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                {theme === 'dark' ? 'Enabled' : 'Disabled'}
              </p>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={handleThemeToggle}
            />
          </div>
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
        </CardContent>
      </Card>

      {/* About */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About
          </CardTitle>
          <CardDescription>Learn more about Streak</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={onNavigateToAbout}
          >
            <span>About Streak</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

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
