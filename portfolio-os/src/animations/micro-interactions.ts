import { animate } from 'framer-motion';
import type { Variants, MotionValue } from 'framer-motion';
import { useEffect } from 'react';

// Micro-interaction Variants

export const buttonPress: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const switchToggle: Variants = {
  on: { x: '100%', backgroundColor: '#4ade80' }, // Adjust color as needed or use class
  off: { x: '0%', backgroundColor: '#9ca3af' },
};

export const checkboxCheck: Variants = {
  checked: { pathLength: 1, opacity: 1, transition: { duration: 0.2 } },
  unchecked: { pathLength: 0, opacity: 0, transition: { duration: 0.2 } },
};

export const pulseGlow: Variants = {
  pulse: {
    boxShadow: ['0 0 0 0px rgba(66, 153, 225, 0.7)', '0 0 0 10px rgba(66, 153, 225, 0)'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const typewriterContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const typewriterChar: Variants = {
  hidden: { opacity: 0, display: 'none' },
  visible: { opacity: 1, display: 'inline' },
};

// CSS Class Generator for Ripple Effect
// Usage: Add the returned class to your element.
// Note: Requires the CSS to be present. We export the CSS as a constant to be injected.

export const RIPPLE_CSS = `
  .ripple-effect {
    position: relative;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
  }
  .ripple-effect:after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform .5s, opacity 1s;
  }
  .ripple-effect:active:after {
    transform: scale(0, 0);
    opacity: 0.2;
    transition: 0s;
  }
`;

export const getRippleClass = () => 'ripple-effect';

// Counter Up Animation Helper
// Since this is logic-heavy, we provide a hook-like helper using Framer Motion's animate

export const useCounterUp = (
  value: number,
  motionValue: MotionValue<number>,
  duration: number = 2
) => {
  useEffect(() => {
    const controls = animate(motionValue, value, { duration });
    return controls.stop;
  }, [value, motionValue, duration]);
};
