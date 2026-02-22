import { motion } from 'framer-motion';
import { LuSun, LuMapPin } from 'react-icons/lu';
import { PORTFOLIO_DATA } from '../config/portfolio-data';

interface WeatherWidgetProps {
  size?: 'small' | 'medium' | 'large';
}

export const WeatherWidget = ({ size = 'medium' }: WeatherWidgetProps) => {
  // Mock data based on requirements
  const location = PORTFOLIO_DATA.personal.location.split(',')[0]; // Just city name for cleaner look
  const temp = 72;
  const condition = 'Sunny';

  const iconSize = size === 'small' ? 24 : size === 'large' ? 48 : 32;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-panel w-full h-full rounded-2xl flex flex-col justify-between overflow-hidden relative ${size === 'small' ? 'p-3' : 'p-4 md:p-5'}`}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-sky-300/10 dark:from-blue-900/20 dark:to-sky-800/20" />

      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col">
          <span className="text-4xl md:text-5xl font-light text-slate-800 dark:text-white tracking-tighter">
            {temp}°
          </span>
          <span className="text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium mt-1">
            {condition}
          </span>
        </div>
        <div className="bg-white/40 dark:bg-white/10 p-2 md:p-3 rounded-full backdrop-blur-sm shadow-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          >
            <LuSun size={iconSize} className="text-amber-500" fill="currentColor" />
          </motion.div>
        </div>
      </div>

      <div className="z-10 mt-auto">
        <div className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 bg-white/30 dark:bg-black/20 px-2 py-1 rounded-lg w-fit mb-2">
          <LuMapPin className="w-3 h-3 md:w-4 md:h-4 text-slate-500 dark:text-slate-400" />
          {location}
        </div>
        <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 italic">
          &quot;Forecast: Bright future ahead ☀️&quot;
        </p>
      </div>

      {/* Decorative cloud shapes */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl" />
      <div className="absolute top-10 right-10 w-16 h-16 bg-amber-400/10 rounded-full blur-xl" />
    </motion.div>
  );
};
