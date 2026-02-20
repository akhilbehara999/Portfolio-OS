import type { Transition } from 'framer-motion';

// Base transition configurations
export const snappy: Transition = { type: 'spring', stiffness: 500, damping: 30 };
export const smooth: Transition = { type: 'spring', stiffness: 200, damping: 25 };
export const gentle: Transition = { type: 'tween', duration: 0.3, ease: 'easeInOut' };
export const bounce: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 15,
  bounce: 0.3,
};
export const slow: Transition = {
  type: 'tween',
  duration: 0.6,
  ease: [0.16, 1, 0.3, 1],
};

export const transitions = {
  snappy,
  smooth,
  gentle,
  bounce,
  slow,
} as const;

/**
 * Adjusts a transition configuration based on the user's animation speed setting.
 * @param transition The base transition configuration.
 * @param speed The user's animation speed multiplier (default: 1).
 * @returns The adjusted transition configuration.
 */
export const adjustTransition = (transition: Transition, speed: number = 1): Transition => {
  if (speed === 1) return transition;

  // Create a shallow copy to avoid mutating the original
  const adjusted = { ...transition };

  // Helper to check if a property exists and is a number
  const isNumber = (val: unknown): val is number => typeof val === 'number';

  if (adjusted.type === 'spring') {
    // If duration is present in spring, it overrides physics
    if (isNumber(adjusted.duration)) {
      adjusted.duration /= speed;
    } else {
      // Adjust physics parameters
      // Frequency is proportional to sqrt(stiffness).
      // To scale speed by X, we scale stiffness by X^2.
      if (isNumber(adjusted.stiffness)) {
        adjusted.stiffness *= speed * speed;
      }
      // Damping needs to scale linearly with speed to maintain damping ratio
      if (isNumber(adjusted.damping)) {
        adjusted.damping *= speed;
      }
    }
  } else {
    // For tween (default), just adjust duration
    if (isNumber(adjusted.duration)) {
      adjusted.duration /= speed;
    } else if (adjusted.type === 'tween' && !adjusted.duration) {
      // Default duration is 0.3s or 0.8s depending on context,
      // but if not set we can't easily adjust it.
      // Assuming explicit duration is usually set for tweens we define.
    }
  }

  return adjusted;
};
