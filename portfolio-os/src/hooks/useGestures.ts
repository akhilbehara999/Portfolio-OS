import { useState, useRef, useEffect, type RefObject } from 'react';

export interface GestureState {
  isSwiping: boolean;
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null;
  distance: { x: number; y: number };
  velocity: { x: number; y: number };
}

interface GestureConfig {
  threshold?: number;
  onSwipeStart?: () => void;
  onSwipeMove?: (state: GestureState) => void;
  onSwipeEnd?: (state: GestureState) => void;
}

/**
 * Hook to handle touch/pointer gestures with continuous state updates.
 * Provides detailed state about swipe direction, distance, and velocity.
 */
export const useGestures = (ref: RefObject<HTMLElement | null>, config: GestureConfig = {}) => {
  const [gestureState, setGestureState] = useState<GestureState>({
    isSwiping: false,
    direction: null,
    distance: { x: 0, y: 0 },
    velocity: { x: 0, y: 0 },
  });

  const startPos = useRef<{ x: number; y: number } | null>(null);
  const startTime = useRef<number>(0);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const lastTime = useRef<number>(0);

  const THRESHOLD = config.threshold || 10;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handlePointerDown = (e: PointerEvent) => {
      startPos.current = { x: e.clientX, y: e.clientY };
      startTime.current = Date.now();
      lastPos.current = { x: e.clientX, y: e.clientY };
      lastTime.current = Date.now();
      element.setPointerCapture(e.pointerId);

      if (config.onSwipeStart) config.onSwipeStart();
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!startPos.current || !lastPos.current) return;

      const currentX = e.clientX;
      const currentY = e.clientY;
      const currentTime = Date.now();

      const distX = currentX - startPos.current.x;
      const distY = currentY - startPos.current.y;

      // Determine direction
      let direction: GestureState['direction'] = null;
      if (Math.abs(distX) > Math.abs(distY)) {
        direction = distX > 0 ? 'RIGHT' : 'LEFT';
      } else {
        direction = distY > 0 ? 'DOWN' : 'UP';
      }

      // Calculate velocity
      const dt = currentTime - lastTime.current;
      const vx = dt > 0 ? (currentX - lastPos.current.x) / dt : 0;
      const vy = dt > 0 ? (currentY - lastPos.current.y) / dt : 0;

      const isSwiping = Math.abs(distX) > THRESHOLD || Math.abs(distY) > THRESHOLD;

      const newState: GestureState = {
        isSwiping,
        direction,
        distance: { x: distX, y: distY },
        velocity: { x: vx, y: vy },
      };

      if (isSwiping) {
        setGestureState(newState);
        if (config.onSwipeMove) config.onSwipeMove(newState);
      }

      lastPos.current = { x: currentX, y: currentY };
      lastTime.current = currentTime;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!startPos.current) return;

      const finalState = { ...gestureState, isSwiping: false };
      setGestureState(finalState);

      if (config.onSwipeEnd) config.onSwipeEnd(finalState);

      startPos.current = null;
      element.releasePointerCapture(e.pointerId);
    };

    const handlePointerCancel = (e: PointerEvent) => {
      if (!startPos.current) return;
      setGestureState((prev) => ({ ...prev, isSwiping: false }));
      startPos.current = null;
      element.releasePointerCapture(e.pointerId);
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
    };
  }, [ref, config, gestureState]); // minimal dependency on gestureState

  return { gestureState };
};
