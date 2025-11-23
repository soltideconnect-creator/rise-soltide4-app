import type { SleepSession, AlarmSettings } from '@/types/sleep';

const SLEEP_SESSIONS_KEY = 'streak_sleep_sessions';
const ALARM_SETTINGS_KEY = 'streak_alarm_settings';

class SleepStorage {
  // Sleep Sessions
  getSessions(): SleepSession[] {
    const data = localStorage.getItem(SLEEP_SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveSessions(sessions: SleepSession[]): void {
    localStorage.setItem(SLEEP_SESSIONS_KEY, JSON.stringify(sessions));
  }

  addSession(session: SleepSession): void {
    const sessions = this.getSessions();
    sessions.push(session);
    this.saveSessions(sessions);
  }

  updateSession(sessionId: string, updates: Partial<SleepSession>): void {
    const sessions = this.getSessions();
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...updates };
      this.saveSessions(sessions);
    }
  }

  deleteSession(sessionId: string): void {
    const sessions = this.getSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    this.saveSessions(filtered);
  }

  getSessionById(sessionId: string): SleepSession | null {
    const sessions = this.getSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  getSessionsByDateRange(startDate: string, endDate: string): SleepSession[] {
    const sessions = this.getSessions();
    return sessions.filter(s => s.date >= startDate && s.date <= endDate);
  }

  getLastNSessions(n: number): SleepSession[] {
    const sessions = this.getSessions();
    return sessions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, n);
  }

  // Alarm Settings
  getAlarmSettings(): AlarmSettings {
    const data = localStorage.getItem(ALARM_SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      enabled: false,
      targetTime: '07:00',
      windowMinutes: 30,
      sound: 'default',
      vibrate: true,
    };
  }

  saveAlarmSettings(settings: AlarmSettings): void {
    localStorage.setItem(ALARM_SETTINGS_KEY, JSON.stringify(settings));
  }

  // Active Session Management
  getActiveSession(): SleepSession | null {
    const sessions = this.getSessions();
    return sessions.find(s => !s.endTime) || null;
  }

  hasActiveSession(): boolean {
    return this.getActiveSession() !== null;
  }

  // Statistics
  getAverageDuration(): number {
    const sessions = this.getSessions().filter(s => s.duration);
    if (sessions.length === 0) return 0;
    const total = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    return Math.round(total / sessions.length);
  }

  getAverageQuality(): number {
    const sessions = this.getSessions();
    if (sessions.length === 0) return 0;
    const total = sessions.reduce((sum, s) => sum + s.qualityScore, 0);
    return Math.round(total / sessions.length);
  }

  getBestSession(): SleepSession | null {
    const sessions = this.getSessions();
    if (sessions.length === 0) return null;
    return sessions.reduce((best, current) => 
      current.qualityScore > best.qualityScore ? current : best
    );
  }

  getWorstSession(): SleepSession | null {
    const sessions = this.getSessions();
    if (sessions.length === 0) return null;
    return sessions.reduce((worst, current) => 
      current.qualityScore < worst.qualityScore ? current : worst
    );
  }

  // Clear all data
  clearAllData(): void {
    localStorage.removeItem(SLEEP_SESSIONS_KEY);
    localStorage.removeItem(ALARM_SETTINGS_KEY);
  }
}

export const sleepStorage = new SleepStorage();
