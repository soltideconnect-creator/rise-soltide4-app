import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Moon, Sun, Clock, Activity, TrendingUp, Bell, Play, Square, Lock, Smartphone } from 'lucide-react';
import { sleepTracker } from '@/services/sleepTracker';
import { sleepStorage } from '@/services/sleepStorage';
import { permissionService } from '@/services/permissionService';
import type { SleepSession, AlarmSettings } from '@/types/sleep';
import { toast } from 'sonner';
import { isPremiumUnlocked } from '@/utils/googlePlayBilling';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SleepProps {
  onNavigateToStats?: () => void;
}

export default function Sleep({ onNavigateToStats }: SleepProps) {
  const [isPremium, setIsPremium] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [alarmSettings, setAlarmSettings] = useState<AlarmSettings>({
    enabled: false,
    targetTime: '07:00',
    windowMinutes: 30,
    sound: 'gentle',
    vibrate: true,
  });

  useEffect(() => {
    // Check premium status using billing API
    const premium = isPremiumUnlocked();
    setIsPremium(premium);

    if (premium) {
      // Clean up stale sessions (older than 24 hours)
      sleepStorage.cleanupStaleSessions();

      // Load sessions
      loadSessions();
      
      // Load alarm settings
      const settings = sleepStorage.getAlarmSettings();
      setAlarmSettings(settings);

      // Check if currently recording
      setIsRecording(sleepTracker.isCurrentlyRecording());
    }
  }, []);

  const loadSessions = () => {
    const allSessions = sleepStorage.getLastNSessions(30);
    setSessions(allSessions);
  };

  const handleStartTracking = async () => {
    if (!isPremium) {
      toast.error('Premium feature required');
      return;
    }

    console.log('[Sleep] Starting sleep tracking...');
    setPermissionError(null);
    setPermissionGranted(false);

    try {
      // Pre-check: Clean up any stale sessions before starting
      const activeSession = sleepStorage.getActiveSession();
      if (activeSession && !isRecording) {
        console.warn('[Sleep] Found stale session in storage (not currently recording)');
        console.log('[Sleep] Auto-cleaning stale session before starting new one');
        
        const cleaned = sleepStorage.forceEndActiveSession();
        if (cleaned) {
          console.log('[Sleep] Stale session auto-cleaned:', cleaned.id);
          loadSessions(); // Refresh session list
          toast.info('Previous incomplete session was saved');
        }
      }

      // Step 1: Check permission info for debugging
      const permInfo = await permissionService.getPermissionInfo();
      console.log('[Sleep] Permission info:', permInfo);

      if (!permInfo.supported) {
        throw new Error('Microphone API not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
      }

      if (!permInfo.hasMicrophone) {
        throw new Error('No microphone found on this device. Please connect a microphone and try again.');
      }

      // Step 2: Request microphone permission (with platform-specific handling)
      console.log('[Sleep] Requesting microphone permission...');
      const permResult = await permissionService.requestMicrophonePermission(30000);

      if (!permResult.granted) {
        console.error('[Sleep] Microphone permission denied:', permResult);
        
        // Show platform-specific error message
        setPermissionError(permResult.error || 'Microphone permission denied');
        setPermissionGranted(false);
        toast.error('Microphone permission denied');
        return;
      }

      console.log('[Sleep] Microphone permission granted on platform:', permResult.platform);

      // Step 3: Get actual microphone stream for recording
      console.log('[Sleep] Requesting microphone stream for recording...');
      const micStream = await permissionService.requestMicrophoneStream();

      console.log('[Sleep] Microphone stream obtained');
      console.log('[Sleep] Audio tracks:', micStream.getAudioTracks().length);

      // Verify stream has audio tracks
      if (micStream.getAudioTracks().length === 0) {
        micStream.getTracks().forEach(track => track.stop());
        throw new Error('No audio tracks in microphone stream');
      }

      // Verify audio tracks are enabled and live
      const audioTracks = micStream.getAudioTracks();
      const disabledTracks = audioTracks.filter(track => !track.enabled);
      const endedTracks = audioTracks.filter(track => track.readyState === 'ended');

      if (disabledTracks.length > 0) {
        console.warn('[Sleep] Some audio tracks are disabled:', disabledTracks.length);
        // Try to enable them
        disabledTracks.forEach(track => {
          track.enabled = true;
          console.log('[Sleep] Enabled audio track:', track.id);
        });
      }

      if (endedTracks.length > 0) {
        console.error('[Sleep] Some audio tracks have ended:', endedTracks.length);
        micStream.getTracks().forEach(track => track.stop());
        throw new Error('Audio tracks ended before tracking could start');
      }

      // Add event listener for track ended
      audioTracks.forEach(track => {
        track.addEventListener('ended', () => {
          console.error('[Sleep] Audio track ended unexpectedly');
          setPermissionError('Microphone access was lost. Please restart sleep tracking.');
          setIsRecording(false);
          toast.error('Microphone access was lost');
        });
      });

      console.log('[Sleep] All audio tracks verified and active');

      // Step 4: Request Motion Sensors (iOS 13+ requires permission)
      if ('DeviceMotionEvent' in window) {
        // @ts-ignore - iOS 13+ requires permission
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
          console.log('[Sleep] Requesting motion permission (iOS)...');
          try {
            const response = await (DeviceMotionEvent as any).requestPermission();
            if (response !== 'granted') {
              console.error('[Sleep] Motion permission denied');
              // Stop microphone stream if motion denied
              micStream.getTracks().forEach(track => track.stop());
              throw new Error('Motion sensor access denied. Go to Settings → Rise → Motion & Fitness and enable access.');
            }
            console.log('[Sleep] Motion permission granted');
          } catch (motionError: any) {
            console.error('[Sleep] Motion permission error:', motionError);
            micStream.getTracks().forEach(track => track.stop());
            throw new Error('Motion sensor access denied. Go to Settings → Rise → Motion & Fitness and enable access.');
          }
        }
      }

      // Success — all permissions granted
      console.log('[Sleep] All permissions granted, starting tracker...');
      setPermissionGranted(true);
      
      // Step 5: Start tracking with the microphone stream
      try {
        const sessionId = await sleepTracker.startTrackingWithStream(micStream);
        console.log('[Sleep] Sleep tracker started successfully, session:', sessionId);
        setIsRecording(true);
        toast.success('Sleep tracking started. Good night! 🌙');
      } catch (trackerError: any) {
        console.error('[Sleep] Failed to start sleep tracker:', trackerError);
        // Stop the microphone stream if tracker fails
        micStream.getTracks().forEach(track => track.stop());
        throw new Error('Failed to start sleep tracker: ' + trackerError.message);
      }
      
    } catch (err: any) {
      console.error('[Sleep] Error in handleStartTracking:', err);
      
      let errorMessage = '';
      
      if (err.message?.includes('Active session already exists')) {
        // Special handling for active session error
        const activeSession = sleepStorage.getActiveSession();
        if (activeSession) {
          const startTime = new Date(activeSession.startTime);
          const hoursAgo = Math.round((Date.now() - startTime.getTime()) / (1000 * 60 * 60));
          
          errorMessage = `An active sleep tracking session already exists (started ${hoursAgo} hours ago).\n\nPlease stop the current session first, or click "Force Stop & Start New" below to end it and start a new session.`;
          
          // Set a flag to show the force stop button
          setPermissionError(errorMessage);
          setPermissionGranted(false);
          toast.error('Active session already exists');
          return; // Don't show generic error
        }
      } else if (err.message?.includes('not supported')) {
        errorMessage = err.message;
      } else if (err.message?.includes('No microphone found')) {
        errorMessage = err.message;
      } else if (err.message?.includes('Motion sensor')) {
        errorMessage = err.message;
      } else if (err.message?.includes('Microphone access denied') || err.message?.includes('Settings →')) {
        // Already formatted by permissionService
        errorMessage = err.message;
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = `Microphone access denied. Please allow microphone permission:

Android: Settings → Apps → Rise → Permissions → Microphone
iOS: Settings → Rise → Microphone

Then restart the app and try again.`;
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Microphone is already in use by another application. Please close other apps using the microphone and try again.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Microphone does not support the required audio settings. Please try with a different microphone.';
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Microphone access blocked by browser security settings. Please check your browser permissions.';
      } else {
        errorMessage = 'Failed to start sleep tracking: ' + err.message;
      }
      
      setPermissionError(errorMessage);
      setPermissionGranted(false);
      toast.error('Failed to start sleep tracking');
    }
  };

  const handleStopTracking = () => {
    const session = sleepTracker.stopTracking();
    setIsRecording(false);
    
    if (session) {
      loadSessions();
      toast.success(`Sleep session recorded! Quality: ${session.quality} (${session.qualityScore}/100)`);
    }
  };

  const handleForceStopAndRestart = async () => {
    console.log('[Sleep] Force stopping active session and restarting...');
    
    try {
      // Force end the active session
      const endedSession = sleepStorage.forceEndActiveSession();
      
      if (endedSession) {
        console.log('[Sleep] Active session force-ended:', endedSession.id);
        toast.success('Previous session ended successfully');
        
        // Reload sessions to show the ended session
        loadSessions();
        
        // Clear error and try starting again
        setPermissionError(null);
        
        // Wait a moment for UI to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Start new tracking session
        await handleStartTracking();
      } else {
        toast.error('No active session found to end');
      }
    } catch (error: any) {
      console.error('[Sleep] Error in force stop and restart:', error);
      toast.error('Failed to force stop session: ' + error.message);
    }
  };

  const handleAlarmToggle = (enabled: boolean) => {
    const newSettings = { ...alarmSettings, enabled };
    setAlarmSettings(newSettings);
    sleepStorage.saveAlarmSettings(newSettings);
  };

  const handleAlarmTimeChange = (time: string) => {
    const newSettings = { ...alarmSettings, targetTime: time };
    setAlarmSettings(newSettings);
    sleepStorage.saveAlarmSettings(newSettings);
  };

  const handleVibrateToggle = (vibrate: boolean) => {
    const newSettings = { ...alarmSettings, vibrate };
    setAlarmSettings(newSettings);
    sleepStorage.saveAlarmSettings(newSettings);
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getQualityColor = (quality: string): string => {
    switch (quality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'fair': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getQualityBgColor = (quality: string): string => {
    switch (quality) {
      case 'excellent': return 'bg-green-500/10';
      case 'good': return 'bg-blue-500/10';
      case 'fair': return 'bg-yellow-500/10';
      case 'poor': return 'bg-red-500/10';
      default: return 'bg-muted';
    }
  };

  // Calculate statistics
  const avgDuration = sleepStorage.getAverageDuration();
  const avgQuality = sleepStorage.getAverageQuality();
  const bestSession = sleepStorage.getBestSession();

  // Prepare chart data
  const last7Sessions = sessions.slice(0, 7).reverse();
  const durationChartData = last7Sessions.map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' }),
    duration: s.duration || 0,
  }));

  const qualityChartData = last7Sessions.map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' }),
    quality: s.qualityScore,
  }));

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Premium Feature</h2>
              <p className="text-muted-foreground">
                Sleep Tracker is a premium feature. Upgrade to unlock advanced sleep tracking with smart alarm.
              </p>
              <div className="space-y-2 text-sm text-left bg-muted/50 p-4 rounded-lg">
                <p className="font-semibold">Includes:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Sleep duration tracking</li>
                  <li>• Sleep quality analysis</li>
                  <li>• Movement & sound monitoring</li>
                  <li>• Smart alarm (30-min window)</li>
                  <li>• Sleep phase detection</li>
                  <li>• Detailed graphs & statistics</li>
                </ul>
              </div>
              {/* 
                NAVIGATION: This button navigates to Stats page where users can purchase premium.
                Uses onNavigateToStats callback passed from App.tsx.
                DO NOT use window.location.href or hash-based navigation.
              */}
              <Button
                onClick={() => onNavigateToStats?.()}
                size="lg"
                className="w-full"
              >
                Upgrade to Premium - $4.99
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sleep Tracker</h1>
            <p className="text-muted-foreground">Monitor your sleep quality</p>
          </div>
          <Moon className="w-8 h-8 text-primary" />
        </div>

        {/* Recording Control */}
        <Card className={isRecording ? 'border-primary' : ''}>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              {!isRecording ? (
                <>
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Moon className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Ready to Sleep</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start tracking to monitor your sleep quality
                    </p>
                  </div>
                  <Button
                    onClick={handleStartTracking}
                    size="lg"
                    className="w-full max-w-xs"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Sleep Tracking
                  </Button>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    🔒 Microphone access is local only — no data leaves your device. All sleep analysis happens on your phone.
                  </p>
                  {permissionError && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 max-w-xs mx-auto space-y-2">
                      <p className="text-xs text-destructive whitespace-pre-line">
                        {permissionError}
                      </p>
                      {permissionError.includes('Active session already exists') && (
                        <Button
                          onClick={handleForceStopAndRestart}
                          variant="destructive"
                          size="sm"
                          className="w-full text-xs"
                        >
                          Force Stop & Start New
                        </Button>
                      )}
                    </div>
                  )}
                  {permissionGranted && !isRecording && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 max-w-xs mx-auto">
                      <p className="text-xs text-green-600 dark:text-green-400">
                        ✅ Microphone ready — tracking active!
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Activity className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Tracking Sleep...</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Monitoring movement and sound levels
                    </p>
                  </div>
                  <Button
                    onClick={handleStopTracking}
                    size="lg"
                    variant="destructive"
                    className="w-full max-w-xs"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop & Save Session
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Smart Alarm Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Smart Alarm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Smart Alarm</Label>
                <p className="text-xs text-muted-foreground">
                  Wake up during light sleep within 30-minute window
                </p>
              </div>
              <Switch
                checked={alarmSettings.enabled}
                onCheckedChange={handleAlarmToggle}
              />
            </div>

            {alarmSettings.enabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="alarm-time">Target Wake Time</Label>
                  <Input
                    id="alarm-time"
                    type="time"
                    value={alarmSettings.targetTime}
                    onChange={(e) => handleAlarmTimeChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Alarm will ring up to 30 minutes before this time if you're in light sleep
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Vibration</Label>
                  <Switch
                    checked={alarmSettings.vibrate}
                    onCheckedChange={handleVibrateToggle}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        {sessions.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Duration</p>
                      <p className="text-2xl font-bold">{formatDuration(avgDuration)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Quality</p>
                      <p className="text-2xl font-bold">{avgQuality}/100</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Sessions</p>
                      <p className="text-2xl font-bold">{sessions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Duration Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sleep Duration (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={durationChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${Math.floor(value / 60)}h ${value % 60}m`, 'Duration']}
                    />
                    <Bar dataKey="duration" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quality Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sleep Quality (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={qualityChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value}/100`, 'Quality']}
                    />
                    <Line
                      type="monotone"
                      dataKey="quality"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sleep Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions.slice(0, 10).map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 rounded-lg border ${getQualityBgColor(session.quality)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {session.quality === 'excellent' || session.quality === 'good' ? (
                            <Sun className={`w-5 h-5 ${getQualityColor(session.quality)}`} />
                          ) : (
                            <Moon className={`w-5 h-5 ${getQualityColor(session.quality)}`} />
                          )}
                          <div>
                            <p className="font-medium">
                              {new Date(session.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {session.duration ? formatDuration(session.duration) : 'In progress'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold capitalize ${getQualityColor(session.quality)}`}>
                            {session.quality}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {session.qualityScore}/100
                          </p>
                        </div>
                      </div>
                      {session.alarmTriggered && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Bell className="w-3 h-3" />
                          <span>Smart alarm triggered</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Best Sleep */}
            {bestSession && (
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Best Sleep
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {new Date(bestSession.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">
                        {bestSession.duration ? formatDuration(bestSession.duration) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Quality</span>
                      <span className={`font-medium capitalize ${getQualityColor(bestSession.quality)}`}>
                        {bestSession.quality} ({bestSession.qualityScore}/100)
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {sessions.length === 0 && !isRecording && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <Moon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sleep sessions yet</p>
                <p className="text-sm mt-1">Start tracking to see your sleep data</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
