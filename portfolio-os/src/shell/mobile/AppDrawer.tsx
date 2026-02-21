import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_REGISTRY } from '../../config/app-registry';
import type { AppDefinition } from '../../types/app.types';
import { LuSearch, LuX } from 'react-icons/lu';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAppLaunch: (app: AppDefinition) => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({ isOpen, onClose, onAppLaunch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredApps = useMemo(() => {
    return APP_REGISTRY.filter((app) => {
      const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || app.category === activeCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, activeCategory]);

  const categories = ['All', ...Array.from(new Set(APP_REGISTRY.map((app) => app.category)))];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-t-[30px] z-[50] flex flex-col overflow-hidden shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Search Bar */}
            <div className="px-4 py-2">
              <div className="relative">
                <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search apps..."
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <LuX />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* App Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 gap-6 content-start pb-20">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    onAppLaunch(app);
                    onClose();
                  }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md transition-transform group-active:scale-95`}
                    style={{ backgroundColor: app.accentColor || '#3b82f6' }} // Fallback color
                  >
                    {app.name.charAt(0)}
                  </div>
                  <span className="text-xs text-center font-medium line-clamp-2 w-full text-gray-700 dark:text-gray-200 leading-tight">
                    {app.name}
                  </span>
                </button>
              ))}

              {filteredApps.length === 0 && (
                <div className="col-span-4 text-center py-10 text-gray-400">No apps found.</div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
