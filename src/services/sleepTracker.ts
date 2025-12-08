import type { SleepSession, SleepData, SleepPhase } from '@/types/sleep';
import { sleepStorage } from './sleepStorage';
import { audioService } from './audioService';

class SleepTracker {
  private isRecording = false;
  private currentSessionId: string | null = null;
  private sleepData: SleepData[] = [];
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private motionListener: ((event: DeviceMotionEvent) => void) | null = null;
  private recordingInterval: number | null = null;
  private alarmTimeout: number | null = null;

  // Start sleep tracking
  async startTracking(): Promise<string> {
    if (this.isRecording) {
      throw new Error('Already recording');
    }

    // Check if already has active session
    if (sleepStorage.hasActiveSession()) {
      throw new Error('Active session already exists');
    }

    // Request microphone permission with enhanced error handling
    try {
      // First, check if microphone permission is already granted
      let permissionGranted = false;
      
      try {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (permission.state === 'granted') {
          permissionGranted = true;
        }
      } catch (err) {
        // Fallback for browsers that don't support permissions API
        console.log('Permissions API not supported, will request directly');
      }

      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      
      this.setupAudioAnalysis();
    } catch (error) {
      console.error('Microphone access denied:', error);
      
      // Provide user-friendly error message
      const errorMessage = 'Microphone access denied. Please enable microphone permission in your device settings:\n\n' +
        'Android: Settings → Apps → Rise → Permissions → Microphone\n' +
        'iOS: Settings → Rise → Microphone\n\n' +
        'Then try again.';
      
      throw new Error(errorMessage);
    }

    // Request motion permission (iOS)
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission !== 'granted') {
          throw new Error('Motion access required for sleep tracking');
        }
      } catch (error) {
        console.error('Motion permission denied:', error);
      }
    }

    // Setup motion tracking
    this.setupMotionTracking();

    // Create new session
    const sessionId = `sleep_${Date.now()}`;
    const session: SleepSession = {
      id: sessionId,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
      quality: 'fair',
      qualityScore: 50,
      movements: 0,
      soundLevel: 0,
      lightSleepPhases: [],
      deepSleepPhases: [],
      awakePhases: [],
      alarmWindow: 30,
    };

    sleepStorage.addSession(session);
    this.currentSessionId = sessionId;
    this.isRecording = true;
    this.sleepData = [];

    // Start recording data every 30 seconds
    this.recordingInterval = window.setInterval(() => {
      this.recordDataPoint();
    }, 30000);

    // Setup smart alarm if enabled
    this.setupSmartAlarm();

    return sessionId;
  }

  // Start sleep tracking with pre-authorized stream
  async startTrackingWithStream(mediaStream: MediaStream): Promise<string> {
    if (this.isRecording) {
      throw new Error('Already recording');
    }

    // Check if already has active session
    if (sleepStorage.hasActiveSession()) {
      throw new Error('Active session already exists');
    }

    // Use the provided stream
    this.mediaStream = mediaStream;
    this.setupAudioAnalysis();

    // Request motion permission (iOS)
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission !== 'granted') {
          throw new Error('Motion access required for sleep tracking');
        }
      } catch (error) {
        console.error('Motion permission denied:', error);
      }
    }

    // Setup motion tracking
    this.setupMotionTracking();

    // Create new session
    const sessionId = `sleep_${Date.now()}`;
    const session: SleepSession = {
      id: sessionId,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
      quality: 'fair',
      qualityScore: 50,
      movements: 0,
      soundLevel: 0,
      lightSleepPhases: [],
      deepSleepPhases: [],
      awakePhases: [],
      alarmWindow: 30,
    };

    sleepStorage.addSession(session);
    this.currentSessionId = sessionId;
    this.isRecording = true;
    this.sleepData = [];

    // Start recording data every 30 seconds
    this.recordingInterval = window.setInterval(() => {
      this.recordDataPoint();
    }, 30000);

    // Setup smart alarm if enabled
    this.setupSmartAlarm();

    return sessionId;
  }

  // Stop sleep tracking
  stopTracking(): SleepSession | null {
    if (!this.isRecording || !this.currentSessionId) {
      return null;
    }

    // Stop recording
    this.isRecording = false;
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }

    // Stop audio
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Stop motion
    if (this.motionListener) {
      window.removeEventListener('devicemotion', this.motionListener);
      this.motionListener = null;
    }

    // Clear alarm
    if (this.alarmTimeout) {
      clearTimeout(this.alarmTimeout);
      this.alarmTimeout = null;
    }

    // Calculate sleep metrics
    const session = sleepStorage.getSessionById(this.currentSessionId);
    if (session) {
      const endTime = new Date().toISOString();
      const duration = Math.round((new Date(endTime).getTime() - new Date(session.startTime).getTime()) / 60000);
      
      const analysis = this.analyzeSleepData();
      
      sleepStorage.updateSession(this.currentSessionId, {
        endTime,
        duration,
        quality: analysis.quality,
        qualityScore: analysis.qualityScore,
        movements: analysis.movements,
        soundLevel: analysis.soundLevel,
        lightSleepPhases: analysis.lightSleepPhases,
        deepSleepPhases: analysis.deepSleepPhases,
        awakePhases: analysis.awakePhases,
      });

      this.currentSessionId = null;
      this.sleepData = [];
      
      return sleepStorage.getSessionById(session.id);
    }

    return null;
  }

  // Setup audio analysis
  private setupAudioAnalysis(): void {
    if (!this.mediaStream) return;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    source.connect(this.analyser);
    this.analyser.fftSize = 256;
  }

  // Setup motion tracking
  private setupMotionTracking(): void {
    this.motionListener = (event: DeviceMotionEvent) => {
      // Motion data is captured in recordDataPoint
    };
    window.addEventListener('devicemotion', this.motionListener);
  }

  // Record data point
  private recordDataPoint(): void {
    if (!this.isRecording) return;

    const movement = this.getMovementLevel();
    const soundLevel = this.getSoundLevel();

    this.sleepData.push({
      timestamp: Date.now(),
      movement,
      soundLevel,
    });
  }

  // Get current movement level
  private getMovementLevel(): number {
    // Simulate movement detection (0-100)
    // In real implementation, use accelerometer data
    return Math.random() * 30; // Lower values = less movement during sleep
  }

  // Get current sound level
  private getSoundLevel(): number {
    if (!this.analyser) return 0;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    return Math.round((average / 255) * 100);
  }

  // Analyze sleep data
  private analyzeSleepData(): {
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    qualityScore: number;
    movements: number;
    soundLevel: number;
    lightSleepPhases: SleepPhase[];
    deepSleepPhases: SleepPhase[];
    awakePhases: SleepPhase[];
  } {
    if (this.sleepData.length === 0) {
      return {
        quality: 'fair',
        qualityScore: 50,
        movements: 0,
        soundLevel: 0,
        lightSleepPhases: [],
        deepSleepPhases: [],
        awakePhases: [],
      };
    }

    // Calculate average movement and sound
    const avgMovement = this.sleepData.reduce((sum, d) => sum + d.movement, 0) / this.sleepData.length;
    const avgSound = this.sleepData.reduce((sum, d) => sum + d.soundLevel, 0) / this.sleepData.length;
    const totalMovements = this.sleepData.filter(d => d.movement > 40).length;

    // Detect sleep phases
    const phases = this.detectSleepPhases();

    // Calculate quality score (0-100)
    let qualityScore = 100;
    qualityScore -= avgMovement * 0.5; // Movement penalty
    qualityScore -= avgSound * 0.3; // Sound penalty
    qualityScore -= (totalMovements / this.sleepData.length) * 20; // Restlessness penalty
    qualityScore = Math.max(0, Math.min(100, qualityScore));

    // Determine quality rating
    let quality: 'poor' | 'fair' | 'good' | 'excellent';
    if (qualityScore >= 80) quality = 'excellent';
    else if (qualityScore >= 60) quality = 'good';
    else if (qualityScore >= 40) quality = 'fair';
    else quality = 'poor';

    return {
      quality,
      qualityScore: Math.round(qualityScore),
      movements: totalMovements,
      soundLevel: Math.round(avgSound),
      lightSleepPhases: phases.light,
      deepSleepPhases: phases.deep,
      awakePhases: phases.awake,
    };
  }

  // Detect sleep phases
  private detectSleepPhases(): {
    light: SleepPhase[];
    deep: SleepPhase[];
    awake: SleepPhase[];
  } {
    const light: SleepPhase[] = [];
    const deep: SleepPhase[] = [];
    const awake: SleepPhase[] = [];

    if (this.sleepData.length === 0) {
      return { light, deep, awake };
    }

    let currentPhase: 'light' | 'deep' | 'awake' = 'light';
    let phaseStart = this.sleepData[0].timestamp;

    this.sleepData.forEach((data, index) => {
      let newPhase: 'light' | 'deep' | 'awake';
      
      if (data.movement > 50 || data.soundLevel > 60) {
        newPhase = 'awake';
      } else if (data.movement < 20 && data.soundLevel < 30) {
        newPhase = 'deep';
      } else {
        newPhase = 'light';
      }

      if (newPhase !== currentPhase || index === this.sleepData.length - 1) {
        const phase: SleepPhase = {
          startTime: new Date(phaseStart).toISOString(),
          endTime: new Date(data.timestamp).toISOString(),
          type: currentPhase,
        };

        if (currentPhase === 'light') light.push(phase);
        else if (currentPhase === 'deep') deep.push(phase);
        else awake.push(phase);

        currentPhase = newPhase;
        phaseStart = data.timestamp;
      }
    });

    return { light, deep, awake };
  }

  // Setup smart alarm
  private setupSmartAlarm(): void {
    const settings = sleepStorage.getAlarmSettings();
    if (!settings.enabled) return;

    const [hours, minutes] = settings.targetTime.split(':').map(Number);
    const targetTime = new Date();
    targetTime.setHours(hours, minutes, 0, 0);

    // If target time is in the past, set for tomorrow
    if (targetTime.getTime() < Date.now()) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    // Calculate window start time (30 minutes before target)
    const windowStart = new Date(targetTime.getTime() - settings.windowMinutes * 60000);

    // Set timeout to start checking for light sleep
    const timeUntilWindow = windowStart.getTime() - Date.now();
    
    this.alarmTimeout = window.setTimeout(() => {
      this.startSmartAlarmCheck(targetTime, settings.windowMinutes);
    }, timeUntilWindow);
  }

  // Start checking for light sleep to trigger alarm
  private startSmartAlarmCheck(targetTime: Date, windowMinutes: number): void {
    const checkInterval = setInterval(() => {
      const now = Date.now();
      
      // If past target time, trigger alarm
      if (now >= targetTime.getTime()) {
        clearInterval(checkInterval);
        this.triggerAlarm();
        return;
      }

      // Check if in light sleep
      const recentData = this.sleepData.slice(-3); // Last 3 data points (1.5 minutes)
      if (recentData.length > 0) {
        const avgMovement = recentData.reduce((sum, d) => sum + d.movement, 0) / recentData.length;
        
        // If in light sleep (movement between 20-50), trigger alarm
        if (avgMovement > 20 && avgMovement < 50) {
          clearInterval(checkInterval);
          this.triggerAlarm();
        }
      }
    }, 30000); // Check every 30 seconds
  }

  // Trigger alarm
  private triggerAlarm(): void {
    if (!this.currentSessionId) return;

    // Update session
    sleepStorage.updateSession(this.currentSessionId, {
      alarmTriggered: true,
      alarmTime: new Date().toISOString(),
    });

    // Play alarm sound
    this.playAlarmSound();

    // Vibrate
    const settings = sleepStorage.getAlarmSettings();
    if (settings.vibrate && navigator.vibrate) {
      navigator.vibrate([1000, 500, 1000, 500, 1000]);
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Wake Up! ⏰', {
        body: 'Good morning! Time to wake up.',
        icon: '/icon.png',
      });
    }
  }

  // Play alarm sound
  private playAlarmSound(): void {
    const settings = sleepStorage.getAlarmSettings();
    audioService.playAlarm(settings.sound);
  }

  // Check if currently recording
  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }

  // Get current session ID
  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }
}

export const sleepTracker = new SleepTracker();
