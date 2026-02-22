import React, { useEffect, useState, useRef } from 'react';
import { useInView, useSpring, useMotionValue } from 'framer-motion';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
    duration: duration * 1000,
  });
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(end);
    }
  }, [isInView, end, motionValue]);

  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current) {
        setDisplayValue(Math.round(latest));
      }
    });
  }, [springValue]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};
