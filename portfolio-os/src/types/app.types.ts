import type { ComponentType, LazyExoticComponent } from 'react';

export const AppCategory = {
  /** Core system applications */
  SYSTEM: 'SYSTEM',
  /** Portfolio showcase applications */
  PORTFOLIO: 'PORTFOLIO',
  /** Utility tools and helpers */
  UTILITY: 'UTILITY',
  /** Productivity and work applications */
  PRODUCTIVITY: 'PRODUCTIVITY',
} as const;

export type AppCategory = typeof AppCategory[keyof typeof AppCategory];

export interface AppDefinition {
  /** Unique identifier for the application */
  id: string;
  /** Display name of the application */
  name: string;
  /** Icon identifier or URL */
  icon: string;
  /** Short description of the application */
  description: string;
  /** Category the app belongs to */
  category: AppCategory;
  /** Lazy loaded component for the application */
  component: LazyExoticComponent<ComponentType<any>> | ComponentType<any>;
  /** Default window dimensions when opening */
  defaultWindowSize: {
    width: number;
    height: number;
  };
  /** Whether the app supports mobile layout */
  supportsMobile: boolean;
  /** Whether the app supports desktop layout */
  supportsDesktop: boolean;
  /** If true, only one instance of the app can run at a time */
  singleton: boolean;
  /** Keyboard shortcut to launch the app (e.g., 'Ctrl+Alt+T') */
  shortcut?: string;
  /** Primary accent color for the app UI */
  accentColor?: string;
}

export type AppInstanceState = 'launching' | 'running' | 'suspended' | 'terminated';

export interface AppInstance {
  /** Unique identifier for this specific instance of the app */
  instanceId: string;
  /** ID of the app definition being run */
  appId: string;
  /** Simulated process ID */
  pid: number;
  /** Current lifecycle state of the instance */
  state: AppInstanceState;
  /** Timestamp when the instance was launched */
  launchedAt: number;
  /** Simulated memory usage in bytes */
  memoryUsage: number;
}
