export type WallpaperType = 'static' | 'animated' | 'video' | 'gradient';

export interface WallpaperConfig {
  /** Unique identifier for the wallpaper */
  id: string;
  /** Display name of the wallpaper */
  name: string;
  /** Type of wallpaper content */
  type: WallpaperType;
  /** Source URL, file path, or gradient CSS string */
  source: string;
  /** Thumbnail URL for preview */
  thumbnail?: string;
  /** Amount of blur to apply (0-100) */
  blur: number;
  /** Brightness adjustment (0-100) */
  brightness: number;
}

export interface ThemeColors {
  /** Main background color */
  background: string;
  /** Main foreground color */
  foreground: string;
  /** Primary accent color */
  accent: string;
  /** Surface background color (cards, panels) */
  surface: string;
  /** Border color */
  border: string;
  /** Primary text color */
  textPrimary: string;
  /** Secondary text color */
  textSecondary: string;
  /** Muted/disabled text color */
  textMuted: string;
}

export interface ThemePreset {
  /** Unique identifier for the theme preset */
  id: string;
  /** Display name of the theme */
  name: string;
  /** Color palette definition */
  colors: ThemeColors;
  /** Global border radius scale factor */
  borderRadius: number;
  /** Shadow definitions for depth effects */
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  /** Opacity level for glassmorphism effects (0-1) */
  glassOpacity: number;
}
