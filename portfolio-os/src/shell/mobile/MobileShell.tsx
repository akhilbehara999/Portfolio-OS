import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WallpaperLayer } from '../desktop/WallpaperLayer';
import { StatusBar } from './StatusBar';
import { HomeScreen } from './HomeScreen';
import { NavigationBar } from './NavigationBar';
import { AppDrawer } from './AppDrawer';
import { AppView } from './AppView';
import { NotificationShade } from './NotificationShade';
import { LockScreen } from '../shared/LockScreen';
import { useOSStore } from '../../store/os.store';
import type { AppDefinition } from '../../types/app.types';

export const MobileShell: React.FC = () => {
  const { isLocked } = useOSStore();
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [isNotificationShadeOpen, setIsNotificationShadeOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState<AppDefinition | null>(null);

  const handleAppLaunch = (app: AppDefinition) => {
    setCurrentApp(app);
    setIsAppDrawerOpen(false);
  };

  const handleCloseApp = () => {
    setCurrentApp(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none font-sans text-gray-900 dark:text-white">
      {/* 1. Wallpaper (Bottom) */}
      <WallpaperLayer />

      {/* 2. Main Content Layer */}
      <div className="absolute inset-0 z-0 flex flex-col">
        {/* Status Bar */}
        <StatusBar color={isNotificationShadeOpen ? 'white' : undefined} />

        {/* Home Screen (visible when no app is open) */}
        <AnimatePresence>
          {!currentApp && (
            <motion.div
              className="flex-1 pt-[calc(44px+var(--sat))] pb-[calc(34px+var(--sab))] h-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HomeScreen onAppLaunch={handleAppLaunch} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Bar */}
        <NavigationBar />
      </div>

      {/* 3. App View Layer */}
      <AnimatePresence>
        {currentApp && <AppView app={currentApp} onClose={handleCloseApp} />}
      </AnimatePresence>

      {/* 4. App Drawer Layer */}
      <AppDrawer
        isOpen={isAppDrawerOpen}
        onClose={() => setIsAppDrawerOpen(false)}
        onAppLaunch={handleAppLaunch}
      />

      {/* 5. Notification Shade Layer */}
      <NotificationShade
        isOpen={isNotificationShadeOpen}
        onClose={() => setIsNotificationShadeOpen(false)}
      />

      {/* 6. Gesture Areas (Invisible overlays) */}
      {/* Bottom Swipe Up Zone (for App Drawer) - Only active on Home Screen */}
      {!currentApp && !isAppDrawerOpen && !isNotificationShadeOpen && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-8 z-[150] bg-transparent"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y < -50) {
              setIsAppDrawerOpen(true);
            }
          }}
        />
      )}

      {/* Top Swipe Down Zone (for Notifications) */}
      {!isNotificationShadeOpen && !isLocked && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-8 z-[150] bg-transparent"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 50) {
              setIsNotificationShadeOpen(true);
            }
          }}
        />
      )}

      {/* 7. Lock Screen Layer */}
      <AnimatePresence>
        {isLocked && (
          <motion.div
            className="absolute inset-0 z-[5000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LockScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileShell;
