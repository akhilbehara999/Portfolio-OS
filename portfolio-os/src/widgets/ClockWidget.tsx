import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useSettingsStore } from '../store/settings.store';

interface ClockWidgetProps {
  size?: 'small' | 'medium' | 'large';
  mode?: 'desktop' | 'mobile';
}

export const ClockWidget = ({ size = 'medium', mode = 'desktop' }: ClockWidgetProps) => {
  const [time, setTime] = useState(new Date());
  const { timeFormat } = useSettingsStore();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = format(time, timeFormat === '12h' ? 'h:mm aa' : 'HH:mm');
  const dateStr = format(time, 'EEEE, MMMM d');

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  if (mode === 'mobile') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center p-4 text-white w-full h-full"
      >
        <h1
          className="font-thin tracking-wider whitespace-nowrap"
          style={{ fontSize: '48px', fontWeight: 100, lineHeight: 1 }}
        >
          {timeStr}
        </h1>
        <p className="mt-2 text-lg text-white/80">{dateStr}</p>
      </motion.div>
    );
  }

  // Calculate rotation for hands
  // Use milliseconds to get smoother sweep or continuous tick without wrap-around glitches
  // But we update every second, so just use basic math and handle wrap around if needed
  // Using absolute values (total seconds today) avoids wrap around every minute
  const startOfDay = new Date(time.getFullYear(), time.getMonth(), time.getDate());
  const secondsSinceStart = (time.getTime() - startOfDay.getTime()) / 1000;

  const secondsDegrees = secondsSinceStart * 6; // 6 degrees per second
  const minutesDegrees = (secondsSinceStart / 60) * 6; // 6 degrees per minute
  const hoursDegrees = (secondsSinceStart / 3600) * 30; // 30 degrees per hour

  const scale = size === 'small' ? 0.75 : size === 'large' ? 1.25 : 1;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-panel w-full h-full flex flex-col items-center justify-center p-4 rounded-2xl relative overflow-hidden text-slate-800 dark:text-slate-100"
    >
      <div className="relative w-32 h-32 mb-4 shrink-0" style={{ transform: `scale(${scale})` }}>
        {/* Clock Face */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-white/20 bg-white/50 dark:bg-white/5 backdrop-blur-sm shadow-inner" />

        {/* Hour Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 w-0.5 h-2 bg-slate-400 dark:bg-white/40 origin-bottom -translate-x-1/2"
            style={{
              transform: `translateX(-50%) rotate(${i * 30}deg) translateY(4px)`,
              transformOrigin: '50% 64px',
            }}
          />
        ))}

        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-slate-800 dark:bg-white rounded-full z-20 shadow-md" />

        {/* Hour Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-1.5 h-8 bg-slate-800 dark:bg-white/80 origin-bottom -translate-x-1/2 rounded-full z-10"
          style={{
            transform: `translateX(-50%) translateY(-100%) rotate(${hoursDegrees}deg)`,
            transformOrigin: 'bottom center',
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-1 h-12 bg-slate-600 dark:bg-white/90 origin-bottom -translate-x-1/2 rounded-full z-10"
          style={{
            transform: `translateX(-50%) translateY(-100%) rotate(${minutesDegrees}deg)`,
            transformOrigin: 'bottom center',
          }}
        />

        {/* Second Hand */}
        <div
          className="absolute top-1/2 left-1/2 w-0.5 h-14 bg-red-500 origin-bottom -translate-x-1/2 rounded-full z-10"
          style={{
            transform: `translateX(-50%) translateY(-100%) rotate(${secondsDegrees}deg)`,
            transformOrigin: 'bottom center',
            transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)',
          }}
        />
      </div>

      <div className="text-center z-10">
        <h2 className="text-2xl font-bold tracking-wide font-mono">{timeStr}</h2>
        <p className="text-xs text-slate-500 dark:text-white/60 uppercase tracking-widest mt-1">
          {dateStr}
        </p>
      </div>
    </motion.div>
  );
};
