import { useEffect } from 'react';
import { useOSStore } from '../store/os.store';
import { BootStatus } from '../types/os.types';
import { useShallow } from 'zustand/react/shallow';

/**
 * Hook to manage the system boot sequence.
 * Automatically triggers boot on mount if the system is in COLD_START.
 */
export const useBootSequence = () => {
  const { bootStatus, bootProgress, bootMessage, boot } = useOSStore(
    useShallow((state) => ({
      bootStatus: state.bootStatus,
      bootProgress: state.bootProgress,
      bootMessage: state.bootMessage,
      boot: state.boot,
    }))
  );

  useEffect(() => {
    // Only trigger if specifically in cold start
    if (bootStatus === BootStatus.COLD_START) {
      boot();
    }
  }, [bootStatus, boot]);

  const isBooting = bootStatus === BootStatus.BOOTING || bootStatus === BootStatus.LOADING_SHELL;

  const isBooted = bootStatus === BootStatus.READY;

  return {
    bootPhase: bootStatus,
    progress: bootProgress,
    statusMessage: bootMessage,
    isBooted,
    isBooting,
    triggerBoot: boot,
  };
};
