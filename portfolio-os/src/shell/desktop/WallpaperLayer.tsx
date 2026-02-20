import React, { useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useThemeStore } from '../../store/theme.store';
import type { WallpaperConfig } from '../../types/theme.types';

const WallpaperRenderer = ({ wallpaper }: { wallpaper: WallpaperConfig }) => {
  const { source } = wallpaper;

  const getBackgroundStyle = () => {
    if (source.startsWith('data:') || source.startsWith('http')) {
      return { backgroundImage: `url("${source}")` };
    }
    return { background: source };
  };

  return (
    <div
      className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-300"
      style={{
        ...getBackgroundStyle(),
        filter: `blur(${wallpaper.blur}px) brightness(${wallpaper.brightness}%)`,
      }}
    />
  );
};

export const WallpaperLayer: React.FC = () => {
  const currentWallpaper = useThemeStore((state) => state.currentWallpaper);

  // Parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  const xMove = useTransform(smoothX, [0, window.innerWidth], [-15, 15]);
  const yMove = useTransform(smoothY, [0, window.innerHeight], [-15, 15]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <div className="absolute inset-0 overflow-hidden -z-50 bg-black">
      <motion.div
        className="absolute inset-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)]"
        style={{ x: xMove, y: yMove }}
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentWallpaper.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, zIndex: -1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            <WallpaperRenderer wallpaper={currentWallpaper} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Overlay for glassmorphism consistency if needed */}
      <div className="absolute inset-0 bg-transparent pointer-events-none" />
    </div>
  );
};

export default WallpaperLayer;
