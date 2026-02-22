import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const RippleEffect: React.FC = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const handleRipple = (event: CustomEvent<{ x: number; y: number }>) => {
      const { x, y } = event.detail;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y }]);

      // Clean up after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1000);
    };

    window.addEventListener('window-open-ripple' as any, handleRipple as any);
    return () => {
      window.removeEventListener('window-open-ripple' as any, handleRipple as any);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ opacity: 0.5, scale: 0, borderWidth: '2px' }}
            animate={{
              opacity: 0,
              scale: 4,
              borderWidth: '0px'
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute rounded-full border-white bg-white/10"
            style={{
              left: ripple.x - 50, // Center the 100px ripple
              top: ripple.y - 50,
              width: 100,
              height: 100,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
