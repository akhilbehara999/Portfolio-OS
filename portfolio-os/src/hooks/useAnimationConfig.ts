import { useState, useEffect } from 'react';
import { useThemeStore } from '../store/theme.store';
import { useShallow } from 'zustand/react/shallow';

/**
 * Hook to provide animation configuration based on system preferences and theme settings.
 * Handles reduced motion and animation speed adjustments.
 */
export const useAnimationConfig = () => {
  const { animationSpeed } = useThemeStore(
    useShallow((state) => ({
      animationSpeed: state.animationSpeed,
    }))
  );

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Initial value set in useState

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      // Fallback
      mediaQuery.addListener(listener);
      return () => mediaQuery.removeListener(listener);
    }
  }, []);

  const isReduced = prefersReducedMotion;
  // If reduced motion, duration multiplier is 0 (instant).
  // Otherwise, faster speed (higher number) means smaller duration multiplier.
  // animationSpeed 1 = 1x duration. animationSpeed 2 = 0.5x duration.
  const multiplier = isReduced ? 0 : 1 / (animationSpeed || 1);

  const durations = {
    fast: 150 * multiplier,
    normal: 300 * multiplier,
    slow: 500 * multiplier,
  };

  return {
    durations,
    easings: {
      easeInOut: 'ease-in-out',
      easeOut: 'ease-out',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    springConfig: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      mass: 1,
    },
    fadeConfig: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: durations.normal / 1000 },
    },
    slideConfig: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 20, opacity: 0 },
      transition: { duration: durations.normal / 1000, type: 'spring' },
    },
    scaleConfig: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.9, opacity: 0 },
      transition: { duration: durations.fast / 1000 },
    },
  };
};
