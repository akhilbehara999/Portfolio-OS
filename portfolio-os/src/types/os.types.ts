export const BootStatus = {
  /** Initial state when the system is powered on */
  COLD_START: 'COLD_START',
  /** System is initializing core services */
  BOOTING: 'BOOTING',
  /** Loading user interface and shell environment */
  LOADING_SHELL: 'LOADING_SHELL',
  /** System is fully loaded and ready for interaction */
  READY: 'READY',
  /** User session is locked */
  LOCKED: 'LOCKED',
  /** System is in low power mode */
  SLEEP: 'SLEEP',
} as const;

export type BootStatus = (typeof BootStatus)[keyof typeof BootStatus];

export type DeviceMode = 'mobile' | 'tablet' | 'desktop';

export interface OSTheme {
  /** Visual mode of the theme */
  mode: 'light' | 'dark';
  /** Primary accent color used throughout the OS */
  accentColor: string;
  /** Wallpaper configuration */
  wallpaper: {
    /** Type of wallpaper */
    type: 'static' | 'animated';
    /** Source URL or identifier for the wallpaper */
    source: string;
  };
  /** Opacity level for glassmorphism effects (0-1) */
  transparency: number;
  /** Scaling factor for system fonts */
  fontScale: number;
  /** Speed multiplier for animations */
  animationSpeed: number;
}

export interface OSState {
  /** Current boot status of the operating system */
  bootStatus: BootStatus;
  /** Currently logged-in user (null if no user) */
  currentUser: string | null;
  /** Current system theme configuration */
  theme: OSTheme;
  /** Identifier of the currently active virtual desktop */
  activeDesktop: string;
  /** Detected device form factor */
  deviceMode: DeviceMode;
}
