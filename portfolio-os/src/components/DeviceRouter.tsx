import { useEffect, lazy } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useOSStore } from '../store/os.store';

// Lazy load shells for code splitting
import MobileShell from '../shell/mobile/MobileShell';
const DesktopShell = lazy(() => import('../shell/desktop/DesktopShell'));
// const MobileShell = lazy(() => import('../shell/mobile/MobileShell'));

export const DeviceRouter = () => {
  const { isMobile, isTablet, deviceMode } = useDeviceDetection();
  // We sync device mode with store for global access
  const setDeviceMode = useOSStore((state) => state.setDeviceMode);

  useEffect(() => {
    setDeviceMode(deviceMode);
  }, [deviceMode, setDeviceMode]);

  // Use Mobile Shell for both mobile and tablet portrait (width < 1024px)
  // Tablet landscape (>= 1024px) is treated as desktop by useDeviceDetection
  const shouldUseMobileShell = isMobile || isTablet;

  return (
    <>
      {shouldUseMobileShell ? (
        <div className="h-full w-full">
          <MobileShell />
        </div>
      ) : (
        <div className="h-full w-full">
          <DesktopShell />
        </div>
      )}
    </>
  );
};
