import { useShallow } from 'zustand/react/shallow';
import { useOSStore } from './os.store';
import { useWindowStore } from './window.store';
import { useThemeStore } from './theme.store';
import { useNotificationStore } from './notification.store';
import { useAppStore } from './app.store';

// Export individual stores
export { useOSStore, useWindowStore, useThemeStore, useNotificationStore, useAppStore };

// Selector hooks with shallow comparison for optimization

export const useWindows = () =>
  useWindowStore(
    useShallow((state) => {
      const windowsArr = Array.from(state.windows.values());
      return {
        windows: windowsArr,
        activeWindowId: state.activeWindowId,
        windowOrder: state.windowOrder,
        // Computed properties
        openWindowCount: state.windows.size,
        minimizedWindows: windowsArr.filter((w) => w.isMinimized),
        visibleWindows: windowsArr.filter((w) => !w.isMinimized),

        // Actions
        openWindow: state.openWindow,
        closeWindow: state.closeWindow,
        minimizeWindow: state.minimizeWindow,
        maximizeWindow: state.maximizeWindow,
        focusWindow: state.focusWindow,
        moveWindow: state.moveWindow,
        resizeWindow: state.resizeWindow,
        snapWindow: state.snapWindow,
        minimizeAll: state.minimizeAll,
        restoreAll: state.restoreAll,
        closeAll: state.closeAll,
        getWindowsByApp: state.getWindowsByApp,
      };
    })
  );

export const useTheme = () =>
  useThemeStore(
    useShallow((state) => ({
      theme: state.currentTheme,
      wallpaper: state.currentWallpaper,
      isDarkMode: state.isDarkMode,
      accentColor: state.accentColor,
      transparency: state.transparency,
      animationSpeed: state.animationSpeed,
      fontScale: state.fontScale,

      setTheme: state.setTheme,
      setWallpaper: state.setWallpaper,
      toggleDarkMode: state.toggleDarkMode,
      setAccentColor: state.setAccentColor,
      setTransparency: state.setTransparency,
      setAnimationSpeed: state.setAnimationSpeed,
      setFontScale: state.setFontScale,
    }))
  );

export const useNotifications = () =>
  useNotificationStore(
    useShallow((state) => ({
      notifications: state.notifications,
      history: state.notificationHistory,
      unreadCount: state.unreadCount,

      push: state.pushNotification,
      dismiss: state.dismissNotification,
      markAsRead: state.markAsRead,
      clearAll: state.clearAll,
      getByApp: state.getByApp,
    }))
  );

export const useApps = () =>
  useAppStore(
    useShallow((state) => ({
      runningApps: Array.from(state.runningApps.values()),
      recentApps: state.recentApps,
      pinnedApps: state.pinnedApps,

      launchApp: state.launchApp,
      terminateApp: state.terminateApp,
      suspendApp: state.suspendApp,
      resumeApp: state.resumeApp,
      pinApp: state.pinApp,
      unpinApp: state.unpinApp,
      getRunningInstances: state.getRunningInstances,
    }))
  );

export const useOSStatus = () =>
  useOSStore(
    useShallow((state) => ({
      bootStatus: state.bootStatus,
      deviceMode: state.deviceMode,
      isLocked: state.isLocked,
      uptime: state.uptime,
      currentTime: state.currentTime,

      boot: state.boot,
      lock: state.lock,
      unlock: state.unlock,
      sleep: state.sleep,
      wake: state.wake,
      setDeviceMode: state.setDeviceMode,
    }))
  );

// Unified hook providing access to all stores
export const useOS = () => {
  const os = useOSStatus();
  const windows = useWindows();
  const theme = useTheme();
  const notifications = useNotifications();
  const apps = useApps();

  return {
    ...os,
    windows,
    theme,
    notifications,
    apps,
  };
};
