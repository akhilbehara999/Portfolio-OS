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

    if (IconComponent) return <IconComponent className="w-12 h-12 text-blue-500" />;
    return null;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-full min-h-[200px] p-8
      ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}
    `}
    >
      <div className="relative mb-8">
         {/* Icon Container with Pulse */}
         <motion.div
            className={`p-6 rounded-2xl shadow-lg relative z-10
               ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}
            `}
            animate={{
               scale: [1, 1.05, 1],
               boxShadow: [
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  "0 10px 15px -3px rgba(59, 130, 246, 0.3)",
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
               ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
         >
            {app ? renderIcon(app.icon) : <div className="w-12 h-12 bg-gray-200 rounded-full" />}
         </motion.div>

         {/* Background Glow */}
         <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150 animate-pulse" />
      </div>

      {/* Skeleton Text Lines */}
      <div className="w-full max-w-xs space-y-3">
         <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto overflow-hidden relative">
            <motion.div
               className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
               animate={{ x: ['-100%', '200%'] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
         </div>
         <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto overflow-hidden relative">
            <motion.div
               className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
               animate={{ x: ['-100%', '200%'] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.2 }}
            />
         </div>
      </div>

      <motion.p
        className="mt-6 text-xs font-mono opacity-50 uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.5 }}
      >
        {app ? `Initializing ${app.name}` : message}
      </motion.p>
    </div>
  );
};
