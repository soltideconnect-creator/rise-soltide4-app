export interface SleepSession {
  id: string;
  date: string; // ISO date string
  startTime: string; // ISO datetime string
  endTime?: string; // ISO datetime string
  duration?: number; // minutes
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  qualityScore: number; // 0-100
  movements: number; // total movement count
  soundLevel: number; // average sound level
  lightSleepPhases: SleepPhase[];
  deepSleepPhases: SleepPhase[];
  awakePhases: SleepPhase[];
  alarmTime?: string; // ISO datetime string
  alarmWindow: number; // minutes (default 30)
  alarmTriggered?: boolean;
  notes?: string;
}

export interface SleepPhase {
  startTime: string;
  endTime: string;
  type: 'light' | 'deep' | 'awake';
}

export interface SleepData {
  timestamp: number;
  movement: number; // 0-100
  soundLevel: number; // 0-100
}

export interface SleepStats {
  averageDuration: number; // minutes
  averageQuality: number; // 0-100
  totalSessions: number;
  bestSleep: SleepSession | null;
  worstSleep: SleepSession | null;
  last7Days: SleepSession[];
  last30Days: SleepSession[];
}

export interface AlarmSettings {
  enabled: boolean;
  targetTime: string; // HH:mm format
  windowMinutes: number; // default 30
  sound: string;
  vibrate: boolean;
}
