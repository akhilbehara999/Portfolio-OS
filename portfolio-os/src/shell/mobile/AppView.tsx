import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import type { AppDefinition } from '../../types/app.types';
import { LuChevronLeft, LuMenu } from 'react-icons/lu';

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
  };

  return (
    <motion.div
      className="fixed inset-0 z-[50] bg-white dark:bg-gray-900 overflow-hidden flex flex-col"
      initial={{ scale: 0.8, opacity: 0, borderRadius: '40px' }}
      animate={{ scale: 1, opacity: 1, borderRadius: '0px' }}
      exit={{ scale: 0.8, opacity: 0, borderRadius: '40px', y: 100 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ right: 0.2 }} // Only elastic on right (back swipe)
      onDragEnd={handleDragEnd}
      style={{ originY: 0.5 }} // Zoom from center
    >
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10 pt-[calc(var(--sat)+12px)]">
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:scale-90"
        >
          <LuChevronLeft className="w-6 h-6" />
        </button>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold truncate flex-1 text-center"
        >
          {app.name}
        </motion.h1>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <LuMenu className="w-6 h-6" />
        </button>
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-auto pb-[var(--sab)]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Component />
          </motion.div>
        </Suspense>
      </div>
    </motion.div>
  );
};
