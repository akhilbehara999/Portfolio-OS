import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '../../store/window.store';
import { APP_REGISTRY } from '../../config/app-registry';
import { useThemeStore } from '../../store/theme.store';
import { useOSStore } from '../../store/os.store';
import * as LucideIcons from 'react-icons/lu';
import type { IconType } from 'react-icons';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const getIconComponent = (iconName: string): IconType => {
  const pascalCase = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  const iconKey = `Lu${pascalCase}`;
  return (LucideIcons as any)[iconKey] || LucideIcons.LuAppWindow;
};

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const { openWindow } = useWindowStore();
  const { isDarkMode } = useThemeStore();
  const { lock } = useOSStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Pinned apps (subset of registry)
  const pinnedAppIds = [
    'about',
    'projects',
    'terminal',
    'resume',
    'settings',
    'file-explorer',
    'browser',
    'skills',
    'contact',
  ];
  const pinnedApps = pinnedAppIds
    .map((id) => APP_REGISTRY.find((a) => a.id === id))
    .filter(Boolean);

  // All apps sorted alphabetically
  const allApps = useMemo(() => {
    return [...APP_REGISTRY].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const filteredApps = useMemo(() => {
    if (!searchQuery) return allApps;
    return allApps.filter(
      (app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allApps]);

  const handleLaunch = (appId: string) => {
    openWindow(appId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[40]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            className={`fixed bottom-14 left-4 z-[50] w-[600px] h-[500px] rounded-xl shadow-2xl overflow-hidden flex flex-col
              ${isDarkMode ? 'bg-gray-900/90 text-white' : 'bg-white/90 text-gray-900'}
              backdrop-blur-md border border-white/20
            `}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Search Bar */}
            <div className="p-4 border-b border-white/10">
              <div
                className={`flex items-center px-3 py-2 rounded-lg border
                ${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100/50 border-gray-200'}
              `}
              >
                <LucideIcons.LuSearch className="w-5 h-5 opacity-50 mr-2" />
                <input
                  type="text"
                  placeholder="Search apps..."
                  className="bg-transparent border-none outline-none flex-1 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && filteredApps.length > 0) {
                      handleLaunch(filteredApps[0].id);
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Pinned Apps (Left) */}
              <div className="w-1/2 p-4 border-r border-white/10 overflow-y-auto custom-scrollbar">
                <div className="text-xs font-semibold opacity-50 mb-3 px-2">Pinned</div>
                <div className="grid grid-cols-3 gap-2">
                  {pinnedApps.map((app) => {
                    const Icon = getIconComponent(app!.icon);
                    return (
                      <button
                        key={app!.id}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors
                            ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}
                          `}
                        onClick={() => handleLaunch(app!.id)}
                      >
                        <div
                          className={`w-10 h-10 mb-2 flex items-center justify-center rounded-lg bg-gradient-to-br from-${app!.accentColor}-500/20 to-${app!.accentColor}-600/20 text-${app!.accentColor}-500`}
                        >
                          <Icon size={24} />
                        </div>
                        <span className="text-xs text-center line-clamp-1 w-full">{app!.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* All Apps (Right) */}
              <div className="w-1/2 p-4 overflow-y-auto custom-scrollbar">
                <div className="text-xs font-semibold opacity-50 mb-3 px-2">
                  {searchQuery ? 'Results' : 'All Apps'}
                </div>
                <div className="flex flex-col gap-1">
                  {filteredApps.map((app) => {
                    const Icon = getIconComponent(app.icon);
                    return (
                      <button
                        key={app.id}
                        className={`flex items-center p-2 rounded-lg text-left transition-colors
                           ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}
                        `}
                        onClick={() => handleLaunch(app.id)}
                      >
                        <div
                          className={`w-8 h-8 mr-3 flex items-center justify-center rounded-md bg-white/5`}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="text-sm truncate">{app.name}</div>
                          <div className="text-xs opacity-50 truncate">{app.category}</div>
                        </div>
                      </button>
                    );
                  })}
                  {filteredApps.length === 0 && (
                    <div className="p-4 text-center opacity-50 text-sm">No apps found</div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`p-4 border-t border-white/10 flex items-center justify-between
                ${isDarkMode ? 'bg-black/20' : 'bg-gray-50/50'}
            `}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                  JS
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Jules Smith</span>
                  <span className="text-xs opacity-50">Software Engineer</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                  title="Lock"
                  onClick={() => {
                    lock();
                    onClose();
                  }}
                >
                  <LucideIcons.LuLock size={18} />
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                  title="Sleep"
                  onClick={() => {
                    onClose();
                  }} // Just close for sleep simulation
                >
                  <LucideIcons.LuMoon size={18} />
                </button>
                <button
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                  title="Refresh"
                  onClick={() => window.location.reload()}
                >
                  <LucideIcons.LuRefreshCw size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StartMenu;
