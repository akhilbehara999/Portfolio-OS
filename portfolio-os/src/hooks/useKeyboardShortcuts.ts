import { useEffect, useCallback } from 'react';
import { keyboardHandler } from '../core/input-handler/keyboard-handler';
import type { KeyboardShortcut } from '../types/input.types';

/**
 * Hook to manage keyboard shortcuts.
 * Registers shortcuts with the global keyboard handler.
 */
export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[] = []) => {
  useEffect(() => {
    shortcuts.forEach((shortcut) => {
      keyboardHandler.registerShortcut(shortcut);
    });

    return () => {
      shortcuts.forEach((shortcut) => {
        keyboardHandler.unregisterShortcut(shortcut.id);
      });
    };
  }, [shortcuts]);

  const registerShortcut = useCallback((shortcut: KeyboardShortcut) => {
    keyboardHandler.registerShortcut(shortcut);
  }, []);

  const unregisterShortcut = useCallback((id: string) => {
    keyboardHandler.unregisterShortcut(id);
  }, []);

  const isShortcutActive = useCallback((id: string) => {
    return keyboardHandler.isShortcutRegistered(id);
  }, []);

  return {
    registerShortcut,
    unregisterShortcut,
    isShortcutActive,
  };
};
