/**
 * Permission Service
 * 
 * Handles microphone permission requests with Android-specific support
 * Provides detailed error messages and recovery guidance
 */

export interface PermissionResult {
  granted: boolean;
  error?: string;
  errorType?: 'denied' | 'not-supported' | 'timeout' | 'unknown';
  needsSystemSettings?: boolean;
  platform?: 'android' | 'ios' | 'web';
}

class PermissionService {
  private permissionState: PermissionState | null = null;

  /**
   * Detect the current platform
   */
  private detectPlatform(): 'android' | 'ios' | 'web' {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('android')) {
      return 'android';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad') || userAgent.includes('ipod')) {
      return 'ios';
    }
    
    return 'web';
  }

  /**
   * Check if running in a TWA (Trusted Web Activity) on Android
   */
  private isAndroidTWA(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('android') && 
           (document.referrer.includes('android-app://') || 
            window.matchMedia('(display-mode: standalone)').matches);
  }

  /**
   * Check current microphone permission status
   */
  async checkPermissionStatus(): Promise<PermissionState | null> {
    try {
      // Try to query permission status
      const permission = await navigator.permissions.query({ 
        name: 'microphone' as PermissionName 
      });
      
      this.permissionState = permission.state;
      console.log('[PermissionService] Current permission state:', permission.state);
      
      return permission.state;
    } catch (error) {
      console.warn('[PermissionService] Permissions API not supported:', error);
      return null;
    }
  }

  /**
   * Request microphone permission with platform-specific handling
   */
  async requestMicrophonePermission(timeoutMs: number = 30000): Promise<PermissionResult> {
    const platform = this.detectPlatform();
    console.log('[PermissionService] Requesting microphone permission on platform:', platform);

    // Check if MediaDevices API is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return {
        granted: false,
        error: 'Microphone API not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.',
        errorType: 'not-supported',
        platform,
      };
    }

    // Check current permission status first
    const currentStatus = await this.checkPermissionStatus();
    
    if (currentStatus === 'denied') {
      console.warn('[PermissionService] Permission previously denied');
      return {
        granted: false,
        error: this.getPermissionDeniedMessage(platform),
        errorType: 'denied',
        needsSystemSettings: true,
        platform,
      };
    }

    // Request microphone access with timeout
    try {
      console.log('[PermissionService] Requesting getUserMedia...');
      
      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 44100,
          },
        }),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Permission request timeout')), timeoutMs)
        ),
      ]);

      console.log('[PermissionService] Microphone permission granted');
      
      // Stop the stream immediately - we just needed to check permission
      stream.getTracks().forEach(track => track.stop());
      
      return {
        granted: true,
        platform,
      };

    } catch (error: any) {
      console.error('[PermissionService] Permission request failed:', error);
      
      // Handle different error types
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return {
          granted: false,
          error: this.getPermissionDeniedMessage(platform),
          errorType: 'denied',
          needsSystemSettings: true,
          platform,
        };
      }
      
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        return {
          granted: false,
          error: 'No microphone found on this device. Please connect a microphone and try again.',
          errorType: 'not-supported',
          platform,
        };
      }
      
      if (error.message?.includes('timeout')) {
        return {
          granted: false,
          error: 'Permission request timed out. Please try again and respond to the permission prompt.',
          errorType: 'timeout',
          platform,
        };
      }
      
      return {
        granted: false,
        error: `Microphone access failed: ${error.message || 'Unknown error'}`,
        errorType: 'unknown',
        platform,
      };
    }
  }

  /**
   * Get platform-specific permission denied message
   */
  private getPermissionDeniedMessage(platform: 'android' | 'ios' | 'web'): string {
    switch (platform) {
      case 'android':
        return `Microphone access denied. Please allow microphone permission:

Android: Settings → Apps → Rise → Permissions → Microphone

Then restart the app and try again.`;

      case 'ios':
        return `Microphone access denied. Please allow microphone permission:

iOS: Settings → Rise → Microphone

Then restart the app and try again.`;

      case 'web':
        return `Microphone access denied. Please allow microphone in your browser:

1. Click the lock icon in the address bar
2. Find "Microphone" permission
3. Change to "Allow"
4. Refresh the page and try again`;
    }
  }

  /**
   * Request microphone with stream (for actual recording)
   */
  async requestMicrophoneStream(): Promise<MediaStream> {
    console.log('[PermissionService] Requesting microphone stream for recording...');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone API not supported');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
        },
      });

      console.log('[PermissionService] Microphone stream obtained successfully');
      console.log('[PermissionService] Audio tracks:', stream.getAudioTracks().length);
      
      return stream;

    } catch (error: any) {
      console.error('[PermissionService] Failed to get microphone stream:', error);
      
      const platform = this.detectPlatform();
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        throw new Error(this.getPermissionDeniedMessage(platform));
      }
      
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        throw new Error('No microphone found on this device');
      }
      
      throw new Error(`Failed to access microphone: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Check if microphone is available
   */
  async isMicrophoneAvailable(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return false;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      
      console.log('[PermissionService] Audio input devices found:', audioInputs.length);
      
      return audioInputs.length > 0;
    } catch (error) {
      console.error('[PermissionService] Failed to enumerate devices:', error);
      return false;
    }
  }

  /**
   * Get detailed permission info for debugging
   */
  async getPermissionInfo(): Promise<{
    supported: boolean;
    status: PermissionState | null;
    platform: string;
    isTWA: boolean;
    hasMicrophone: boolean;
  }> {
    const platform = this.detectPlatform();
    const isTWA = this.isAndroidTWA();
    const status = await this.checkPermissionStatus();
    const hasMicrophone = await this.isMicrophoneAvailable();
    const supported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    return {
      supported,
      status,
      platform,
      isTWA,
      hasMicrophone,
    };
  }
}

export const permissionService = new PermissionService();
