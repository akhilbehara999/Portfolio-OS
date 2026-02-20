export interface SystemSettings {
  theme: string;
  wallpaper: string;
  animationSpeed: number;
  soundEnabled: boolean;
  notificationPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  taskbarPosition: 'bottom' | 'top' | 'left' | 'right';
  dockSize: number; // in pixels
  iconSize: number; // in pixels
  fontScale: number;
  autoLockTimeout: number; // in minutes
  showSeconds: boolean;
  use24HourFormat: boolean;
  windowSnapEnabled: boolean;
  desktopGridSize: number; // in pixels
}

export const DEFAULT_SETTINGS: SystemSettings = {
  theme: 'midnight',
  wallpaper: 'neon-dreams',
  animationSpeed: 1,
  soundEnabled: false,
  notificationPosition: 'top-right',
  taskbarPosition: 'bottom',
  dockSize: 60,
  iconSize: 48,
  fontScale: 1,
  autoLockTimeout: 15,
  showSeconds: false,
  use24HourFormat: true,
  windowSnapEnabled: true,
  desktopGridSize: 96,
};
