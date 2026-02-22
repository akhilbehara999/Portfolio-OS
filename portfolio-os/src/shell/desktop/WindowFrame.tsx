import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useWindowStore } from '../../store/window.store';
import { useThemeStore } from '../../store/theme.store';
import { useSound } from '../../hooks/useSound';
import type { WindowState } from '../../types/window.types';
import * as LucideIcons from 'react-icons/lu';
import type { IconType } from 'react-icons';

interface WindowFrameProps {
  windowState: WindowState;
  children: React.ReactNode;
}

const getIconComponent = (iconName: string): IconType => {
  const pascalCase = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  const iconKey = `Lu${pascalCase}`;
  return (LucideIcons as any)[iconKey] || LucideIcons.LuAppWindow;
};

export const WindowFrame: React.FC<WindowFrameProps> = ({ windowState, children }) => {
  const { id, title, icon, position, size, isMinimized, isMaximized, isFocused, zIndex } =
    windowState;

  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow,
    snapWindow,
  } = useWindowStore();

  const { isDarkMode } = useThemeStore();
  const { playSound } = useSound();
  const IconComponent = React.useMemo(() => getIconComponent(icon), [icon]);

  // Local state for smooth dragging
  const [localPos, setLocalPos] = useState(position);
  const [localSize, setLocalSize] = useState(size);
  const isDraggingRef = useRef(false);

  // Drag Tilt Logic
  const x = useMotionValue(0);
  const rotateY = useTransform(x, [-50, 50], [-2, 2]); // Tilt left/right

  const [snapPreview, setSnapPreview] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Initial Open Sound & Ripple
  useEffect(() => {
    playSound('window-open');

    // Dispatch ripple event from center of window (best effort)
    const centerX = position.x + size.width / 2;
    const centerY = position.y + size.height / 2;

    const event = new CustomEvent('window-open-ripple', {
      detail: { x: centerX, y: centerY },
    });
    window.dispatchEvent(event);

    return () => {
      // Cleanup sound
      playSound('window-close');
    };
  }, []); // Only on mount

  // Sync from store when not dragging
  useEffect(() => {
    if (!isDraggingRef.current && !isMaximized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalPos(position);
      setLocalSize(size);
    }
  }, [position, size, isMaximized]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+W: Close Window
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
        e.preventDefault();
        e.stopPropagation();
        closeWindow(id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocused, closeWindow, id]);

  // Handle focus
  const handleMouseDown = () => {
    if (!isFocused) focusWindow(id);
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
    handleMouseDown();
  };

  const handleDrag = (e: any, d: any) => {
    setLocalPos({ x: d.x, y: d.y });

    // Calculate drag velocity proxy for tilt
    const velocity = d.deltaX * 2; // amplify
    x.set(velocity);

    const screenW = window.innerWidth;
    const screenH = window.innerHeight - 48;
    const margin = 10;

    // Snapping Logic
    if (e.clientY < margin) {
      setSnapPreview({ x: 0, y: 0, width: screenW, height: screenH });
    } else if (e.clientX < margin) {
      setSnapPreview({ x: 0, y: 0, width: screenW / 2, height: screenH });
    } else if (e.clientX > screenW - margin) {
      setSnapPreview({ x: screenW / 2, y: 0, width: screenW / 2, height: screenH });
    } else {
      setSnapPreview(null);
    }
  };

  const handleDragStop = (_e: any, d: any) => {
    isDraggingRef.current = false;
    x.set(0); // Reset tilt

    if (snapPreview) {
      if (snapPreview.width === window.innerWidth) {
        snapWindow(id, 'maximize');
      } else if (snapPreview.x === 0) {
        snapWindow(id, 'left');
      } else {
        snapWindow(id, 'right');
      }
      setSnapPreview(null);
    } else {
      moveWindow(id, { x: d.x, y: d.y });
    }
  };

  const handleResizeStop = (_e: any, _direction: any, ref: any, _delta: any, position: any) => {
    const newSize = {
      width: parseInt(ref.style.width),
      height: parseInt(ref.style.height),
    };
    setLocalSize(newSize);
    setLocalPos(position);
    resizeWindow(id, newSize);
    moveWindow(id, position);
  };

  // Determine Rnd props
  const rndSize = isMaximized ? { width: '100%', height: 'calc(100vh - 48px)' } : localSize;
  const rndPosition = isMaximized ? { x: 0, y: 0 } : localPos;

  return (
    <>
      <AnimatePresence>
        {snapPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed bg-blue-500 rounded-lg z-[9000] pointer-events-none border-2 border-blue-300"
            style={{
              left: snapPreview.x,
              top: snapPreview.y,
              width: snapPreview.width,
              height: snapPreview.height,
            }}
          />
        )}
      </AnimatePresence>

      <Rnd
        size={rndSize}
        position={rndPosition}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        onResizeStart={handleMouseDown}
        onResizeStop={handleResizeStop}
        disableDragging={isMaximized}
        enableResizing={!isMaximized}
        minWidth={300}
        minHeight={200}
        bounds="parent"
        style={{ zIndex }}
        dragHandleClassName="window-titlebar"
        className={`flex flex-col rounded-lg overflow-hidden transition-all duration-200 pointer-events-auto
          ${isFocused ? 'shadow-[0_25px_60px_rgba(0,0,0,0.5)] scale-[1.002]' : 'shadow-xl opacity-95 scale-100'}
          ${isDarkMode ? 'bg-gray-900/85 border-gray-700' : 'bg-white/85 border-white/40'}
          backdrop-blur-xl border
          ${isMaximized ? '!rounded-none !border-none !transition-none' : ''}
          ${isMinimized ? '!pointer-events-none !opacity-0' : ''}
        `}
      >
        <motion.div
          className="flex flex-col w-full h-full"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: isMinimized ? 0 : 1,
            scale: isMinimized ? 0.8 : 1,
            y: isMinimized ? 200 : 0,
          }}
          style={{ rotateY }}
          transition={{ duration: 0.2 }}
        >
          {/* Title Bar - Increased height for touch targets */}
          <div
            className={`window-titlebar h-12 flex items-center justify-between px-3 select-none flex-shrink-0
                 transition-colors duration-300
                 ${
                   isDarkMode
                     ? isFocused
                       ? 'bg-gradient-to-r from-gray-800 to-gray-900'
                       : 'bg-black/20'
                     : isFocused
                       ? 'bg-gradient-to-r from-gray-100 to-white'
                       : 'bg-black/5'
                 }
                 border-b ${isDarkMode ? 'border-white/10' : 'border-black/5'}
              `}
            onDoubleClick={() => maximizeWindow(id)}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                className={`flex items-center justify-center
                     ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}
                  `}
              >
                {React.createElement(IconComponent, { size: 16 })}
              </div>
              <span
                className={`text-xs font-medium truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                {title}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors group`}
                onClick={(e) => {
                  e.stopPropagation();
                  minimizeWindow(id);
                }}
              >
                <LucideIcons.LuMinus size={16} className="opacity-50 group-hover:opacity-100" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors group`}
                onClick={(e) => {
                  e.stopPropagation();
                  maximizeWindow(id);
                }}
              >
                {isMaximized ? (
                  <LucideIcons.LuMinimize2
                    size={16}
                    className="opacity-50 group-hover:opacity-100"
                  />
                ) : (
                  <LucideIcons.LuMaximize2
                    size={16}
                    className="opacity-50 group-hover:opacity-100"
                  />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#ef4444', color: 'white', rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 flex items-center justify-center rounded-md hover:bg-red-500 hover:text-white transition-colors group`}
                onClick={(e) => {
                  e.stopPropagation();
                  closeWindow(id);
                }}
              >
                <LucideIcons.LuX size={16} className="opacity-50 group-hover:opacity-100" />
              </motion.button>
            </div>
          </div>

          {/* Window Content */}
          <div className="flex-1 relative overflow-hidden" onMouseDown={handleMouseDown}>
            {children}
          </div>
        </motion.div>
      </Rnd>
    </>
  );
};

export default WindowFrame;
