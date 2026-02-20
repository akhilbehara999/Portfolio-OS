import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useClock } from '../../hooks/useClock';
import { useOSStore } from '../../store/os.store';
import { useThemeStore } from '../../store/theme.store';
import { useNotificationStore } from '../../store/notification.store';
import { useShallow } from 'zustand/react/shallow';
// Using react-icons/lu for Lucide icons
import { LuChevronUp, LuLock } from 'react-icons/lu';

export const LockScreen: React.FC = () => {
  const { time, date } = useClock(true);
  const { unlock, isLocked } = useOSStore(
    useShallow((state) => ({
      unlock: state.unlock,
      isLocked: state.isLocked,
    }))
  );
  const { currentWallpaper } = useThemeStore(useShallow((state) => ({ currentWallpaper: state.currentWallpaper })));
  const { notifications } = useNotificationStore(useShallow((state) => ({ notifications: state.notifications })));

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Handle unlock attempt
  const handleUnlock = () => {
    // Simple unlock for now, or check password if provided
    if (showPassword && password === '0000') { // Example PIN
        unlock();
    } else if (!showPassword) {
        // Just unlock if no password field shown yet, or show password field?
        // Prompt says "Optional: Simple PIN/password field".
        // Let's just unlock for simplicity unless configured otherwise.
        unlock();
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y < -100) {
      unlock();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        unlock();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlock]);

  // Get recent notifications (last 3)
  const recentNotifications = notifications.slice(-3);

  return (
    <motion.div
      key="lock-screen"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between py-12 text-white overflow-hidden"
      initial={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', transition: { duration: 0.5, ease: 'easeInOut' } }}
      // Background with wallpaper and blur
      style={{
        backgroundImage: `url(${currentWallpaper.source})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-4 mt-20">
        {/* Lock Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <LuLock className="w-8 h-8 opacity-70" />
        </motion.div>

        {/* Clock */}
        <motion.h1
          className="text-8xl font-thin tracking-tight mb-2 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {time}
        </motion.h1>

        {/* Date */}
        <motion.p
          className="text-xl font-light opacity-80 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {date}
        </motion.p>

        {/* Notifications Preview */}
        {recentNotifications.length > 0 && (
            <motion.div
                className="mt-8 w-full space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                {recentNotifications.map((notif) => (
                    <div key={notif.id} className="bg-white/10 backdrop-blur-md rounded-lg p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs">
                           {/* Placeholder for app icon */}
                           <span className="uppercase">{notif.appId.slice(0, 2)}</span>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h4 className="text-sm font-medium truncate">{notif.title}</h4>
                            <p className="text-xs opacity-70 truncate">{notif.message}</p>
                        </div>
                    </div>
                ))}
            </motion.div>
        )}
      </div>

      {/* Unlock Prompt */}
      <motion.div
        className="relative z-10 flex flex-col items-center mb-10 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        onClick={handleUnlock}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <LuChevronUp className="w-6 h-6 opacity-70" />
        </motion.div>
        <p className="mt-2 text-sm font-light opacity-70 tracking-wide uppercase">
          Swipe up to unlock
        </p>
        <p className="text-xs font-light opacity-50 mt-1 hidden md:block">
            or Press Enter
        </p>
      </motion.div>
    </motion.div>
  );
};
