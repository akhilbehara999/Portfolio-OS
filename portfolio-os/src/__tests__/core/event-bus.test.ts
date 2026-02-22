import { describe, it, expect, beforeEach, vi } from 'vitest';
import { eventBus, EventType } from '../../core/kernel/event-bus';

describe('Event Bus', () => {
  beforeEach(() => {
    // Clear listeners? No method to clear all.
    // We can rely on unique handlers.
  });

  it('should subscribe and emit events', () => {
    const handler = vi.fn();
    eventBus.on(EventType.WINDOW_OPENED, handler);

    eventBus.emit(EventType.WINDOW_OPENED, { windowId: 'test-win' });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ windowId: 'test-win' });
  });

  it('should unsubscribe from events', () => {
    const handler = vi.fn();
    eventBus.on(EventType.WINDOW_CLOSED, handler);
    eventBus.off(EventType.WINDOW_CLOSED, handler);

    eventBus.emit(EventType.WINDOW_CLOSED, { windowId: 'test-win' });

    expect(handler).not.toHaveBeenCalled();
  });

  it('once should only fire once', () => {
    const handler = vi.fn();
    eventBus.once(EventType.THEME_CHANGED, handler);

    eventBus.emit(EventType.THEME_CHANGED, { themeId: 'dark' });
    eventBus.emit(EventType.THEME_CHANGED, { themeId: 'light' });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ themeId: 'dark' });
  });

  it('should maintain history', () => {
    eventBus.emit(EventType.NOTIFICATION_PUSHED, {
      notification: {
        id: '1',
        title: 'Test',
        message: 'Hi',
        appId: 'test',
        type: 'info',
        timestamp: Date.now(),
        isRead: false,
      },
    });

    const history = eventBus.getHistory();
    expect(history.length).toBeGreaterThan(0);
    expect(history[0].type).toBe(EventType.NOTIFICATION_PUSHED);
  });
});
