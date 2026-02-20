import { useOSStore } from '@store/os.store';
import { BootStatus } from '../../types/os.types';
import { eventBus, EventType } from '@core/kernel/event-bus';

interface BootPhase {
  id: string;
  duration: number; // Duration of this phase in ms
  message: string;
  startProgress: number; // Progress at start of phase
  endProgress: number; // Progress at end of phase
}

const BOOT_PHASES: BootPhase[] = [
  {
    id: 'hardware',
    duration: 500,
    message: 'Initializing hardware...',
    startProgress: 0,
    endProgress: 20,
  },
  {
    id: 'kernel',
    duration: 700,
    message: 'Loading kernel modules...',
    startProgress: 20,
    endProgress: 40,
  },
  {
    id: 'services',
    duration: 800,
    message: 'Starting system services...',
    startProgress: 40,
    endProgress: 60,
  },
  {
    id: 'desktop',
    duration: 800,
    message: 'Loading desktop environment...',
    startProgress: 60,
    endProgress: 80,
  },
  {
    id: 'welcome',
    duration: 700,
    message: 'Welcome',
    startProgress: 80,
    endProgress: 100,
  },
];

const FAST_BOOT_DURATION_MULTIPLIER = 0.2; // 5x faster

export class BootSequence {
  private static instance: BootSequence;

  private constructor() {}

  public static getInstance(): BootSequence {
    if (!BootSequence.instance) {
      BootSequence.instance = new BootSequence();
    }
    return BootSequence.instance;
  }

  public async run(): Promise<void> {
    const store = useOSStore.getState();

    // Check if we should fast boot
    const hasBootedBefore =
      typeof localStorage !== 'undefined' && localStorage.getItem('hasBootedBefore') === 'true';
    const isFastBoot = hasBootedBefore;

    // Set initial state
    useOSStore.setState({ bootStatus: BootStatus.BOOTING });

    const multiplier = isFastBoot ? FAST_BOOT_DURATION_MULTIPLIER : 1;

    for (const phase of BOOT_PHASES) {
      // Update message
      store.setBootMessage(phase.message);

      const startTime = Date.now();
      const duration = phase.duration * multiplier;

      // Simulate progress within the phase
      const interval = 50;
      let elapsed = 0;

      while (elapsed < duration) {
        elapsed = Date.now() - startTime;
        const phaseProgress = Math.min(elapsed / duration, 1);
        const totalProgress =
          phase.startProgress + (phase.endProgress - phase.startProgress) * phaseProgress;

        store.setBootProgress(Math.floor(totalProgress));
        eventBus.emit(EventType.BOOT_PROGRESS, {
          progress: Math.floor(totalProgress),
          message: phase.message,
        });

        await new Promise((resolve) => setTimeout(resolve, interval));
      }

      // Ensure we hit the end progress of the phase
      store.setBootProgress(phase.endProgress);
    }

    // Mark as booted in localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('hasBootedBefore', 'true');
    }

    // Finalize
    useOSStore.setState({
      bootStatus: BootStatus.READY,
      bootProgress: 100,
      bootMessage: 'System Ready',
    });
  }
}

export const runBootSequence = () => BootSequence.getInstance().run();
