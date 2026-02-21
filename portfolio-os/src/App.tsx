import React, { useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { useOSStore } from './store/os.store';
import { BootScreen } from './shell/shared/BootScreen';
import { DesktopShell } from './shell/desktop/DesktopShell';
import { MobileShell } from './shell/mobile/MobileShell';
import { BootStatus } from './types/os.types';

function App() {
  // Use store directly to avoid triggering boot sequence twice (BootScreen handles it)
  const bootPhase = useOSStore((state) => state.bootStatus);
  const deviceMode = useOSStore((state) => state.deviceMode);

  const shouldRenderShell = useMemo(() => {
    return bootPhase === BootStatus.LOADING_SHELL || bootPhase === BootStatus.READY;
  }, [bootPhase]);

  return (
    <>
      <BootScreen />

      {shouldRenderShell && (deviceMode === 'mobile' ? <MobileShell /> : <DesktopShell />)}

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </>
  );
}

export default App;
