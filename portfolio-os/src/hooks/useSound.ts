import { useCallback } from 'react';
import { useSettingsStore } from '../store/settings.store';

export type SoundType =
  | 'window-open'
  | 'window-close'
  | 'notification'
  | 'click'
  | 'error'
  | 'startup';

class SoundManager {
  private static instance: SoundManager;
  private audioContext: AudioContext | null = null;

  private constructor() {
    // Lazy init audio context
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioContext) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
      } catch (e) {
        console.warn('Web Audio API not supported');
        return null;
      }
    }
    return this.audioContext;
  }

  public play(type: SoundType, volume: number = 0.5) {
    const ctx = this.getContext();
    if (!ctx) return;

    // Resume context if suspended (common in browsers)
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    switch (type) {
      case 'window-open': // Whoosh (White noise + low pass filter sweep)
        this.playWhoosh(ctx, now, volume);
        break;
      case 'window-close': // Pop (Sine wave rapid pitch drop)
        this.playPop(ctx, now, volume);
        break;
      case 'notification': // Ding (Sine wave bell)
        this.playDing(ctx, now, volume);
        break;
      case 'click': // Tick (Short burst)
        this.playTick(ctx, now, volume);
        break;
      case 'error': // Buzz (Sawtooth)
        this.playBuzz(ctx, now, volume);
        break;
      case 'startup': // Chord
        this.playStartup(ctx, now, volume);
        break;
    }
  }

  private createGain(ctx: AudioContext, time: number, duration: number, vol: number) {
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(vol, time + duration * 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);
    gainNode.connect(ctx.destination);
    return gainNode;
  }

  private playWhoosh(ctx: AudioContext, time: number, vol: number) {
    const duration = 0.15;
    const gain = this.createGain(ctx, time, duration, vol * 0.5);

    // Create noise buffer
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, time);
    filter.frequency.exponentialRampToValueAtTime(2000, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    noise.start(time);
    noise.stop(time + duration);
  }

  private playPop(ctx: AudioContext, time: number, vol: number) {
    const duration = 0.05;
    const osc = ctx.createOscillator();
    const gain = this.createGain(ctx, time, duration, vol * 0.8);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, time);
    osc.frequency.exponentialRampToValueAtTime(100, time + duration);

    osc.connect(gain);
    osc.start(time);
    osc.stop(time + duration);
  }

  private playDing(ctx: AudioContext, time: number, vol: number) {
    const duration = 0.8;
    const osc = ctx.createOscillator();
    const gain = this.createGain(ctx, time, duration, vol);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, time); // High C

    // Add some harmonics for "bell" sound
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2400, time);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(vol * 0.3, time);
    gain2.gain.exponentialRampToValueAtTime(0.001, time + duration * 0.8);

    osc.connect(gain);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + duration);
    osc2.start(time);
    osc2.stop(time + duration);
  }

  private playTick(ctx: AudioContext, time: number, vol: number) {
    const duration = 0.02;
    const osc = ctx.createOscillator();
    const gain = this.createGain(ctx, time, duration, vol * 0.6);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, time);

    osc.connect(gain);
    osc.start(time);
    osc.stop(time + duration);
  }

  private playBuzz(ctx: AudioContext, time: number, vol: number) {
    const duration = 0.15;
    const osc = ctx.createOscillator();
    const gain = this.createGain(ctx, time, duration, vol * 0.5);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, time);
    osc.frequency.linearRampToValueAtTime(80, time + duration);

    osc.connect(gain);
    osc.start(time);
    osc.stop(time + duration);
  }

  private playStartup(ctx: AudioContext, time: number, vol: number) {
    // A simple major chord arpeggio
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, i) => {
      const t = time + i * 0.1;
      const dur = 1.5;
      const osc = ctx.createOscillator();
      const gain = this.createGain(ctx, t, dur, vol * 0.4);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      osc.connect(gain);
      osc.start(t);
      osc.stop(t + dur);
    });
  }
}

export const useSound = () => {
  const { soundEnabled, soundVolume } = useSettingsStore();

  const playSound = useCallback(
    (type: SoundType) => {
      if (!soundEnabled) return;
      SoundManager.getInstance().play(type, soundVolume);
    },
    [soundEnabled, soundVolume]
  );

  return { playSound };
};
