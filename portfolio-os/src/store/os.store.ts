import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { BootStatus } from '../types/os.types';
import type { DeviceMode } from '../types/os.types';

interface OSState {
  bootStatus: BootStatus;
  bootProgress: number;
  bootMessage: string;
  deviceMode: DeviceMode;
  isLocked: boolean;
  uptime: number;
  currentTime: Date;
}

interface OSActions {
  boot: () => Promise<void>;
  setBootProgress: (progress: number) => void;
  setBootMessage: (message: string) => void;
  lock: () => void;
  unlock: (pin?: string) => void;
  sleep: () => void;
  wake: () => void;
  setDeviceMode: (mode: DeviceMode) => void;
  updateTime: () => void;
  incrementUptime: () => void;
}

export const useOSStore = create<OSState & OSActions>()(
  persist(
    immer((set) => ({
      bootStatus: BootStatus.COLD_START,
      bootProgress: 0,
      bootMessage: 'Initializing...',
      deviceMode: 'desktop',
      isLocked: false,
      uptime: 0,
      currentTime: new Date(),

      boot: async () => {
        // Fallback simple boot if runBootSequence is not used
        set((state) => { state.bootStatus = BootStatus.BOOTING; });
        await new Promise((resolve) => setTimeout(resolve, 2000));

        set((state) => { state.bootStatus = BootStatus.LOADING_SHELL; });
        await new Promise((resolve) => setTimeout(resolve, 1500));

        set((state) => {
          state.bootStatus = BootStatus.READY;
          state.uptime = 0;
        });
      },

      setBootProgress: (progress) => set((state) => { state.bootProgress = progress; }),
      setBootMessage: (message) => set((state) => { state.bootMessage = message; }),

      lock: () => set((state) => { state.isLocked = true; }),
      unlock: () => set((state) => { state.isLocked = false; }),
      sleep: () => set((state) => { state.bootStatus = BootStatus.SLEEP; }),
      wake: () => set((state) => { state.bootStatus = BootStatus.READY; }),
      setDeviceMode: (mode) => set((state) => { state.deviceMode = mode; }),
      updateTime: () => set((state) => { state.currentTime = new Date(); }),
      incrementUptime: () => set((state) => { state.uptime += 1; }),
    })),
    {
      name: 'portfolio-os-state',
      partialize: (state) => ({
        isLocked: state.isLocked,
        deviceMode: state.deviceMode,
        uptime: state.uptime,
        bootStatus: state.bootStatus === BootStatus.READY ? BootStatus.READY : BootStatus.COLD_START,
      }),
    }
  )
);

// Initialize listeners and timers outside the hook
if (typeof window !== 'undefined') {
  const handleResize = () => {
    const width = window.innerWidth;
    let mode: DeviceMode = 'desktop';
    if (width < 768) mode = 'mobile';
    else if (width < 1024) mode = 'tablet';

    useOSStore.getState().setDeviceMode(mode);
  };

  window.addEventListener('resize', handleResize);
  // Initial check
  handleResize();

  setInterval(() => {
    const state = useOSStore.getState();
    state.updateTime();
    if (state.bootStatus === BootStatus.READY) {
      state.incrementUptime();
    }
  }, 1000);
}
