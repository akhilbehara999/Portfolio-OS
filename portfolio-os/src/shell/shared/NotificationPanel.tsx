import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNotificationStore } from '../../store/notification.store';
import { useThemeStore } from '../../store/theme.store';
import { APP_REGISTRY } from '../../config/app-registry';
import { LuX, LuBell, LuTrash2 } from 'react-icons/lu';
import { isToday, formatDistanceToNow } from 'date-fns';
import * as Icons from 'react-icons/lu';

export const NotificationPanel: React.FC = () => {
  const { notificationHistory, dismissNotification, clearAll } = useNotificationStore();
  const { isDarkMode } = useThemeStore();

  // Combine active notifications and history, deduplicating by ID
  const allNotifications = useMemo(() => {
    // History contains read notifications, active contains unread/active.
    // If we want to show all, we can merge.
    // Usually notification panel shows history too.
    // Let's use notificationHistory which seems to be the full log.
    return [...notificationHistory].sort((a, b) => b.timestamp - a.timestamp);
  }, [notificationHistory]);

  const groupedNotifications = useMemo(() => {
    const today: typeof allNotifications = [];
    const earlier: typeof allNotifications = [];

    allNotifications.forEach(n => {
      if (isToday(n.timestamp)) {
        today.push(n);
      } else {
        earlier.push(n);
      }
    });

    return { today, earlier };
  }, [allNotifications]);

  const renderIcon = (appId: string, iconName?: string) => {
    // Try to find app icon first
    const app = APP_REGISTRY.find(a => a.id === appId);
    const iconToRender = iconName || app?.icon || 'Bell';

    const IconComponent = (Icons as any)[iconToRender] ||
                          (Icons as any)['Lu' + iconToRender.charAt(0).toUpperCase() + iconToRender.slice(1)];

    if (IconComponent) return <IconComponent className="w-4 h-4" />;
    return <LuBell className="w-4 h-4" />;
  };

  const panelVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring' as const, damping: 25, stiffness: 200 }
    },
    exit: { x: '100%', opacity: 0 }
  };

  const listVariants = {
    visible: { transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <motion.div
      className={`absolute top-12 right-4 w-80 md:w-96 rounded-xl shadow-2xl overflow-hidden z-[50] border flex flex-col max-h-[80vh]
        ${isDarkMode ? 'bg-gray-900/95 border-gray-700 backdrop-blur-md' : 'bg-white/95 border-gray-200 backdrop-blur-md'}
      `}
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b
         ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}
      `}>
        <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Notifications
        </h3>
        {allNotifications.length > 0 && (
          <button
            onClick={clearAll}
            className={`text-xs px-2 py-1 rounded transition-colors flex items-center gap-1
               ${isDarkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
            `}
          >
            <LuTrash2 className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {allNotifications.length === 0 ? (
          <div className={`flex flex-col items-center justify-center h-40 text-center opacity-50`}>
            <LuBell className="w-12 h-12 mb-2" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <motion.div variants={listVariants} initial="hidden" animate="visible">
            {/* Today Section */}
            {groupedNotifications.today.length > 0 && (
              <div className="mb-4">
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-1 opacity-50
                   ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Today
                </h4>
                <div className="space-y-2">
                  {groupedNotifications.today.map(notification => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        isDarkMode={isDarkMode}
                        renderIcon={renderIcon}
                        onDismiss={() => dismissNotification(notification.id)}
                        variants={itemVariants}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Earlier Section */}
            {groupedNotifications.earlier.length > 0 && (
              <div>
                <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 pl-1 opacity-50
                   ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Earlier
                </h4>
                <div className="space-y-2">
                  {groupedNotifications.earlier.map(notification => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        isDarkMode={isDarkMode}
                        renderIcon={renderIcon}
                        onDismiss={() => dismissNotification(notification.id)}
                        variants={itemVariants}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Helper Component for Notification Item
const NotificationItem: React.FC<{
    notification: any,
    isDarkMode: boolean,
    renderIcon: (appId: string, icon?: string) => React.ReactNode,
    onDismiss: () => void,
    variants: any
}> = ({ notification, isDarkMode, renderIcon, onDismiss, variants }) => {
    return (
        <motion.div
            variants={variants}
            layout
            className={`relative group p-3 rounded-lg border transition-all cursor-default
                ${isDarkMode
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                    : 'bg-white border-gray-200 hover:border-blue-200 shadow-sm'
                }
            `}
        >
            <div className="flex gap-3">
                <div className={`mt-0.5 w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center
                    ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-500'}
                `}>
                    {renderIcon(notification.appId, notification.icon)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h5 className={`text-sm font-medium truncate pr-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {notification.title}
                        </h5>
                        <span className="text-[10px] opacity-50 whitespace-nowrap ml-2">
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </span>
                    </div>
                    <p className={`text-xs mt-0.5 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {notification.message}
                    </p>
                </div>
            </div>

            {/* Dismiss Button (Visible on Hover) */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDismiss();
                }}
                className={`absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                    ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-black/5 text-gray-500'}
                `}
            >
                <LuX className="w-3 h-3" />
            </button>
        </motion.div>
    );
};
