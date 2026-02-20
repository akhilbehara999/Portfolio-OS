import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Notification } from '../types/notification.types';

interface NotificationState {
  notifications: Notification[];
  notificationHistory: Notification[];
  unreadCount: number;
}

interface NotificationActions {
  pushNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  getByApp: (appId: string) => Notification[];
}

const HISTORY_LIMIT = 50;
const DEFAULT_DURATION = 5000;

// Keep track of timeouts to clear them if manually dismissed
const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

export const useNotificationStore = create<NotificationState & NotificationActions>()(
  immer((set, get) => ({
    notifications: [],
    notificationHistory: [],
    unreadCount: 0,

    pushNotification: (payload) => {
      const id = crypto.randomUUID();
      const notification: Notification = {
        ...payload,
        id,
        timestamp: Date.now(),
        isRead: false,
        duration: payload.duration ?? DEFAULT_DURATION,
      };

      set((state) => {
        state.notifications.push(notification);
        state.unreadCount += 1;

        // Add to history
        state.notificationHistory.unshift(notification);
        if (state.notificationHistory.length > HISTORY_LIMIT) {
          state.notificationHistory.pop();
        }
      });

      // Auto dismiss
      if (!notification.persistent) {
        const timeoutId = setTimeout(() => {
           get().dismissNotification(id);
        }, notification.duration);
        timeouts.set(id, timeoutId);
      }
    },

    dismissNotification: (id) => {
      // Clear timeout if exists
      if (timeouts.has(id)) {
        clearTimeout(timeouts.get(id));
        timeouts.delete(id);
      }

      set((state) => {
        const index = state.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
          if (!state.notifications[index].isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(index, 1);
        }
      });
    },

    markAsRead: (id) => {
      set((state) => {
        const notification = state.notifications.find(n => n.id === id);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }

        const histNotification = state.notificationHistory.find(n => n.id === id);
        if (histNotification) {
          histNotification.isRead = true;
        }
      });
    },

    clearAll: () => {
      // Clear all timeouts
      timeouts.forEach(clearTimeout);
      timeouts.clear();

      set((state) => {
        state.notifications = [];
        state.unreadCount = 0;
      });
    },

    getByApp: (appId) => {
      return get().notificationHistory.filter(n => n.appId === appId);
    },
  }))
);
