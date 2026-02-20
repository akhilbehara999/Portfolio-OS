import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ThemePreset, WallpaperConfig } from '../types/theme.types';
import { THEME_PRESETS } from '@config/theme-presets';
import { WALLPAPERS } from '@config/wallpapers';

interface ThemeState {
  currentTheme: ThemePreset;
  currentWallpaper: WallpaperConfig;
  isDarkMode: boolean;
  accentColor: string;
  transparency: number;
  animationSpeed: number;
  fontScale: number;
}

interface ThemeActions {
  setTheme: (presetName: string) => void;
  setWallpaper: (wallpaperId: string) => void;
  toggleDarkMode: () => void;
  setAccentColor: (color: string) => void;
  setTransparency: (level: number) => void;
  setAnimationSpeed: (speed: number) => void;
  setFontScale: (scale: number) => void;
}

const DEFAULT_THEME = THEME_PRESETS[0];
const DEFAULT_WALLPAPER = WALLPAPERS[0];

const camelToKebab = (str: string) => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const updateCSSVariables = (state: ThemeState) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  // Update colors
  Object.entries(state.currentTheme.colors).forEach(([key, value]) => {
    const cssKey = camelToKebab(key);
    // Use the state's accent color instead of the theme's default if it overrides
    if (key === 'accent') {
      root.style.setProperty(`--color-${cssKey}`, state.accentColor);
    } else {
      root.style.setProperty(`--color-${cssKey}`, value);
    }
  });

  // Update theme settings
  root.style.setProperty('--glass-opacity', state.transparency.toString());
  root.style.setProperty('--border-radius', state.currentTheme.borderRadius.toString());
  root.style.setProperty('--animation-speed', state.animationSpeed.toString());
  root.style.setProperty('--font-scale', state.fontScale.toString());

  // Shadows
  Object.entries(state.currentTheme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });

  // Dark mode
  if (state.isDarkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    immer((set) => ({
      currentTheme: DEFAULT_THEME,
      currentWallpaper: DEFAULT_WALLPAPER,
      isDarkMode: true,
      accentColor: DEFAULT_THEME.colors.accent,
      transparency: DEFAULT_THEME.glassOpacity,
      animationSpeed: 1,
      fontScale: 1,

      setTheme: (presetId) => {
        const theme = THEME_PRESETS.find((t) => t.id === presetId);
        if (theme) {
          set((state) => {
            state.currentTheme = theme;
            state.accentColor = theme.colors.accent;
            state.transparency = theme.glassOpacity;
          });
        }
      },
      setWallpaper: (id) => {
        const wp = WALLPAPERS.find((w) => w.id === id);
        if (wp)
          set((state) => {
            state.currentWallpaper = wp;
          });
      },
      toggleDarkMode: () =>
        set((state) => {
          state.isDarkMode = !state.isDarkMode;
        }),
      setAccentColor: (color) =>
        set((state) => {
          state.accentColor = color;
        }),
      setTransparency: (level) =>
        set((state) => {
          state.transparency = level;
        }),
      setAnimationSpeed: (speed) =>
        set((state) => {
          state.animationSpeed = speed;
        }),
      setFontScale: (scale) =>
        set((state) => {
          state.fontScale = scale;
        }),
    })),
    {
      name: 'portfolio-theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) updateCSSVariables(state);
      },
    }
  )
);

// Subscribe to changes
if (typeof window !== 'undefined') {
  useThemeStore.subscribe((state) => {
    updateCSSVariables(state);
  });
  // Initial apply
  updateCSSVariables(useThemeStore.getState());
}
