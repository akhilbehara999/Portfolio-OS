import type { ComponentType } from 'react';

export type WindowStateStatus = 'opening' | 'open' | 'closing' | 'closed';

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowState {
  /** Unique identifier for the window instance */
  id: string;
  /** ID of the app this window belongs to */
  appId: string;
  /** Title displayed in the window header */
  title: string;
  /** Icon displayed in the window header and taskbar */
  icon: string;
  /** Current position of the window on the desktop */
  position: WindowPosition;
  /** Current dimensions of the window */
  size: WindowSize;
  /** Minimum allowed dimensions for the window */
  minSize?: WindowSize;
  /** Maximum allowed dimensions for the window */
  maxSize?: WindowSize;
  /** Whether the window is currently minimized to the taskbar */
  isMinimized: boolean;
  /** Whether the window is currently maximized to fill the screen */
  isMaximized: boolean;
  /** Whether the window currently has input focus */
  isFocused: boolean;
  /** Whether the window can be resized by the user */
  isResizable: boolean;
  /** Whether the window can be dragged by the user */
  isDraggable: boolean;
  /** Z-index for stacking order */
  zIndex: number;
  /** Opacity of the window (0-1) */
  opacity: number;
  /** Lifecycle state of the window */
  state: WindowStateStatus;
  /** React component to render inside the window */
  component: ComponentType<any>;
  /** arbitrary data associated with the window */
  metadata?: Record<string, any>;
}

export interface WindowManagerState {
  /** Map of all active windows keyed by ID */
  windows: Map<string, WindowState>;
  /** ID of the currently focused window */
  activeWindowId: string | null;
  /** Array of window IDs in stacking order (back to front) */
  windowOrder: string[];
  /** Offset for cascading new windows */
  cascadeOffset: number;
}

export type WindowAction =
  | 'OPEN'
  | 'CLOSE'
  | 'MINIMIZE'
  | 'MAXIMIZE'
  | 'RESTORE'
  | 'FOCUS'
  | 'RESIZE'
  | 'MOVE'
  | 'SNAP_LEFT'
  | 'SNAP_RIGHT'
  | 'SNAP_TOP';
