import type { Notification } from '../../types/notification.types';
import type { DeviceMode } from '../../types/os.types';

export const EventType = {
  WINDOW_OPENED: 'WINDOW_OPENED',
  WINDOW_CLOSED: 'WINDOW_CLOSED',
  APP_LAUNCHED: 'APP_LAUNCHED',
  APP_TERMINATED: 'APP_TERMINATED',
  THEME_CHANGED: 'THEME_CHANGED',
  NOTIFICATION_PUSHED: 'NOTIFICATION_PUSHED',
  SHORTCUT_TRIGGERED: 'SHORTCUT_TRIGGERED',
  DEVICE_MODE_CHANGED: 'DEVICE_MODE_CHANGED',
  CONTEXT_MENU_REQUESTED: 'CONTEXT_MENU_REQUESTED',
  BOOT_PROGRESS: 'BOOT_PROGRESS',
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];

export interface EventPayloads {
  [EventType.WINDOW_OPENED]: { windowId: string };
  [EventType.WINDOW_CLOSED]: { windowId: string };
  [EventType.APP_LAUNCHED]: { appId: string; instanceId: string };
  [EventType.APP_TERMINATED]: { instanceId: string };
  [EventType.THEME_CHANGED]: { themeId: string };
  [EventType.NOTIFICATION_PUSHED]: { notification: Notification };
  [EventType.SHORTCUT_TRIGGERED]: { shortcutId: string };
  [EventType.DEVICE_MODE_CHANGED]: { mode: DeviceMode };
  [EventType.CONTEXT_MENU_REQUESTED]: { x: number; y: number; context: unknown };
  [EventType.BOOT_PROGRESS]: { progress: number; message: string };
}

type EventHandler<T extends EventType> = (payload: EventPayloads[T]) => void;

interface EventRecord {
  type: EventType;
  payload: any;
  timestamp: number;
}

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<EventType, Set<EventHandler<any>>> = new Map();
  private history: EventRecord[] = [];
  private readonly MAX_HISTORY = 100;

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public on<T extends EventType>(event: T, handler: EventHandler<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  public off<T extends EventType>(event: T, handler: EventHandler<T>): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  public emit<T extends EventType>(event: T, payload: EventPayloads[T]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (error) {
          console.error(`Error handling event ${event}:`, error);
        }
      });
    }
    this.addToHistory(event, payload);
  }

  public once<T extends EventType>(event: T, handler: EventHandler<T>): void {
    const wrapper = (payload: EventPayloads[T]) => {
      handler(payload);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  private addToHistory(type: EventType, payload: any): void {
    this.history.unshift({
      type,
      payload,
      timestamp: Date.now(),
    });
    if (this.history.length > this.MAX_HISTORY) {
      this.history.pop();
    }
  }

  public getHistory(): EventRecord[] {
    return [...this.history];
  }
}

export const eventBus = EventBus.getInstance();
