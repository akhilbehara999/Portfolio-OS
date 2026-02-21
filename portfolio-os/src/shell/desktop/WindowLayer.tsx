import React, { Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useWindowStore } from '../../store/window.store';
import { WindowFrame } from './WindowFrame';
import { LoadingScreen } from '../shared/LoadingScreen';

export const WindowLayer: React.FC = () => {
  const windows = useWindowStore((state) => state.windows);

  // Convert Map to Array for rendering
  const windowList = Array.from(windows.values());

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <AnimatePresence>
        {windowList.map((windowState) => {
          const AppComponent = windowState.component;

          return (
            <motion.div
              key={windowState.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: windowState.zIndex }}
            >
              <WindowFrame windowState={windowState}>
                <Suspense fallback={<LoadingScreen />}>
                  {AppComponent && <AppComponent windowId={windowState.id} />}
                </Suspense>
              </WindowFrame>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default WindowLayer;
