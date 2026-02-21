import React, { useEffect, lazy } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useOSStore } from '../store/os.store';
import { AnimatePresence, motion } from 'framer-motion';

// Lazy load shells for code splitting
const DesktopShell = lazy(() => import('../shell/desktop/DesktopShell'));
const MobileShell = lazy(() => import('../shell/mobile/MobileShell'));

export const DeviceRouter = () => {
  const { isMobile, deviceMode } = useDeviceDetection();
  // We sync device mode with store for global access
  const setDeviceMode = useOSStore((state) => state.setDeviceMode);

  useEffect(() => {
    setDeviceMode(deviceMode);
  }, [deviceMode, setDeviceMode]);

  return (
    <AnimatePresence mode="wait">
      {isMobile ? (
        <motion.div
          key="mobile-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          <MobileShell />
        </motion.div>
      ) : (
        <motion.div
          key="desktop-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          <DesktopShell />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
