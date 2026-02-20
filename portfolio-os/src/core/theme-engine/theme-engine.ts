import type { ThemePreset, WallpaperConfig } from '../../types/theme.types';

export const applyTheme = (theme: ThemePreset): void => {
  const root = document.documentElement;

  // Apply colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssVar = `--os-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVar, value);
  });

  // Apply other properties
  root.style.setProperty('--os-border-radius', `${theme.borderRadius}px`);
  root.style.setProperty('--os-glass-opacity', theme.glassOpacity.toString());

  // Shadows
  root.style.setProperty('--os-shadow-sm', theme.shadows.sm);
  root.style.setProperty('--os-shadow-md', theme.shadows.md);
  root.style.setProperty('--os-shadow-lg', theme.shadows.lg);

  // Generate accent variants
  const variants = generateAccentVariants(theme.colors.accent);
  root.style.setProperty('--os-accent-light', variants.light);
  root.style.setProperty('--os-accent-dark', variants.dark);
  root.style.setProperty('--os-accent-transparent', variants.transparent);
};

export const applyWallpaper = (wallpaper: WallpaperConfig): void => {
  // If it's a static image or gradient, we can set it on body or a layer
  if (wallpaper.type === 'static' || wallpaper.type === 'gradient') {
     document.documentElement.style.setProperty('--os-wallpaper', `url(${wallpaper.source})`);
  }
};

export const generateAccentVariants = (baseColor: string): { light: string; dark: string; transparent: string } => {
  return {
    light: `color-mix(in srgb, ${baseColor}, white 20%)`,
    dark: `color-mix(in srgb, ${baseColor}, black 20%)`,
    transparent: `color-mix(in srgb, ${baseColor}, transparent 50%)`,
  };
};

export const interpolateTheme = (from: ThemePreset, to: ThemePreset, progress: number): void => {
    // For now, if progress > 0.5, apply 'to', else 'from'.
    // True interpolation requires parsing colors which is complex without a library.
    if (progress > 0.5) {
        applyTheme(to);
    } else {
        applyTheme(from);
    }
};

// System dark mode listener
export const initSystemThemeListener = (callback: (isDark: boolean) => void): () => void => {
    if (typeof window === 'undefined' || !window.matchMedia) return () => {};

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
        callback(e.matches);
    };

    mediaQuery.addEventListener('change', handler);

    // Initial check
    callback(mediaQuery.matches);

    return () => mediaQuery.removeEventListener('change', handler);
};
