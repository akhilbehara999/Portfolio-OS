import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useWindowStore } from '../../store/window.store';
import { APP_REGISTRY } from '../../config/app-registry';
import { useThemeStore } from '../../store/theme.store';
import { useSettingsStore } from '../../store/settings.store';
import { SystemTray } from '../shared/SystemTray';
import { StartMenu } from './StartMenu';
import * as LucideIcons from 'react-icons/lu';
import type { IconType } from 'react-icons';
import { useSound } from '../../hooks/useSound';

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

const DockIcon = ({
  item,
  mouseX,
  onClick,
  onMouseEnter,
  onMouseLeave,
  hoveredAppId,
  isDarkMode
}: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const { enableHoverEffects } = useSettingsStore();

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const Icon = getIconComponent(item.app!.icon);

  // Conditionally apply magnetic effect
  const style = enableHoverEffects ? { width } : { width: 40 };

  return (
    <div className="flex flex-col items-center justify-end h-full gap-1">
       {/* Tooltip */}
       <AnimatePresence>
          {hoveredAppId === item.id && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: -50, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              className={`absolute bottom-12 mb-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-xl z-50 pointer-events-none
                 ${isDarkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'}
               `}
            >
              {item.app!.name}
              {item.running && (
                <div className="flex gap-1 mt-1 justify-center opacity-60 text-[10px]">
                  {item.windows.length} window{item.windows.length > 1 ? 's' : ''}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      <motion.div
        ref={ref}
        style={style}
        className="aspect-square flex items-center justify-center relative"
      >
        <motion.button
          layout
          className={`w-full h-full rounded-xl flex items-center justify-center transition-colors duration-200 relative
             ${item.active ? 'bg-white/10' : 'hover:bg-white/5'}
           `}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          whileTap={{ scale: 0.9 }}
        >
          <Icon
            className={`w-3/5 h-3/5 transition-all duration-200
               ${item.minimized ? 'opacity-50 grayscale' : 'opacity-100'}
             `}
          />

          {/* Active Dot */}
          {item.running && (
            <motion.div
              layoutId={`indicator-${item.id}`}
              initial={{ scale: 0 }}
              animate={{
                scale: item.active ? 1.2 : 1,
                width: item.active ? 16 : 4,
                backgroundColor: item.active ? '#60A5FA' : '#9CA3AF'
              }}
              className={`absolute -bottom-1 h-1 rounded-full`}
            />
          )}

          {/* Notification Badge (Simulated) */}
          {item.id === 'contact' && (
             <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-gray-900" />
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export const Taskbar: React.FC<TaskbarProps> = ({ onToggleNotifications }) => {
  const { windows, activeWindowId, openWindow, focusWindow, minimizeWindow, getWindowsByApp } =
    useWindowStore();
  const { isDarkMode } = useThemeStore();
  const { playSound } = useSound();

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [hoveredAppId, setHoveredAppId] = useState<string | null>(null);

  const mouseX = useMotionValue(Infinity);

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
    playSound('click');
    if (!item.running) {
      openWindow(item.id);
    } else {
      const appWindows = item.windows;
      if (appWindows.length === 0) return;

      if (item.active) {
        appWindows.forEach((w: any) => minimizeWindow(w.id));
      } else {
        const lastWindow = appWindows[appWindows.length - 1];
        focusWindow(lastWindow.id);
      }
    }
  };

  return (
    <>
      <StartMenu isOpen={isStartOpen} onClose={() => setIsStartOpen(false)} />

      <motion.div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 h-16 z-[1000] flex items-center px-4 rounded-2xl backdrop-blur-xl border shadow-2xl
          ${isDarkMode ? 'bg-black/60 border-white/10' : 'bg-white/60 border-white/40'}
        `}
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {/* Start Button */}
        <div className="flex items-center h-full mr-4 border-r border-white/10 pr-4">
          <motion.button
            className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center
               ${isStartOpen ? 'bg-white/20' : 'hover:bg-white/10'}
             `}
            onClick={() => {
                playSound('click');
                setIsStartOpen(!isStartOpen);
            }}
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <LucideIcons.LuHexagon className="w-6 h-6 text-blue-500 fill-blue-500/20" />
          </motion.button>
        </div>

        {/* Dock Icons */}
        <div className="flex items-end gap-2 h-full pb-2">
          {taskbarItems.map((item) => (
            <DockIcon
                key={item.id}
                item={item}
                mouseX={mouseX}
                onClick={() => handleAppClick(item)}
                onMouseEnter={() => setHoveredAppId(item.id)}
                onMouseLeave={() => setHoveredAppId(null)}
                hoveredAppId={hoveredAppId}
                isDarkMode={isDarkMode}
            />
          ))}
        </div>

        {/* System Tray (Moved to right side inside dock or separate? Mac style is separate top bar, Windows is bottom right) */}
        {/* Current design puts it inside taskbar. I'll keep it but separated. */}
        <div className="flex items-center h-full ml-4 border-l border-white/10 pl-4">
          <SystemTray onToggleNotifications={onToggleNotifications} />
        </div>
      </motion.div>
    </>
  );
};

export default Taskbar;
