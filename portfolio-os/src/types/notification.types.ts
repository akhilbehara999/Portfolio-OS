export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  /** Unique identifier for the notification */
  id: string;
  /** ID of the app that generated the notification */
  appId: string;
  /** Title of the notification */
  title: string;
  /** Main body text of the notification */
  message: string;
  /** Optional icon override */
  icon?: string;
  /** Type of notification to determine styling */
  type: NotificationType;
  /** Timestamp when the notification was created */
  timestamp: number;
  /** Whether the notification has been read by the user */
  isRead: boolean;
  /** Callback function when the notification is clicked */
  action?: () => void;
  /** If true, the notification will not auto-dismiss */
  persistent?: boolean;
  /** Duration in milliseconds before auto-dismissing (if not persistent) */
  duration?: number;
}
