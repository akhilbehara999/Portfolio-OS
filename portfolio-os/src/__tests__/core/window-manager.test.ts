import { describe, it, expect } from 'vitest';
import {
  calculateCascadePosition,
  calculateSnapPosition,
  enforceWindowBounds,
  generateWindowId,
} from '../../core/window-manager/window-manager';
import type { WindowState } from '../../types/window.types';

describe('Window Manager', () => {
  describe('calculateCascadePosition', () => {
    it('should return initial offset if no windows are visible', () => {
      const existingWindows = new Map<string, WindowState>();
      const screenBounds = { width: 1920, height: 1080 };
      const initialOffset = { x: 50, y: 50 };

      const position = calculateCascadePosition(existingWindows, screenBounds, initialOffset);
      expect(position).toEqual(initialOffset);
    });

    it('should offset from the top window', () => {
      const existingWindows = new Map<string, WindowState>();
      existingWindows.set('win1', {
        id: 'win1',
        appId: 'test',
        title: 'Test',
        state: 'open',
        position: { x: 100, y: 100 },
        size: { width: 400, height: 300 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 1,
      } as WindowState);

      const screenBounds = { width: 1920, height: 1080 };
      const position = calculateCascadePosition(existingWindows, screenBounds);

      expect(position).toEqual({ x: 130, y: 130 }); // 100 + 30
    });
  });

  describe('calculateSnapPosition', () => {
    const screenBounds = { width: 1920, height: 1080 };

    it('should calculate left snap correctly', () => {
      const result = calculateSnapPosition('left', screenBounds);
      expect(result.position).toEqual({ x: 0, y: 0 });
      expect(result.size).toEqual({ width: 960, height: 1080 });
    });

    it('should calculate right snap correctly', () => {
      const result = calculateSnapPosition('right', screenBounds);
      expect(result.position).toEqual({ x: 960, y: 0 });
      expect(result.size).toEqual({ width: 960, height: 1080 });
    });

    it('should calculate top snap correctly', () => {
      const result = calculateSnapPosition('top', screenBounds);
      expect(result.position).toEqual({ x: 0, y: 0 });
      expect(result.size).toEqual({ width: 1920, height: 540 });
    });

    it('should calculate maximize snap correctly', () => {
      const result = calculateSnapPosition('maximize', screenBounds);
      expect(result.position).toEqual({ x: 0, y: 0 });
      expect(result.size).toEqual({ width: 1920, height: 1080 });
    });
  });

  describe('enforceWindowBounds', () => {
    const screenBounds = { width: 1920, height: 1080 };

    it('should keep window within bounds', () => {
      const windowState = {
        id: 'win1',
        appId: 'test',
        title: 'Test',
        state: 'open',
        position: { x: 2000, y: 2000 }, // Out of bounds
        size: { width: 400, height: 300 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 1,
      } as WindowState;

      const position = enforceWindowBounds(windowState, screenBounds);

      // Expected: x = width - minVisible (50) = 1870? No, wait.
      // Logic: if (x > width - minVisible) x = width - minVisible;
      // 1920 - 50 = 1870.

      // y: if (y > height - minVisible) y = height - minVisible;
      // 1080 - 50 = 1030.

      expect(position.x).toBeLessThanOrEqual(1870);
      expect(position.y).toBeLessThanOrEqual(1030);
    });

    it('should not allow window to go above top', () => {
      const windowState = {
        id: 'win1',
        appId: 'test',
        title: 'Test',
        state: 'open',
        position: { x: 100, y: -50 },
        size: { width: 400, height: 300 },
        isMinimized: false,
        isMaximized: false,
        zIndex: 1,
      } as WindowState;

      const position = enforceWindowBounds(windowState, screenBounds);
      expect(position.y).toBe(0);
    });
  });

  describe('generateWindowId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateWindowId('app1');
      const id2 = generateWindowId('app1');
      expect(id1).not.toBe(id2);
      expect(id1).toContain('app1');
    });
  });
});
