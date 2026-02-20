import { useNotificationStore } from '@store/notification.store';
import type { Notification } from '../../types/notification.types';

type NotificationPayload = Omit<Notification, 'id' | 'timestamp' | 'isRead'>;

class NotificationEngine {
  private static instance: NotificationEngine;
  private queue: NotificationPayload[] = [];
  private processing = false;
  private readonly MAX_VISIBLE = 3;
  private readonly STAGGER_DELAY = 300; // ms between notifications

  private constructor() {}

  public static getInstance(): NotificationEngine {
    if (!NotificationEngine.instance) {
      NotificationEngine.instance = new NotificationEngine();
    }
    return NotificationEngine.instance;
  }

  public push(notification: NotificationPayload): void {
    // Simple grouping logic: if last notification in queue or store is from same app and same message, skip
    const store = useNotificationStore.getState();
    const activeNotifications = store.notifications;
    const lastActive = activeNotifications[activeNotifications.length - 1];

    if (
      lastActive &&
      lastActive.appId === notification.appId &&
      lastActive.title === notification.title &&
      lastActive.message === notification.message
    ) {
        // Already exists as last notification, maybe update timestamp or count?
        // For now, let's just skip duplicate pushing to avoid spam.
        return;
    }

    // Check queue as well
    const lastQueued = this.queue[this.queue.length - 1];
    if (
        lastQueued &&
        lastQueued.appId === notification.appId &&
        lastQueued.title === notification.title &&
        lastQueued.message === notification.message
    ) {
        return;
    }

    this.queue.push(notification);
    this.processQueue();
  }

  private async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const store = useNotificationStore.getState();
      if (store.notifications.length < this.MAX_VISIBLE) {
        const notification = this.queue.shift();
        if (notification) {
          store.pushNotification(notification);
          // Wait for stagger delay
          await new Promise((resolve) => setTimeout(resolve, this.STAGGER_DELAY));
        }
      } else {
        // Wait until a slot opens up
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    this.processing = false;
  }
}

export const notificationEngine = NotificationEngine.getInstance();
