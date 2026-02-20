import { useWindowStore } from '../store/window.store';
import { useShallow } from 'zustand/react/shallow';

/**
 * Hook to manage window interactions.
 * Bridges the window store with React components.
 */
export const useWindowManager = () => {
  const {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    snapWindow,
  } = useWindowStore(
    useShallow((state) => ({
      windows: state.windows,
      activeWindowId: state.activeWindowId,
      openWindow: state.openWindow,
      closeWindow: state.closeWindow,
      minimizeWindow: state.minimizeWindow,
      maximizeWindow: state.maximizeWindow,
      focusWindow: state.focusWindow,
      snapWindow: state.snapWindow,
    }))
  );

  return {
    /** Open an app window. If singleton and already open, focuses it. */
    openApp: openWindow,
    /** Close a specific window */
    closeWindow,
    /** Minimize a window to taskbar */
    minimizeWindow,
    /** Maximize or restore a window */
    maximizeWindow,
    /** Bring a window to front and focus it */
    focusWindow,
    /** Snap a window to a specific layout position */
    snapWindow,
    /** Map of all open windows */
    windows,
    /** ID of the currently active window */
    activeWindow: activeWindowId,
    /** Number of open windows */
    openWindowCount: windows.size,
  };
};
