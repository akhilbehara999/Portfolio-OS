import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { AppInstance } from '../types/app.types';
import { useWindowStore } from './window.store';
import { useNotificationStore } from './notification.store';
import { APP_REGISTRY } from '@config/app-registry';

interface AppStoreState {
  runningApps: Map<string, AppInstance>;
  recentApps: string[];
  pinnedApps: string[];
  appUsageStats: Record<string, number>; // appId -> count
}

interface AppStoreActions {
  launchApp: (appId: string, options?: { metadata?: any }) => void;
  terminateApp: (instanceId: string) => void;
  suspendApp: (instanceId: string) => void;
  resumeApp: (instanceId: string) => void;
  pinApp: (appId: string) => void;
  unpinApp: (appId: string) => void;
  getRunningInstances: (appId: string) => AppInstance[];
}

export const useAppStore = create<AppStoreState & AppStoreActions>()(
  persist(
    immer((set, get) => ({
      runningApps: new Map(),
      recentApps: [],
      pinnedApps: ['about', 'projects', 'terminal', 'settings'],
      appUsageStats: {},

      launchApp: (appId, options) => {
        const app = APP_REGISTRY.find((a) => a.id === appId);
        if (!app) return;

        // Check singleton
        if (app.singleton) {
          const running = get().getRunningInstances(appId);
          if (running.length > 0) {
            // Already running, focus window
            const windows = useWindowStore.getState().getWindowsByApp(appId);
            if (windows.length > 0) {
              useWindowStore.getState().focusWindow(windows[0].id);
              return;
            }
          }
        }

        // Create instance
        const instanceId = crypto.randomUUID();
        const newInstance: AppInstance = {
          instanceId,
          appId,
          pid: Math.floor(Math.random() * 10000) + 1000,
          state: 'launching',
          launchedAt: Date.now(),
          memoryUsage: Math.floor(Math.random() * 50) + 20, // MB
        };

        set((state) => {
          state.runningApps.set(instanceId, newInstance);
          state.appUsageStats[appId] = (state.appUsageStats[appId] || 0) + 1;
          state.recentApps = [appId, ...state.recentApps.filter((id) => id !== appId)].slice(0, 10);
        });

        // Open window
        useWindowStore.getState().openWindow(appId, options);

        // Notification on first launch
        const usage = get().appUsageStats[appId] || 0;
        if (usage <= 1) {
          useNotificationStore.getState().pushNotification({
            appId,
            title: `Launched ${app.name}`,
            message: `You have launched ${app.name} for the first time!`,
            type: 'info',
          });
        }

        // Update state to running after short delay
        setTimeout(() => {
          set((state) => {
            const instance = state.runningApps.get(instanceId);
            if (instance) instance.state = 'running';
          });
        }, 500);
      },

      terminateApp: (instanceId) => {
        set((state) => {
          state.runningApps.delete(instanceId);
        });
      },

      suspendApp: (id) => {
        set((state) => {
          const app = state.runningApps.get(id);
          if (app) app.state = 'suspended';
        });
      },

      resumeApp: (id) => {
        set((state) => {
          const app = state.runningApps.get(id);
          if (app) app.state = 'running';
        });
      },

      pinApp: (appId) => {
        set((state) => {
          if (!state.pinnedApps.includes(appId)) {
            state.pinnedApps.push(appId);
          }
        });
      },

      unpinApp: (appId) => {
        set((state) => {
          state.pinnedApps = state.pinnedApps.filter((id) => id !== appId);
        });
      },

      getRunningInstances: (appId) => {
        return Array.from(get().runningApps.values()).filter((a) => a.appId === appId);
      },
    })),
    {
      name: 'portfolio-app-storage',
      partialize: (state) => ({
        recentApps: state.recentApps,
        pinnedApps: state.pinnedApps,
        appUsageStats: state.appUsageStats,
        runningApps: Array.from(state.runningApps.entries()),
      }),
      merge: (persistedState: any, currentState) => {
        if (!persistedState) return currentState;
        const runningApps = new Map(persistedState.runningApps || []);
        return {
          ...currentState,
          ...persistedState,
          runningApps,
        };
      },
    }
  )
);
