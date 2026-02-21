import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindowStore } from '../../store/window.store';
import { APP_REGISTRY } from '../../config/app-registry';
import { useThemeStore } from '../../store/theme.store';
import { SystemTray } from '../shared/SystemTray';
import { StartMenu } from './StartMenu';
import * as LucideIcons from 'react-icons/lu';
import type { IconType } from 'react-icons';

const getIconComponent = (iconName: string): IconType => {
  const pascalCase = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  const iconKey = `Lu${pascalCase}`;
  return (LucideIcons as any)[iconKey] || LucideIcons.LuAppWindow;
};

interface TaskbarProps {
  onToggleNotifications: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({ onToggleNotifications }) => {
  const { windows, activeWindowId, openWindow, focusWindow, minimizeWindow, getWindowsByApp } =
    useWindowStore();
  const { isDarkMode } = useThemeStore();

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);

  // Pinned apps config
  const pinnedAppIds = ['about', 'projects', 'terminal', 'settings'];

  // Calculate taskbar items
  const taskbarItems = useMemo(() => {
    const runningAppIds = Array.from(new Set(Array.from(windows.values()).map((w) => w.appId)));

    // Start with pinned apps
    const items = pinnedAppIds
      .map((id) => {
        const app = APP_REGISTRY.find((a) => a.id === id);
        const isRunning = runningAppIds.includes(id);
        const appWindows = getWindowsByApp(id);
        const isActive = appWindows.some((w) => w.id === activeWindowId);
        const isMinimized = appWindows.every((w) => w.isMinimized) && appWindows.length > 0;

        return {
          id,
          app,
          pinned: true,
          running: isRunning,
          active: isActive,
          minimized: isMinimized,
          windows: appWindows,
        };
      })
      .filter((item) => item.app);

    // Add unpinned running apps
    runningAppIds.forEach((id) => {
      if (!pinnedAppIds.includes(id)) {
        const app = APP_REGISTRY.find((a) => a.id === id);
        if (app) {
          const appWindows = getWindowsByApp(id);
          const isActive = appWindows.some((w) => w.id === activeWindowId);
          const isMinimized = appWindows.every((w) => w.isMinimized);

          items.push({
            id,
            app,
            pinned: false,
            running: true,
            active: isActive,
            minimized: isMinimized,
            windows: appWindows,
          });
        }
      }
    });

    return items;
  }, [windows, activeWindowId, getWindowsByApp]);

  const handleAppClick = (item: any) => {
    if (!item.running) {
      openWindow(item.id);
    } else {
      // Logic for running apps
      const appWindows = item.windows;
      if (appWindows.length === 0) return; // Should not happen if running

      // If multiple windows, for now just focus the last one or cycle?
      // Simple logic:
      // If active -> minimize all
      // If minimized -> restore all (or last active)
      // If not active -> focus last active

      if (item.active) {
        // Minimize all windows of this app
        appWindows.forEach((w: any) => minimizeWindow(w.id));
      } else {
        // Restore/Focus
        // Find the most recently used window of this app?
        // Since we don't track MRU per app easily without looking at windowOrder,
        // let's just pick the last one in the list (which is usually latest created).
        // Or check if any is minimized.

        const lastWindow = appWindows[appWindows.length - 1];
        focusWindow(lastWindow.id);
      }
    }
  };

  return (
    <>
      <StartMenu isOpen={isStartOpen} onClose={() => setIsStartOpen(false)} />

      <motion.div
        className={`fixed bottom-0 left-0 right-0 h-12 z-[1000] flex items-center justify-between px-2 backdrop-blur-md border-t
          ${isDarkMode ? 'bg-black/50 border-white/10' : 'bg-white/50 border-white/40'}
        `}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Start Button */}
        <div className="flex items-center h-full">
          <button
            className={`p-2 rounded-md transition-all duration-200 active:scale-95 flex items-center justify-center
               ${isStartOpen ? 'bg-white/20' : 'hover:bg-white/10'}
             `}
            onClick={() => setIsStartOpen(!isStartOpen)}
          >
            <LucideIcons.LuHexagon className="w-6 h-6 text-blue-500 fill-blue-500/20" />
          </button>
        </div>

        {/* Center Dock */}
        <div className="flex items-center gap-1 h-full px-4">
          {taskbarItems.map((item) => {
            const Icon = getIconComponent(item.app!.icon);
            return (
              <div
                key={item.id}
                className="relative group flex flex-col items-center justify-center h-full"
              >
                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredAppId === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: -50 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute bottom-0 mb-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-xl
                         ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                       `}
                    >
                      {item.app!.name}
                      {item.running && (
                        <div className="flex gap-1 mt-1 justify-center">
                          {/* Simple preview visualization */}
                          <div
                            className={`w-8 h-5 rounded-sm border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-100'}`}
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 relative
                     ${item.active ? 'bg-white/10' : 'hover:bg-white/5'}
                   `}
                  onClick={() => handleAppClick(item)}
                  onMouseEnter={() => setHoveredAppId(item.id)}
                  onMouseLeave={() => setHoveredAppId(null)}
                >
                  <Icon
                    size={22}
                    className={`transition-all duration-200
                       ${item.minimized ? 'opacity-50 grayscale' : 'opacity-100'}
                       ${item.active ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''}
                     `}
                  />

                  {/* Running Indicator */}
                  {item.running && (
                    <motion.div
                      layoutId={`indicator-${item.id}`}
                      className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full
                         ${item.active ? 'bg-blue-400 w-4 rounded-full' : 'bg-gray-400'}
                       `}
                    />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* System Tray */}
        <div className="flex items-center h-full">
          <SystemTray onToggleNotifications={onToggleNotifications} />
        </div>
      </motion.div>
    </>
  );
};

export default Taskbar;
