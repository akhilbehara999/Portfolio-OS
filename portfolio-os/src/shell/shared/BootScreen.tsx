import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBootSequence } from '../../hooks/useBootSequence';
import { BootStatus } from '../../types/os.types';
import { useSettingsStore } from '../../store/settings.store';
import { useSound } from '../../hooks/useSound';
import { LuVolume2, LuVolumeX } from 'react-icons/lu';

interface BootScreenProps {
  onComplete?: () => void;
}

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initial setup
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let columns = Math.floor(canvas.width / 20);
    let drops: number[] = new Array(columns).fill(1);

    // Characters: Katakana + Latin
    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロヲゴゾドボポ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0'; // Green text
      ctx.font = '15px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));

        // Randomly vary color slightly for "glitch" feel
        ctx.fillStyle = Math.random() > 0.95 ? '#FFF' : '#0fa';

        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Recalculate columns and drops on resize
      const newColumns = Math.floor(canvas.width / 20);
      if (newColumns !== columns) {
        // Create new drops array, preserving old positions if possible or resetting
        const newDrops = new Array(newColumns).fill(1);
        // Copy old drops to new array to avoid full reset
        for (let i = 0; i < Math.min(columns, newColumns); i++) {
           newDrops[i] = drops[i];
        }
        drops = newDrops;
        columns = newColumns;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 opacity-20 pointer-events-none" />;
};

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30); // Speed of typing

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}<span className="animate-pulse">_</span></span>;
};

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const { bootPhase, progress, statusMessage } = useBootSequence();
  const { soundEnabled, setSoundEnabled } = useSettingsStore();
  const { playSound } = useSound();

  const [show, setShow] = useState(true);
  const [isFastBoot, setIsFastBoot] = useState(false);

  useEffect(() => {
    // Check for returning user
    const hasBooted = localStorage.getItem('hasBootedBefore');
    if (hasBooted) {
       setIsFastBoot(true);
    } else {
       localStorage.setItem('hasBootedBefore', 'true');
    }

    // Check for fast boot (already ready when mounted or returning user)
    if (bootPhase === BootStatus.READY || hasBooted) {
      // Fast boot: show for 1.5s then hide
      const timer = setTimeout(() => {
        setShow(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [bootPhase]);

  useEffect(() => {
    // Normal boot: hide when ready
    if (bootPhase === BootStatus.READY && !isFastBoot) {
      if (soundEnabled) {
         playSound('startup');
      }

      // Small delay to ensure 100% is seen
      const timer = setTimeout(() => {
        setShow(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [bootPhase, isFastBoot, soundEnabled, playSound]);

  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {show && (
        <motion.div
          key="boot-screen"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-950 text-white overflow-hidden font-mono"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.5,
            filter: 'blur(20px)',
            transition: { duration: 0.8, ease: 'easeInOut' },
          }}
        >
          {/* Background Matrix Rain */}
          <MatrixRain />

          {/* Radial Gradient Overlay */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

          {/* Sound Toggle */}
          <div className="absolute top-8 right-8 z-50">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              {soundEnabled ? <LuVolume2 size={20} /> : <LuVolumeX size={20} />}
            </button>
          </div>

          {/* Logo */}
          <motion.div
            className="z-10 flex flex-col items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <motion.div
                className="text-6xl md:text-8xl font-bold tracking-tighter"
                style={{ textShadow: '0 0 40px rgba(59, 130, 246, 0.5)' }}
              >
                Portfolio<span className="text-blue-500">OS</span>
              </motion.div>
            </div>
            {isFastBoot && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="mt-4 text-xl text-gray-400"
               >
                 Welcome back, Visitor
               </motion.div>
            )}
          </motion.div>

          {/* Progress Bar (Only for cold boot) */}
          {!isFastBoot && (
            <motion.div
              className="z-10 w-80 md:w-[500px] flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {/* Glowing Progress Bar */}
              <div className="relative h-2 w-full bg-gray-900/50 rounded-full overflow-hidden border border-white/10 shadow-inner">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                  style={{
                    boxShadow: '0 0 20px 2px rgba(59, 130, 246, 0.5)'
                  }}
                />
                {/* Glowing Lead Tip */}
                <motion.div
                  className="absolute top-0 h-full w-2 bg-white blur-[2px]"
                  style={{ left: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between text-xs md:text-sm text-cyan-500/80 font-mono h-6">
                <div className="flex gap-2">
                  <span className="opacity-50">{'>'}</span>
                  <TypewriterText text={statusMessage} />
                </div>
                <span>{Math.round(progress)}%</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
