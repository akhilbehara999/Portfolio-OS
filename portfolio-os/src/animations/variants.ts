import type { Variants, Transition } from 'framer-motion';
import { adjustTransition } from './transitions';

// Helper to access speed from custom prop
// We assume custom prop is the speed multiplier (number)
const getTransition = (base: Transition, speed: number = 1): Transition => {
  return adjustTransition(base, speed);
};

export const windowVariants: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  opening: (speed: number = 1) => ({
    scale: 1,
    opacity: 1,
    transition: getTransition({ type: 'spring', stiffness: 300, damping: 25 }, speed),
  }),
  closing: (speed: number = 1) => ({
    scale: 0.8,
    opacity: 0,
    transition: getTransition({ duration: 0.2 }, speed),
  }),
  minimizing: (speed: number = 1) => ({
    scale: 0.5,
    opacity: 0,
    y: 200, // Generic "down" movement
    transition: getTransition({ duration: 0.3 }, speed),
  }),
  maximizing: (speed: number = 1) => ({
    x: 0,
    y: 0,
    width: '100vw',
    height: '100vh',
    scale: 1,
    transition: getTransition({ type: 'spring', stiffness: 300, damping: 30 }, speed),
  }),
  restoring: (speed: number = 1) => ({
    scale: 1,
    width: 'var(--window-width, 800px)', // Fallback or variable
    height: 'var(--window-height, 600px)',
    transition: getTransition({ type: 'spring', stiffness: 300, damping: 30 }, speed),
  }),
};

export const menuVariants: Variants = {
  initial: {
    scaleY: 0,
    opacity: 0,
    originY: 0,
  },
  opening: (speed: number = 1) => ({
    scaleY: 1,
    opacity: 1,
    transition: {
      ...getTransition({ duration: 0.2 }, speed),
      staggerChildren: 0.05 / speed,
    },
  }),
  closing: (speed: number = 1) => ({
    scaleY: 0,
    opacity: 0,
    transition: {
      ...getTransition({ duration: 0.15 }, speed),
      staggerChildren: 0.03 / speed,
      staggerDirection: -1,
    },
  }),
};

export const pageVariants: Variants = {
  initialSlideLeft: { x: '100%', opacity: 0 },
  initialSlideRight: { x: '-100%', opacity: 0 },
  initialFadeScale: { opacity: 0, scale: 0.95 },
  initialSlideUp: { y: 50, opacity: 0 },

  slideLeft: (speed: number = 1) => ({
    x: 0,
    opacity: 1,
    transition: getTransition({ type: 'tween', ease: 'easeInOut', duration: 0.3 }, speed),
  }),
  slideRight: (speed: number = 1) => ({
    x: 0,
    opacity: 1,
    transition: getTransition({ type: 'tween', ease: 'easeInOut', duration: 0.3 }, speed),
  }),
  fadeScale: (speed: number = 1) => ({
    opacity: 1,
    scale: 1,
    transition: getTransition({ duration: 0.3 }, speed),
  }),
  slideUp: (speed: number = 1) => ({
    y: 0,
    opacity: 1,
    transition: getTransition({ type: 'spring', stiffness: 300, damping: 30 }, speed),
  }),
  exitSlideLeft: (speed: number = 1) => ({
    x: '-100%',
    opacity: 0,
    transition: getTransition({ type: 'tween', ease: 'easeInOut', duration: 0.3 }, speed),
  }),
  exitSlideRight: (speed: number = 1) => ({
    x: '100%',
    opacity: 0,
    transition: getTransition({ type: 'tween', ease: 'easeInOut', duration: 0.3 }, speed),
  }),
  exitFadeScale: (speed: number = 1) => ({
    opacity: 0,
    scale: 1.05,
    transition: getTransition({ duration: 0.2 }, speed),
  }),
  exitSlideUp: (speed: number = 1) => ({
    y: 50,
    opacity: 0,
    transition: getTransition({ duration: 0.2 }, speed),
  }),
};

export const iconVariants: Variants = {
  initial: { scale: 1, y: 0, rotate: 0 },
  tap: (speed: number = 1) => ({
    scale: 0.9,
    transition: getTransition({ duration: 0.1 }, speed),
  }),
  hover: (speed: number = 1) => ({
    scale: 1.1,
    y: -5,
    transition: getTransition({ type: 'spring', stiffness: 400, damping: 10 }, speed),
  }),
  bounce: (speed: number = 1) => ({
    y: [0, -10, 0],
    transition: {
      repeat: Infinity,
      duration: 0.6 / speed,
    },
  }),
  wiggle: (speed: number = 1) => ({
    rotate: [0, -2, 2, -2, 2, 0],
    transition: {
      repeat: Infinity,
      duration: 0.3 / speed,
    },
  }),
};

export const notificationVariants: Variants = {
  initial: { x: 300, opacity: 0 },
  enter: (speed: number = 1) => ({
    x: 0,
    opacity: 1,
    transition: getTransition({ type: 'spring', stiffness: 400, damping: 25 }, speed),
  }),
  exit: (speed: number = 1) => ({
    x: 300,
    opacity: 0,
    transition: getTransition({ duration: 0.2 }, speed),
  }),
};

export const drawerVariants: Variants = {
  initial: { y: '100%' },
  open: (speed: number = 1) => ({
    y: 0,
    transition: getTransition({ type: 'spring', stiffness: 300, damping: 30 }, speed),
  }),
  closed: (speed: number = 1) => ({
    y: '100%',
    transition: getTransition({ type: 'spring', stiffness: 300, damping: 30 }, speed),
  }),
};

export const lockScreenVariants: Variants = {
  initial: { y: 0, opacity: 1 },
  unlock: (speed: number = 1) => ({
    y: '-100%',
    opacity: 0,
    transition: getTransition({ duration: 0.5, ease: 'easeInOut' }, speed),
  }),
  lock: (speed: number = 1) => ({
    y: 0,
    opacity: 1,
    transition: getTransition({ duration: 0.3 }, speed),
  }),
};

export const bootVariants: Variants = {
  initialLogo: { scale: 0.5, opacity: 0 },
  initialProgress: { width: '0%' },
  logoAppear: (speed: number = 1) => ({
    scale: 1,
    opacity: 1,
    transition: getTransition({ type: 'spring', stiffness: 100, damping: 20 }, speed),
  }),
  logoDisappear: (speed: number = 1) => ({
    scale: 5,
    opacity: 0,
    transition: getTransition({ duration: 0.8 }, speed),
  }),
  progressBar: (speed: number = 1) => ({
    width: '100%',
    transition: getTransition({ duration: 2, ease: 'linear' }, speed),
  }),
};
