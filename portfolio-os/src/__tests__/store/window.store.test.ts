import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useWindowStore } from '../../store/window.store';

describe('Window Store', () => {
  beforeEach(() => {
    const store = useWindowStore.getState();
    store.closeAll();
    vi.restoreAllMocks();
  });

  it('should open a window', () => {
    const { result } = renderHook(() => useWindowStore());

    act(() => {
      // Use a valid app ID from registry (e.g. terminal)
      result.current.openWindow('terminal');
    });

    const windows = result.current.windows;
    expect(windows.size).toBe(1);

    const window = Array.from(windows.values())[0];
    expect(window.appId).toBe('terminal');
    expect(window.state).toBe('opening'); // Initial state is opening
  });

  it('should close a window', () => {
    const { result } = renderHook(() => useWindowStore());
    let windowId: string;

    act(() => {
      result.current.openWindow('terminal');
    });

    // Get the ID
    windowId = Array.from(result.current.windows.keys())[0];

    // Check it's there
    expect(result.current.windows.size).toBe(1);

    vi.useFakeTimers();

    act(() => {
      result.current.closeWindow(windowId!);
    });

    // Immediately sets state to closing
    expect(result.current.windows.get(windowId!)?.state).toBe('closing');

    // Run timers to complete close
    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.windows.size).toBe(0);
    vi.useRealTimers();
  });

  it('should enforce singleton constraint', () => {
    const { result } = renderHook(() => useWindowStore());

    // 'about' is singleton
    act(() => {
      result.current.openWindow('about');
    });

    act(() => {
      result.current.openWindow('about');
    });

    expect(result.current.windows.size).toBe(1);
  });

  it('should manage focus and z-index', () => {
    const { result } = renderHook(() => useWindowStore());

    act(() => {
      result.current.openWindow('terminal'); // ID 1
    });

    act(() => {
      result.current.openWindow('file-explorer'); // ID 2
    });

    const windows = Array.from(result.current.windows.values());
    const w1 = windows.find(w => w.appId === 'terminal')!;
    const w2 = windows.find(w => w.appId === 'file-explorer')!;

    // w2 opened later, should have higher z-index
    expect(w2.zIndex).toBeGreaterThan(w1.zIndex);
    expect(result.current.activeWindowId).toBe(w2.id);

    // Focus terminal
    act(() => {
      result.current.focusWindow(w1.id);
    });

    const w1Updated = result.current.windows.get(w1.id)!;
    const w2Updated = result.current.windows.get(w2.id)!;

    expect(w1Updated.zIndex).toBeGreaterThan(w2Updated.zIndex);
    expect(result.current.activeWindowId).toBe(w1.id);
  });

  it('should toggle minimize', () => {
    const { result } = renderHook(() => useWindowStore());

    act(() => {
      result.current.openWindow('terminal');
    });

    const id = Array.from(result.current.windows.keys())[0];

    act(() => {
      result.current.minimizeWindow(id);
    });

    expect(result.current.windows.get(id)?.isMinimized).toBe(true);

    act(() => {
      result.current.focusWindow(id); // Focusing usually restores
    });

    expect(result.current.windows.get(id)?.isMinimized).toBe(false);
  });

  it('should toggle maximize', () => {
    const { result } = renderHook(() => useWindowStore());

    act(() => {
      result.current.openWindow('terminal');
    });

    const id = Array.from(result.current.windows.keys())[0];

    act(() => {
      result.current.maximizeWindow(id);
    });

    expect(result.current.windows.get(id)?.isMaximized).toBe(true);

    act(() => {
      result.current.maximizeWindow(id); // Toggle back
    });

    expect(result.current.windows.get(id)?.isMaximized).toBe(false);
  });
});
