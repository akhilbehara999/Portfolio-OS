import type { WindowState, WindowPosition, WindowSize } from '../../types/window.types';

export const WINDOW_OFFSET = 30;

export const calculateCascadePosition = (
  existingWindows: Map<string, WindowState>,
  screenBounds: { width: number; height: number },
  initialOffset = { x: 50, y: 50 }
): WindowPosition => {
  const visibleWindows = Array.from(existingWindows.values()).filter(
    (w) => !w.isMinimized && w.state === 'open'
  );

  if (visibleWindows.length === 0) {
    return initialOffset;
  }

  // Find the last opened window position (this is a simple heuristic)
  // Ideally, we track the last active window or sort by z-index
  const sortedWindows = visibleWindows.sort((a, b) => b.zIndex - a.zIndex);
  const topWindow = sortedWindows[0];

  let x = topWindow.position.x + WINDOW_OFFSET;
  let y = topWindow.position.y + WINDOW_OFFSET;

  // Wrap if out of bounds
  if (x > screenBounds.width * 0.6 || y > screenBounds.height * 0.6) {
    x = initialOffset.x;
    y = initialOffset.y;
  }

  return { x, y };
};

export const calculateSnapPosition = (
  direction: 'left' | 'right' | 'top' | 'maximize',
  screenBounds: { width: number; height: number }
): { position: WindowPosition; size: WindowSize } => {
  const { width, height } = screenBounds;

  switch (direction) {
    case 'left':
      return {
        position: { x: 0, y: 0 },
        size: { width: width / 2, height },
      };
    case 'right':
      return {
        position: { x: width / 2, y: 0 },
        size: { width: width / 2, height },
      };
    case 'top':
      return {
        position: { x: 0, y: 0 },
        size: { width, height: height / 2 },
      };
    case 'maximize':
      return {
        position: { x: 0, y: 0 },
        size: { width, height },
      };
    default:
      return {
        position: { x: 0, y: 0 },
        size: { width, height },
      };
  }
};

export const enforceWindowBounds = (
  windowState: WindowState,
  screenBounds: { width: number; height: number }
): WindowPosition => {
  const { width, height } = screenBounds;
  const { size, position } = windowState;

  let x = position.x;
  let y = position.y;

  // Prevent dragging completely off-screen
  // Keep at least 50px visible
  const minVisible = 50;

  if (x + size.width < minVisible) x = minVisible - size.width;
  if (x > width - minVisible) x = width - minVisible;
  if (y < 0) y = 0; // Don't allow going above top bar usually
  if (y > height - minVisible) y = height - minVisible;

  return { x, y };
};

export const calculateCenterPosition = (
  windowSize: WindowSize,
  screenBounds: { width: number; height: number }
): WindowPosition => {
  const x = (screenBounds.width - windowSize.width) / 2;
  const y = (screenBounds.height - windowSize.height) / 2;
  return { x: Math.max(0, x), y: Math.max(0, y) };
};

export const getWindowsInZOrder = (windows: Map<string, WindowState>): WindowState[] => {
  return Array.from(windows.values()).sort((a, b) => a.zIndex - b.zIndex);
};

export const detectWindowCollision = (windowA: WindowState, windowB: WindowState): boolean => {
  return (
    windowA.position.x < windowB.position.x + windowB.size.width &&
    windowA.position.x + windowA.size.width > windowB.position.x &&
    windowA.position.y < windowB.position.y + windowB.size.height &&
    windowA.position.y + windowA.size.height > windowB.position.y
  );
};

export const generateWindowId = (appId: string): string => {
  return `win_${appId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
