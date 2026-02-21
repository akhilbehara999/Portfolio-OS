import React from 'react';
import { motion } from 'framer-motion';
import { APP_REGISTRY } from '../../config/app-registry';
import { useThemeStore } from '../../store/theme.store';
import * as Icons from 'react-icons/lu';

interface LoadingScreenProps {
  appId?: string;
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ appId, message = 'Loading...' }) => {
  const { isDarkMode } = useThemeStore();
  const app = appId ? APP_REGISTRY.find((a) => a.id === appId) : null;

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent =
      (Icons as any)[iconName] ||
      (Icons as any)['Lu' + iconName.charAt(0).toUpperCase() + iconName.slice(1)];

    if (IconComponent) return <IconComponent className="w-12 h-12" />;
    return null;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full min-h-[200px]
      ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}
    `}
    >
      {app && (
        <motion.div
          className={`mb-6 p-4 rounded-xl shadow-lg
             ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
          `}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {renderIcon(app.icon)}
        </motion.div>
      )}

      {/* Spinner */}
      <motion.div
        className="w-8 h-8 rounded-full border-2 border-transparent border-t-current border-r-current mb-4 opacity-70"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />

      {/* Message */}
      <motion.p
        className="text-sm font-medium opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {app ? `Opening ${app.name}...` : message}
      </motion.p>
    </div>
  );
};
