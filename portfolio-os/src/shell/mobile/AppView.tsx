import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppDefinition } from '../../types/app.types';
import { LuChevronLeft, LuMoreHorizontal } from 'react-icons/lu';

interface AppViewProps {
  app: AppDefinition;
  onClose: () => void;
}

export const AppView: React.FC<AppViewProps> = ({ app, onClose }) => {
  const Component = app.component;

  // Simulate gestures
  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100 && info.velocity.x > 50) {
      onClose(); // Swipe back
    }
    if (info.offset.y < -100 && info.velocity.y < -50) {
      // Swipe up handled by parent usually, but here we can close
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[50] bg-white dark:bg-gray-900"
      initial={{ scale: 0.9, opacity: 0, y: 100 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ right: 0.2 }} // Only elastic on right
      onDragEnd={handleDragEnd}
    >
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10 pt-12">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <LuChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold truncate flex-1 text-center">{app.name}</h1>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <LuMoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-auto h-[calc(100vh-88px)]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          }
        >
          <Component />
        </Suspense>
      </div>
    </motion.div>
  );
};
