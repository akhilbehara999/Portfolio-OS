import { useAppStore } from '../store/app.store';
import { useShallow } from 'zustand/react/shallow';

/**
 * Hook to manage application launching and status.
 * Coordinates the app launch process including loading states.
 */
export const useAppLauncher = () => {
  const { launchApp, runningApps, recentApps, terminateApp, getRunningInstances } = useAppStore(
    useShallow((state) => ({
      launchApp: state.launchApp,
      runningApps: state.runningApps,
      recentApps: state.recentApps,
      terminateApp: state.terminateApp,
      getRunningInstances: state.getRunningInstances,
    }))
  );

  // Check if any app is currently in the launching phase
  const isLaunching = Array.from(runningApps.values()).some((app) => app.state === 'launching');

  const lastLaunchedAppId = recentApps.length > 0 ? recentApps[0] : null;

  return {
    /** Launch an application by ID */
    launchApp,
    /** Terminate a specific app instance */
    terminateApp,
    /** Whether any app is currently launching */
    isLaunching,
    /** ID of the most recently launched app */
    lastLaunchedApp: lastLaunchedAppId,
    /** Get all running instances of a specific app */
    getRunningInstances,
  };
};
