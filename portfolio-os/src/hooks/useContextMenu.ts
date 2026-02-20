import { useState, useEffect, useCallback, useRef } from 'react';

export interface ContextMenuItem {
  label: string;
  action: () => void;
  icon?: string;
  disabled?: boolean;
  shortcut?: string;
  separator?: boolean;
  submenu?: ContextMenuItem[];
}

export interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
}

/**
 * Hook to manage custom context menus.
 * Handles positioning, visibility, and click-outside behavior.
 */
export const useContextMenu = () => {
  const [state, setState] = useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
    items: [],
  });

  const menuRef = useRef<HTMLDivElement>(null);

  const closeContextMenu = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const openContextMenu = useCallback(
    (event: React.MouseEvent | MouseEvent, items: ContextMenuItem[]) => {
      event.preventDefault();
      event.stopPropagation(); // prevent bubbling to other context handlers

      // Initial position from event
      let x = event.clientX;
      let y = event.clientY;

      // Adjust position to keep within viewport
      // We estimate menu dimensions or use a fixed width assumption if ref not available yet
      // Real adjustment might happen in effect after render if needed, but simple check is okay
      if (typeof window !== 'undefined') {
        const estimatedWidth = 220;
        const estimatedHeight = items.length * 36 + 20; // approximate height per item + padding

        if (x + estimatedWidth > window.innerWidth) {
          x -= estimatedWidth;
        }

        if (y + estimatedHeight > window.innerHeight) {
          y -= estimatedHeight;
        }
      }

      setState({
        isOpen: true,
        position: { x, y },
        items,
      });
    },
    []
  );

  // Close on click outside
  useEffect(() => {
    if (!state.isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };

    const handleScroll = () => {
      closeContextMenu();
    };

    // Use capture to handle events before they reach other elements if needed,
    // but here we just want to close if clicked elsewhere.
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { capture: true });
    window.addEventListener('resize', handleScroll);

    // Also close if another context menu is triggered?
    // The openContextMenu handles it by replacing state.

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('resize', handleScroll);
    };
  }, [state.isOpen, closeContextMenu]);

  return {
    isOpen: state.isOpen,
    position: state.position,
    menuItems: state.items,
    openContextMenu,
    closeContextMenu,
    menuRef,
  };
};
