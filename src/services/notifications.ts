import type { Habit } from '@/types/habit';

export const notifications = {
  isSupported(): boolean {
    return 'Notification' in window;
  },

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    return await Notification.requestPermission();
  },

  async scheduleHabitReminder(habit: Habit): Promise<void> {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return;
    }

    const [hours, minutes] = habit.reminderTime.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    const notificationId = `habit_${habit.id}`;
    const existingTimeout = this.getScheduledNotification(notificationId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeoutId = window.setTimeout(() => {
      this.showNotification(habit);
      this.scheduleHabitReminder(habit);
    }, timeUntilNotification);

    this.saveScheduledNotification(notificationId, timeoutId);
  },

  showNotification(habit: Habit): void {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return;
    }

    const notification = new Notification('Streak – Daily Habit Tracker', {
      body: `Don't break the chain! Complete your habits 🔥\n${habit.emoji} ${habit.name}`,
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: `habit_${habit.id}`,
      requireInteraction: false,
      silent: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    setTimeout(() => notification.close(), 10000);
  },

  showDailyReminder(): void {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return;
    }

    new Notification('Streak – Daily Habit Tracker', {
      body: "Don't break the chain! Complete your habits 🔥",
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'daily_reminder',
      requireInteraction: false,
    });
  },

  cancelHabitReminder(habitId: string): void {
    const notificationId = `habit_${habitId}`;
    const timeoutId = this.getScheduledNotification(notificationId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.removeScheduledNotification(notificationId);
    }
  },

  scheduleAllHabits(habits: Habit[]): void {
    const today = new Date().getDay();
    habits.forEach(habit => {
      if (habit.weekdays.includes(today)) {
        this.scheduleHabitReminder(habit);
      }
    });
  },

  cancelAllReminders(): void {
    const scheduled = this.getAllScheduledNotifications();
    Object.keys(scheduled).forEach(key => {
      const timeoutId = scheduled[key];
      clearTimeout(timeoutId);
    });
    localStorage.removeItem('streak_scheduled_notifications');
  },

  saveScheduledNotification(id: string, timeoutId: number): void {
    const scheduled = this.getAllScheduledNotifications();
    scheduled[id] = timeoutId;
    localStorage.setItem('streak_scheduled_notifications', JSON.stringify(scheduled));
  },

  getScheduledNotification(id: string): number | null {
    const scheduled = this.getAllScheduledNotifications();
    return scheduled[id] || null;
  },

  removeScheduledNotification(id: string): void {
    const scheduled = this.getAllScheduledNotifications();
    delete scheduled[id];
    localStorage.setItem('streak_scheduled_notifications', JSON.stringify(scheduled));
  },

  getAllScheduledNotifications(): Record<string, number> {
    const data = localStorage.getItem('streak_scheduled_notifications');
    return data ? JSON.parse(data) : {};
  },
};
