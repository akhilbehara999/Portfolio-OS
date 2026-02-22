import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface SettingsState {
  // Appearance additions
  enableWindowAnimations: boolean;
  enableHoverEffects: boolean;
  timeFormat: '12h' | '24h';

  // Sound
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1

  // Desktop
  taskbarPosition: 'bottom' | 'left' | 'right' | 'top';
  iconSize: 'small' | 'medium' | 'large';
  showDesktopIcons: boolean;
  enableWindowSnap: boolean;

  // Mobile
  mobileGridDensity: 'comfortable' | 'compact';
  appDrawerStyle: 'grid' | 'list';
  gestureSensitivity: 'low' | 'medium' | 'high';
}

interface SettingsActions {
  setWindowAnimations: (enabled: boolean) => void;
  setHoverEffects: (enabled: boolean) => void;
  setTimeFormat: (format: '12h' | '24h') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setTaskbarPosition: (pos: 'bottom' | 'left' | 'right' | 'top') => void;
  setIconSize: (size: 'small' | 'medium' | 'large') => void;
  setShowDesktopIcons: (show: boolean) => void;
  setWindowSnap: (enabled: boolean) => void;
  setMobileGridDensity: (density: 'comfortable' | 'compact') => void;
  setAppDrawerStyle: (style: 'grid' | 'list') => void;
  setGestureSensitivity: (sensitivity: 'low' | 'medium' | 'high') => void;
  resetDefaults: (category?: 'appearance' | 'animations' | 'sound' | 'desktop' | 'mobile') => void;
}

const DEFAULT_SETTINGS: SettingsState = {
  enableWindowAnimations: true,
  enableHoverEffects: true,
  timeFormat: '12h',
  soundEnabled: false,
  soundVolume: 0.5,
  taskbarPosition: 'bottom',
  iconSize: 'medium',
  showDesktopIcons: true,
  enableWindowSnap: true,
  mobileGridDensity: 'comfortable',
  appDrawerStyle: 'grid',
  gestureSensitivity: 'medium',
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    immer((set) => ({
      ...DEFAULT_SETTINGS,
      setWindowAnimations: (enabled) =>
        set((state) => {
          state.enableWindowAnimations = enabled;
        }),
      setHoverEffects: (enabled) =>
        set((state) => {
          state.enableHoverEffects = enabled;
        }),
      setTimeFormat: (format) =>
        set((state) => {
          state.timeFormat = format;
        }),
      setSoundEnabled: (enabled) =>
        set((state) => {
          state.soundEnabled = enabled;
        }),
      setSoundVolume: (volume) =>
        set((state) => {
          state.soundVolume = Math.max(0, Math.min(1, volume));
        }),
      setTaskbarPosition: (pos) =>
        set((state) => {
          state.taskbarPosition = pos;
        }),
      setIconSize: (size) =>
        set((state) => {
          state.iconSize = size;
        }),
      setShowDesktopIcons: (show) =>
        set((state) => {
          state.showDesktopIcons = show;
        }),
      setWindowSnap: (enabled) =>
        set((state) => {
          state.enableWindowSnap = enabled;
        }),
      setMobileGridDensity: (density) =>
        set((state) => {
          state.mobileGridDensity = density;
        }),
      setAppDrawerStyle: (style) =>
        set((state) => {
          state.appDrawerStyle = style;
        }),
      setGestureSensitivity: (sensitivity) =>
        set((state) => {
          state.gestureSensitivity = sensitivity;
        }),
      resetDefaults: (category) =>
        set((state) => {
          if (!category) {
            Object.assign(state, DEFAULT_SETTINGS);
          } else {
            switch (category) {
              case 'animations':
                state.enableWindowAnimations = DEFAULT_SETTINGS.enableWindowAnimations;
                state.enableHoverEffects = DEFAULT_SETTINGS.enableHoverEffects;
                break;
              case 'sound':
                state.soundEnabled = DEFAULT_SETTINGS.soundEnabled;
                state.soundVolume = DEFAULT_SETTINGS.soundVolume;
                break;
              case 'appearance':
                state.timeFormat = DEFAULT_SETTINGS.timeFormat;
                break;
              case 'desktop':
                state.taskbarPosition = DEFAULT_SETTINGS.taskbarPosition;
                state.iconSize = DEFAULT_SETTINGS.iconSize;
                state.showDesktopIcons = DEFAULT_SETTINGS.showDesktopIcons;
                state.enableWindowSnap = DEFAULT_SETTINGS.enableWindowSnap;
                break;
              case 'mobile':
                state.mobileGridDensity = DEFAULT_SETTINGS.mobileGridDensity;
                state.appDrawerStyle = DEFAULT_SETTINGS.appDrawerStyle;
                state.gestureSensitivity = DEFAULT_SETTINGS.gestureSensitivity;
                break;
            }
          }
        }),
    })),
    {
      name: 'portfolio-settings-storage',
    }
  )
);
