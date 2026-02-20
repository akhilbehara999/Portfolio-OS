import { useEffect, useRef } from 'react';
import type { GestureConfig } from '../../types/input.types';
import { GestureType } from '../../types/input.types';

interface PointerState {
  id: number;
  x: number;
  y: number;
}

export const useGesture = (
  elementRef: React.RefObject<HTMLElement | null>,
  config: GestureConfig
) => {
  const activePointers = useRef<Map<number, PointerState>>(new Map());
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const startTime = useRef<number>(0);
  const lastTapTime = useRef<number>(0);
  const initialPinchDist = useRef<number | null>(null);

  // Defaults
  const SWIPE_THRESHOLD = config.threshold || 50; // px
  const LONG_PRESS_DELAY = config.threshold || 500; // ms
  const DOUBLE_TAP_DELAY = 300; // ms
  const PINCH_THRESHOLD = 20; // px change

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !config.enabled) return;

    const handlePointerDown = (e: PointerEvent) => {
      activePointers.current.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY });
      element.setPointerCapture(e.pointerId);

      if (activePointers.current.size === 1) {
        // Single touch start
        startPos.current = { x: e.clientX, y: e.clientY };
        startTime.current = Date.now();

        if (config.type === GestureType.LONG_PRESS) {
          longPressTimer.current = setTimeout(() => {
             config.onGesture(e);
          }, LONG_PRESS_DELAY);
        }
      } else if (activePointers.current.size === 2) {
        // Pinch start
        const pointers = Array.from(activePointers.current.values());
        const dist = Math.hypot(pointers[0].x - pointers[1].x, pointers[0].y - pointers[1].y);
        initialPinchDist.current = dist;

        // Cancel other gestures if pinching starts?
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (activePointers.current.has(e.pointerId)) {
        activePointers.current.set(e.pointerId, { id: e.pointerId, x: e.clientX, y: e.clientY });
      }

      // If moving significantly, cancel long press
      if (config.type === GestureType.LONG_PRESS && longPressTimer.current && startPos.current) {
         const currentX = e.clientX;
         const currentY = e.clientY;
         const dist = Math.hypot(currentX - startPos.current.x, currentY - startPos.current.y);
         if (dist > 10) {
              clearTimeout(longPressTimer.current);
              longPressTimer.current = null;
         }
      }

      // Pinch check
      if (activePointers.current.size === 2 && initialPinchDist.current !== null) {
        const pointers = Array.from(activePointers.current.values());
        const currentDist = Math.hypot(pointers[0].x - pointers[1].x, pointers[0].y - pointers[1].y);
        const diff = currentDist - initialPinchDist.current;

        if (Math.abs(diff) > PINCH_THRESHOLD) {
            if (config.type === GestureType.PINCH_IN && diff < 0) {
                config.onGesture(e);
                initialPinchDist.current = currentDist;
            } else if (config.type === GestureType.PINCH_OUT && diff > 0) {
                config.onGesture(e);
                initialPinchDist.current = currentDist;
            }
        }
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      activePointers.current.delete(e.pointerId);
      element.releasePointerCapture(e.pointerId);

      if (activePointers.current.size < 2) {
          initialPinchDist.current = null;
      }

      if (config.type === GestureType.LONG_PRESS && longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      // If it was the last pointer
      if (activePointers.current.size === 0 && startPos.current) {
        const endX = e.clientX;
        const endY = e.clientY;
        const diffX = endX - startPos.current.x;
        const diffY = endY - startPos.current.y;
        const absDiffX = Math.abs(diffX);
        const absDiffY = Math.abs(diffY);
        const timeElapsed = Date.now() - startTime.current;

        // Swipe detection
        if (timeElapsed < 500) {
            if (config.type === GestureType.SWIPE_LEFT && diffX < -SWIPE_THRESHOLD && absDiffY < absDiffX) {
                config.onGesture(e);
            } else if (config.type === GestureType.SWIPE_RIGHT && diffX > SWIPE_THRESHOLD && absDiffY < absDiffX) {
                config.onGesture(e);
            } else if (config.type === GestureType.SWIPE_UP && diffY < -SWIPE_THRESHOLD && absDiffX < absDiffY) {
                config.onGesture(e);
            } else if (config.type === GestureType.SWIPE_DOWN && diffY > SWIPE_THRESHOLD && absDiffX < absDiffY) {
                config.onGesture(e);
            }
        }

        // Double tap detection
        if (config.type === GestureType.DOUBLE_TAP) {
            const currentTime = Date.now();
            if (currentTime - lastTapTime.current < DOUBLE_TAP_DELAY) {
            config.onGesture(e);
            lastTapTime.current = 0; // Reset
            } else {
            lastTapTime.current = currentTime;
            }
        }

        startPos.current = null;
      }
    };

    const handlePointerCancel = (e: PointerEvent) => {
        activePointers.current.delete(e.pointerId);
        element.releasePointerCapture(e.pointerId);
        startPos.current = null;
        initialPinchDist.current = null;
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    element.addEventListener('pointerdown', handlePointerDown);
    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerup', handlePointerUp);
    element.addEventListener('pointercancel', handlePointerCancel);

    return () => {
      element.removeEventListener('pointerdown', handlePointerDown);
      element.removeEventListener('pointermove', handlePointerMove);
      element.removeEventListener('pointerup', handlePointerUp);
      element.removeEventListener('pointercancel', handlePointerCancel);
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
    };
  }, [elementRef, config]);
};
