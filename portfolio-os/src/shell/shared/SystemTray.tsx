import React from 'react';
import { motion } from 'framer-motion';
import { useClock } from '../../hooks/useClock';
import { useNotificationStore } from '../../store/notification.store';
import { useThemeStore } from '../../store/theme.store';
import { LuWifi, LuVolume2, LuBatteryCharging, LuMoon, LuSun, LuBell } from 'react-icons/lu';

export interface SystemTrayProps {
  onToggleNotifications: () => void;
  className?: string;
}

export const SystemTray: React.FC<SystemTrayProps> = ({
  onToggleNotifications,
  className = '',
}) => {
  const { time } = useClock();
  const { unreadCount } = useNotificationStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <div className={`flex items-center gap-4 px-2 ${className}`}>
      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleDarkMode}
        className={`p-1.5 rounded-full transition-colors ${
          isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-600'
        }`}
        title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
      >
        {isDarkMode ? <LuSun className="w-4 h-4" /> : <LuMoon className="w-4 h-4" />}
      </motion.button>

      {/* System Status Icons */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
          }`}
        >
          <LuWifi className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </div>
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
          }`}
        >
          <LuVolume2 className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </div>
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'
          }`}
        >
          <LuBatteryCharging
            className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          />
        </div>
      </div>

      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleNotifications}
        className={`relative p-2 rounded-full transition-colors ${
          isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-600'
        }`}
      >
        <LuBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-transparent"
          />
        )}
      </motion.button>

      {/* Clock */}
      <div
        className={`text-sm font-medium tabular-nums select-none cursor-default ${
          isDarkMode ? 'text-gray-200' : 'text-gray-800'
        }`}
      >
        {time}
      </div>
    </div>
  );
};
