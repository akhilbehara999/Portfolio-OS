import { useState, useEffect } from 'react';
import type { DeviceMode } from '../types/os.types';

export interface ScreenSize {
  width: number;
  height: number;
}

export interface DeviceDetection {
  deviceMode: DeviceMode;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  screenSize: ScreenSize;
}

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;
const DEBOUNCE_DELAY = 150;

/**
 * Hook to detect current device type (mobile/tablet/desktop) and orientation.
 * Debounces resize events for performance.
 */
export const useDeviceDetection = (): DeviceDetection => {
  // Initialize with current window properties if available
  const getWindowDimensions = () => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return { width: 0, height: 0 };
  };

  const [screenSize, setScreenSize] = useState<ScreenSize>(getWindowDimensions());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScreenSize(getWindowDimensions());
      }, DEBOUNCE_DELAY);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Initial check
    setScreenSize(getWindowDimensions());

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const deviceMode: DeviceMode =
    screenSize.width >= DESKTOP_BREAKPOINT
      ? 'desktop'
      : screenSize.width >= TABLET_BREAKPOINT
        ? 'tablet'
        : 'mobile';

  const isPortrait = screenSize.height > screenSize.width;

  return {
    deviceMode,
    isMobile: deviceMode === 'mobile',
    isTablet: deviceMode === 'tablet',
    isDesktop: deviceMode === 'desktop',
    isPortrait,
    isLandscape: !isPortrait,
    screenSize,
  };
};
