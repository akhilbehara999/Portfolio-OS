import { useState, useRef, useCallback, type PointerEvent } from 'react';

export interface DragPosition {
  x: number;
  y: number;
}

export interface DragConfig {
  /** Initial position of the element */
  initialPosition?: DragPosition;
  /** Size of the grid to snap to (default: 1 for no snapping) */
  gridSize?: number;
  /** Callback when dragging starts */
  onDragStart?: () => void;
  /** Callback when dragging ends */
  onDragEnd?: (position: DragPosition) => void;
  /** Callback during drag */
  onDrag?: (position: DragPosition) => void;
  /** Whether dragging is currently enabled */
  enabled?: boolean;
}

/**
 * Hook to handle drag and drop interactions with optional grid snapping.
 * Uses Pointer Events for cross-device support.
 */
export const useDragAndDrop = ({
  initialPosition = { x: 0, y: 0 },
  gridSize = 1,
  onDragStart,
  onDragEnd,
  onDrag,
  enabled = true,
}: DragConfig = {}) => {
  const [position, setPosition] = useState<DragPosition>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);

  const startPos = useRef<DragPosition>({ x: 0, y: 0 });
  const elementStartPos = useRef<DragPosition>({ x: 0, y: 0 });

  const handlePointerDown = useCallback(
    (e: PointerEvent) => {
      if (!enabled) return;

      // Allow default behavior for right click or special inputs if needed,
      // but usually we want to capture left click (button 0)
      if (e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      const target = e.currentTarget as HTMLElement;
      target.setPointerCapture(e.pointerId);

      setIsDragging(true);
      startPos.current = { x: e.clientX, y: e.clientY };
      elementStartPos.current = position;

      if (onDragStart) onDragStart();
    },
    [enabled, position, onDragStart]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation();

      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;

      const newX = elementStartPos.current.x + dx;
      const newY = elementStartPos.current.y + dy;

      setPosition({ x: newX, y: newY });
      if (onDrag) onDrag({ x: newX, y: newY });
    },
    [isDragging, onDrag]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation();

      const target = e.currentTarget as HTMLElement;
      target.releasePointerCapture(e.pointerId);

      setIsDragging(false);

      // Snap final position
      let finalX = position.x;
      let finalY = position.y;

      if (gridSize > 1) {
        finalX = Math.round(finalX / gridSize) * gridSize;
        finalY = Math.round(finalY / gridSize) * gridSize;
        setPosition({ x: finalX, y: finalY });
      }

      if (onDragEnd) onDragEnd({ x: finalX, y: finalY });
    },
    [isDragging, position, gridSize, onDragEnd]
  );

  return {
    isDragging,
    dragPosition: position,
    setPosition, // Expose setter if manual update needed
    dragHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      // Also handle cancel
      onPointerCancel: handlePointerUp,
    },
  };
};
