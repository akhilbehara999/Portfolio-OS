import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { BootScreen } from '../../shell/shared/BootScreen';
import { useBootSequence } from '../../hooks/useBootSequence';
import { useSettingsStore } from '../../store/settings.store';
import { useSound } from '../../hooks/useSound';
import { BootStatus } from '../../types/os.types';

// Mock hooks
vi.mock('../../hooks/useBootSequence', () => ({
  useBootSequence: vi.fn(),
}));

vi.mock('../../store/settings.store', () => ({
  useSettingsStore: vi.fn(),
}));

vi.mock('../../hooks/useSound', () => ({
  useSound: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => {
      return <div data-testid="animate-presence">{children}</div>;
    },
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  };
});

describe('BootScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    (useSettingsStore as any).mockReturnValue({
      soundEnabled: true,
      setSoundEnabled: vi.fn(),
    });
    (useSound as any).mockReturnValue({
      playSound: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders progress bar and status messages', () => {
    (useBootSequence as any).mockReturnValue({
      progress: 50,
      statusMessage: 'Loading kernel...',
      bootPhase: BootStatus.BOOTING,
      isComplete: false,
    });

    render(<BootScreen onComplete={vi.fn()} />);

    // Advance timers for typewriter
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText((content) => content.includes('Loading kernel...'))).toBeInTheDocument();
  });

  it('completes boot sequence', () => {
    (useBootSequence as any).mockReturnValue({
      progress: 100,
      statusMessage: 'Ready',
      bootPhase: BootStatus.READY,
      isComplete: true,
    });

    render(<BootScreen onComplete={vi.fn()} />);

    // Advance time past the timeout (BootScreen sets timeout to hide when READY)
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Check if the component effectively unmounted its content (due to show=false)
    // The matrix rain canvas or "PortfolioOS" text should be gone.
    expect(screen.queryByText('Portfolio')).not.toBeInTheDocument();
  });
});
