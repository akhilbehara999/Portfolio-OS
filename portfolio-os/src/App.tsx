import React, { Suspense, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useOSStore } from './store/os.store';
import { useBootSequence } from './hooks/useBootSequence';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { BootScreen } from './shell/shared/BootScreen';
import { LockScreen } from './shell/shared/LockScreen';
import { BootStatus } from './types/os.types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DeviceRouter } from './components/DeviceRouter';
import { KEYBOARD_SHORTCUTS } from './config/keyboard-shortcuts';
import { eventBus, EventType } from './core/kernel/event-bus';
import { useThemeStore } from './store/theme.store';
import { useShallow } from 'zustand/react/shallow';

function App() {
  // Initialize Boot Sequence
  const { bootPhase } = useBootSequence();

  // OS State
  const { isLocked, lock } = useOSStore(
    useShallow((state) => ({
      isLocked: state.isLocked,
      lock: state.lock,
    }))
  );

  // Initialize Theme Store (ensure CSS variables are applied)
  useThemeStore((state) => state.currentTheme);

  // Register Global Shortcuts
  useKeyboardShortcuts(KEYBOARD_SHORTCUTS);

  // Handle Global Shortcut Events (only those that App needs to handle directly)
  useEffect(() => {
    const handleShortcut = (payload: { shortcutId: string }) => {
      switch (payload.shortcutId) {
        case 'lock-screen':
          lock();
          break;
        // Other shortcuts are handled by specific components
      }
    };

    eventBus.on(EventType.SHORTCUT_TRIGGERED, handleShortcut);
    return () => {
      eventBus.off(EventType.SHORTCUT_TRIGGERED, handleShortcut);
    };
  }, [lock]);

  // Document Title & Viewport & Context Menu
  useEffect(() => {
    document.title = 'PortfolioOS | Your Name';

    // Prevent default context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);

    // Enforce viewport settings
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'viewport');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const showBootScreen = bootPhase === BootStatus.BOOTING || bootPhase === BootStatus.LOADING_SHELL || bootPhase === BootStatus.COLD_START;
  const isReady = bootPhase === BootStatus.READY;
  const isLoadingShell = bootPhase === BootStatus.LOADING_SHELL;

  // We render the shell when loading or ready, but hide it during loading to let it initialize
  const shouldRenderShell = isReady || isLoadingShell;

  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="bg-black h-screen w-screen" />}>
        {/* Boot Screen Overlay */}
        {showBootScreen && <BootScreen />}

        {/* Main Shell */}
        {shouldRenderShell && (
          <div className={showBootScreen ? 'invisible absolute inset-0' : 'block h-full w-full'}>
             <DeviceRouter />
          </div>
        )}

        {/* Lock Screen Overlay */}
        {isReady && isLocked && <LockScreen />}

        {/* Global Toaster */}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(30, 41, 59, 0.9)',
              color: '#fff',
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              fontSize: '14px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
