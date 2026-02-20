import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBootSequence } from '../../hooks/useBootSequence';
import { BootStatus } from '../../types/os.types';

interface BootScreenProps {
  onComplete?: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const { bootPhase, progress, statusMessage, isBooted } = useBootSequence();
  const [show, setShow] = useState(true);
  const [isFastBoot, setIsFastBoot] = useState(false);

  useEffect(() => {
    // Check for fast boot (already ready when mounted)
    if (bootPhase === BootStatus.READY) {
      setIsFastBoot(true);
      // Fast boot: show for 1.5s then hide
      const timer = setTimeout(() => {
        setShow(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Normal boot: hide when ready
    if (bootPhase === BootStatus.READY && !isFastBoot) {
      // Small delay to ensure 100% is seen
      const timer = setTimeout(() => {
        setShow(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [bootPhase, isFastBoot]);

  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {show && (
        <motion.div
          key="boot-screen"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 text-white overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: "blur(10px)",
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
        >
          {/* Background particles/gradient */}
          <div className="absolute inset-0 z-0 opacity-20">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black" />
          </div>

          {/* Logo */}
          <motion.div
            className="z-10 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative mb-8">
              <motion.div
                className="text-6xl font-bold tracking-tighter"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.2)",
                    "0 0 20px rgba(255,255,255,0.5)",
                    "0 0 10px rgba(255,255,255,0.2)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Portfolio<span className="text-blue-500">OS</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Progress Bar (Only for cold boot) */}
          {!isFastBoot && (
            <motion.div
              className="z-10 w-64 md:w-96 flex flex-col gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 50 }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 font-mono">
                <span>{statusMessage}</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </motion.div>
          )}

           {/* Fast Boot Message (Optional) */}
           {isFastBoot && (
            <motion.div
              className="z-10 mt-4 text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Resuming session...
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
