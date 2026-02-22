import { useEffect } from 'react';
import { useWindowStore } from '../store/window.store';

export const useWindowResizeHandler = () => {
  // We use a ref or direct store access to avoid re-attaching the listener on every render/state change
  // But we need the store actions available.

  useEffect(() => {
    const handleResize = () => {
      const state = useWindowStore.getState();
      const windows = state.windows;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      windows.forEach((w) => {
        if (w.isMaximized || w.isMinimized) return;

        let newX = w.position.x;
        let newY = w.position.y;
        let newWidth = w.size.width;
        let newHeight = w.size.height;
        let hasChanged = false;

        // Constraint: Width shouldn't exceed screen width
        if (newWidth > screenW) {
          newWidth = screenW;
          hasChanged = true;
        }

        // Constraint: Height shouldn't exceed screen height - taskbar (48px)
        const maxH = screenH - 48;
        if (newHeight > maxH) {
          newHeight = maxH;
          hasChanged = true;
        }

        // Constraint: Keep on screen (X)
        if (newX + newWidth > screenW) {
          newX = Math.max(0, screenW - newWidth);
          hasChanged = true;
        }
        if (newX < 0) {
          newX = 0;
          hasChanged = true;
        }

        // Constraint: Keep on screen (Y)
        if (newY + newHeight > maxH) {
          newY = Math.max(0, maxH - newHeight);
          hasChanged = true;
        }
        if (newY < 0) {
          newY = 0;
          hasChanged = true;
        }

        if (hasChanged) {
          // We must be careful not to trigger cascading updates if not needed.
          // But since we are inside an event handler, we are just dispatching actions.
          if (newWidth !== w.size.width || newHeight !== w.size.height) {
            state.resizeWindow(w.id, { width: newWidth, height: newHeight });
          }
          if (newX !== w.position.x || newY !== w.position.y) {
            state.moveWindow(w.id, { x: newX, y: newY });
          }
        }
      });
    };

    // Debounce or throttle could be added here if resize events are too frequent
    let timeoutId: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);
};
