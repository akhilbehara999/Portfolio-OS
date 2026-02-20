export type ShortcutScope = 'global' | 'app-specific';

export interface KeyboardShortcut {
  /** Unique identifier for the shortcut */
  id: string;
  /** Array of keys required to trigger the shortcut (e.g. ['Control', 'c']) */
  keys: string[];
  /** Description of what the shortcut does */
  description: string;
  /** Action identifier to execute */
  action: string;
  /** Scope where the shortcut is active */
  scope: ShortcutScope;
  /** Whether the shortcut is currently active */
  enabled: boolean;
}

export const GestureType = {
  SWIPE_UP: 'SWIPE_UP',
  SWIPE_DOWN: 'SWIPE_DOWN',
  SWIPE_LEFT: 'SWIPE_LEFT',
  SWIPE_RIGHT: 'SWIPE_RIGHT',
  PINCH_IN: 'PINCH_IN',
  PINCH_OUT: 'PINCH_OUT',
  LONG_PRESS: 'LONG_PRESS',
  DOUBLE_TAP: 'DOUBLE_TAP',
} as const;

export type GestureType = (typeof GestureType)[keyof typeof GestureType];

export interface GestureConfig {
  /** The type of gesture to listen for */
  type: GestureType;
  /** Callback function to execute when gesture is detected */
  onGesture: (event: any) => void;
  /** Minimum distance or time required to trigger gesture */
  threshold?: number;
  /** Whether the gesture listener is currently active */
  enabled: boolean;
}
