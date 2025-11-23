// Audio Service for generating offline alarm sounds using Web Audio API

export type AlarmSoundType = 'gentle' | 'classic' | 'chimes' | 'birds' | 'ocean' | 'piano';

export interface AlarmSound {
  id: AlarmSoundType;
  name: string;
  description: string;
}

export const ALARM_SOUNDS: AlarmSound[] = [
  { id: 'gentle', name: 'Gentle Wake', description: 'Soft ascending tones' },
  { id: 'classic', name: 'Classic Alarm', description: 'Traditional beeping' },
  { id: 'chimes', name: 'Wind Chimes', description: 'Peaceful chimes' },
  { id: 'birds', name: 'Morning Birds', description: 'Chirping birds' },
  { id: 'ocean', name: 'Ocean Waves', description: 'Calming waves' },
  { id: 'piano', name: 'Piano Melody', description: 'Soft piano notes' },
];

class AudioService {
  private audioContext: AudioContext | null = null;
  private currentSource: OscillatorNode | null = null;
  private currentGain: GainNode | null = null;
  private isPlaying = false;

  // Initialize audio context
  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  // Stop current sound
  stopSound(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {
        // Already stopped
      }
      this.currentSource = null;
    }
    if (this.currentGain) {
      this.currentGain.disconnect();
      this.currentGain = null;
    }
    this.isPlaying = false;
  }

  // Play preview (3 seconds)
  playPreview(soundType: AlarmSoundType): void {
    this.stopSound();
    this.playSound(soundType, 3000);
  }

  // Play full alarm (60 seconds, looping)
  playAlarm(soundType: AlarmSoundType): void {
    this.stopSound();
    this.playSound(soundType, 60000);
  }

  // Generate and play sound
  private playSound(soundType: AlarmSoundType, duration: number): void {
    const context = this.getAudioContext();
    this.isPlaying = true;

    switch (soundType) {
      case 'gentle':
        this.playGentleWake(context, duration);
        break;
      case 'classic':
        this.playClassicAlarm(context, duration);
        break;
      case 'chimes':
        this.playChimes(context, duration);
        break;
      case 'birds':
        this.playBirds(context, duration);
        break;
      case 'ocean':
        this.playOcean(context, duration);
        break;
      case 'piano':
        this.playPiano(context, duration);
        break;
    }

    // Auto-stop after duration
    setTimeout(() => {
      this.stopSound();
    }, duration);
  }

  // Gentle Wake: Soft ascending tones
  private playGentleWake(context: AudioContext, duration: number): void {
    const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00]; // C, D, E, F, G
    const noteLength = 800;
    let currentTime = context.currentTime;

    const playNote = (freq: number, time: number) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, time);

      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.3, time + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, time + noteLength / 1000);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start(time);
      oscillator.stop(time + noteLength / 1000);
    };

    const playSequence = () => {
      frequencies.forEach((freq, index) => {
        playNote(freq, currentTime + (index * noteLength / 1000));
      });
      currentTime += (frequencies.length * noteLength / 1000) + 0.5;
    };

    const loops = Math.ceil(duration / ((frequencies.length * noteLength) + 500));
    for (let i = 0; i < loops; i++) {
      playSequence();
    }
  }

  // Classic Alarm: Traditional beeping
  private playClassicAlarm(context: AudioContext, duration: number): void {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(880, context.currentTime); // A5

    // Beep pattern: 0.3s on, 0.3s off
    const beepLength = 0.3;
    const silenceLength = 0.3;
    const patternLength = beepLength + silenceLength;
    const loops = Math.ceil(duration / 1000 / patternLength);

    let currentTime = context.currentTime;
    for (let i = 0; i < loops; i++) {
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.setValueAtTime(0.4, currentTime);
      gainNode.gain.setValueAtTime(0.4, currentTime + beepLength);
      gainNode.gain.setValueAtTime(0, currentTime + beepLength);
      currentTime += patternLength;
    }

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration / 1000);

    this.currentSource = oscillator;
    this.currentGain = gainNode;
  }

  // Wind Chimes: Peaceful chimes
  private playChimes(context: AudioContext, duration: number): void {
    const frequencies = [523.25, 587.33, 659.25, 783.99, 880.00]; // C5, D5, E5, G5, A5
    let currentTime = context.currentTime;

    const playChime = (freq: number, time: number) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, time);

      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.2, time + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 2);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start(time);
      oscillator.stop(time + 2);
    };

    const loops = Math.ceil(duration / 3000);
    for (let i = 0; i < loops; i++) {
      const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
      playChime(randomFreq, currentTime);
      currentTime += 0.5 + Math.random() * 0.5;
    }
  }

  // Morning Birds: Chirping birds
  private playBirds(context: AudioContext, duration: number): void {
    let currentTime = context.currentTime;

    const playChirp = (time: number) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      const startFreq = 2000 + Math.random() * 1000;
      const endFreq = startFreq + 500 + Math.random() * 500;

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(startFreq, time);
      oscillator.frequency.linearRampToValueAtTime(endFreq, time + 0.1);
      oscillator.frequency.linearRampToValueAtTime(startFreq, time + 0.2);

      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.15, time + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, time + 0.2);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start(time);
      oscillator.stop(time + 0.2);
    };

    const loops = Math.ceil(duration / 100);
    for (let i = 0; i < loops; i++) {
      if (Math.random() > 0.3) {
        playChirp(currentTime);
      }
      currentTime += 0.1 + Math.random() * 0.3;
    }
  }

  // Ocean Waves: Calming waves
  private playOcean(context: AudioContext, duration: number): void {
    // Create white noise for wave sound
    const bufferSize = context.sampleRate * 2;
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = context.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to create wave-like sound
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, context.currentTime);

    const gainNode = context.createGain();
    
    // Oscillating volume for wave effect
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.frequency.setValueAtTime(0.3, context.currentTime);
    lfoGain.gain.setValueAtTime(0.1, context.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);

    gainNode.gain.setValueAtTime(0.15, context.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    whiteNoise.start(context.currentTime);
    lfo.start(context.currentTime);

    whiteNoise.stop(context.currentTime + duration / 1000);
    lfo.stop(context.currentTime + duration / 1000);

    this.currentSource = whiteNoise as any;
    this.currentGain = gainNode;
  }

  // Piano Melody: Soft piano notes
  private playPiano(context: AudioContext, duration: number): void {
    // Simple melody: C-E-G-C (arpeggio)
    const melody = [
      { freq: 261.63, time: 0 },    // C4
      { freq: 329.63, time: 0.5 },  // E4
      { freq: 392.00, time: 1.0 },  // G4
      { freq: 523.25, time: 1.5 },  // C5
      { freq: 392.00, time: 2.0 },  // G4
      { freq: 329.63, time: 2.5 },  // E4
    ];

    const playNote = (freq: number, time: number) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, time);

      // Piano-like envelope
      gainNode.gain.setValueAtTime(0, time);
      gainNode.gain.linearRampToValueAtTime(0.3, time + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.8);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start(time);
      oscillator.stop(time + 0.8);
    };

    let currentTime = context.currentTime;
    const melodyLength = 3; // seconds
    const loops = Math.ceil(duration / 1000 / melodyLength);

    for (let i = 0; i < loops; i++) {
      melody.forEach(note => {
        playNote(note.freq, currentTime + note.time);
      });
      currentTime += melodyLength;
    }
  }

  // Check if currently playing
  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  // Get saved alarm sound preference
  getSavedAlarmSound(): AlarmSoundType {
    const saved = localStorage.getItem('streak_alarm_sound');
    return (saved as AlarmSoundType) || 'gentle';
  }

  // Save alarm sound preference
  saveAlarmSound(soundType: AlarmSoundType): void {
    localStorage.setItem('streak_alarm_sound', soundType);
  }
}

export const audioService = new AudioService();
