import type { KeyboardShortcut } from '../../types/input.types';
import { eventBus, EventType } from '@core/kernel/event-bus';

export class KeyboardHandler {
  private static instance: KeyboardHandler;
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private enabled: boolean = true;

  private constructor() {
    this.init();
  }

  public static getInstance(): KeyboardHandler {
    if (!KeyboardHandler.instance) {
      KeyboardHandler.instance = new KeyboardHandler();
    }
    return KeyboardHandler.instance;
  }

  private init() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  public registerShortcut(shortcut: KeyboardShortcut): void {
    this.shortcuts.set(shortcut.id, shortcut);
  }

  public unregisterShortcut(shortcutId: string): void {
    this.shortcuts.delete(shortcutId);
  }

  public isShortcutRegistered(shortcutId: string): boolean {
    return this.shortcuts.has(shortcutId);
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.enabled) return;

    // Check against registered shortcuts
    for (const shortcut of this.shortcuts.values()) {
      if (!shortcut.enabled) continue;

      if (this.matchesShortcut(event, shortcut)) {
        event.preventDefault();
        eventBus.emit(EventType.SHORTCUT_TRIGGERED, { shortcutId: shortcut.id });
        break;
      }
    }
  }

  private matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    const keys = shortcut.keys.map((k) => k.toLowerCase());

    // Check modifiers
    const meta = keys.includes('meta') || keys.includes('cmd') || keys.includes('command');
    const ctrl = keys.includes('ctrl') || keys.includes('control');
    const alt = keys.includes('alt') || keys.includes('option');
    const shift = keys.includes('shift');

    if (event.metaKey !== meta) return false;
    if (event.ctrlKey !== ctrl) return false;
    if (event.altKey !== alt) return false;
    if (event.shiftKey !== shift) return false;

    // Check main key
    // Filter out modifiers from the shortcut definition to find the main key
    const mainKeys = keys.filter(
      (k) => !['meta', 'cmd', 'command', 'ctrl', 'control', 'alt', 'option', 'shift'].includes(k)
    );

    if (mainKeys.length === 0) return false;

    // There should be usually one main key.
    const mainKey = mainKeys[0];

    return event.key.toLowerCase() === mainKey;
  }
}

export const keyboardHandler = KeyboardHandler.getInstance();
