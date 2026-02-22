import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useThemeStore } from '../../store/theme.store';
import { THEME_PRESETS } from '../../config/theme-presets';

describe('Theme Store', () => {
  beforeEach(() => {
    localStorage.clear();
    const store = useThemeStore.getState();
    // Reset to default
    act(() => {
      store.setTheme(THEME_PRESETS[0].id);
      if (!store.isDarkMode) store.toggleDarkMode();
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.currentTheme).toBeDefined();
    expect(result.current.isDarkMode).toBeDefined();
  });

  it('should set theme', () => {
    const { result } = renderHook(() => useThemeStore());
    const themeId = THEME_PRESETS[1]?.id || THEME_PRESETS[0].id;

    act(() => {
      result.current.setTheme(themeId);
    });

    expect(result.current.currentTheme.id).toBe(themeId);
  });

  it('should toggle dark mode', () => {
    const { result } = renderHook(() => useThemeStore());

    // Ensure we start in a known state (e.g., dark)
    const initialMode = result.current.isDarkMode;

    act(() => {
      result.current.toggleDarkMode();
    });
    expect(result.current.isDarkMode).toBe(!initialMode);

    act(() => {
      result.current.toggleDarkMode();
    });
    expect(result.current.isDarkMode).toBe(initialMode);
  });

  it('should persist to localStorage', () => {
    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.toggleDarkMode();
    });

    // Check localStorage
    const stored = localStorage.getItem('portfolio-theme-storage');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.state.isDarkMode).toBe(result.current.isDarkMode);
  });
});
