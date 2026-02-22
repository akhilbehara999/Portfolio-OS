import { useState } from 'react';
import { motion } from 'framer-motion';
import { LuPlay, LuPause, LuSkipBack, LuSkipForward } from 'react-icons/lu';
import { PORTFOLIO_DATA } from '../config/portfolio-data';

interface MusicWidgetProps {
  size?: 'small' | 'medium' | 'large';
}

export const MusicWidget = ({ size = 'medium' }: MusicWidgetProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const name = PORTFOLIO_DATA.personal.name;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel w-full h-full p-4 md:p-6 rounded-2xl flex flex-col items-center justify-between overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 blur-3xl animate-pulse" />
      </div>

      <div className="flex flex-col items-center w-full z-10 flex-1 justify-center min-h-0">
        {/* Album Art */}
        <div
          className={`${size === 'small' ? 'w-20 h-20' : 'w-24 h-24 md:w-32 md:h-32'} shrink-0 rounded-full bg-gradient-to-tr from-slate-800 via-slate-900 to-black shadow-xl border-4 border-slate-700/50 flex items-center justify-center mb-4 relative animate-[spin_8s_linear_infinite]`}
          style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
        >
          {/* Vinyl effect */}
          <div className="absolute inset-0 rounded-full border border-white/5" />
          <div className="absolute inset-2 rounded-full border border-white/5" />
          <div className="absolute inset-4 rounded-full border border-white/5" />
          <div className="absolute inset-8 rounded-full border border-white/5 opacity-50" />

          {/* Center Label */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-inner">
            <div className="w-1.5 h-1.5 bg-black rounded-full" />
          </div>
        </div>

        <div className="text-center w-full px-4">
          <h3 className="font-bold text-slate-800 dark:text-white truncate text-base md:text-lg">
            Building Dreams
          </h3>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
            {name}
          </p>
        </div>
      </div>

      <div className="w-full mt-2 md:mt-4 z-10">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-200 dark:bg-white/10 rounded-full mb-4 md:mb-6 overflow-hidden relative group cursor-pointer">
          <div className="absolute inset-0 bg-slate-300 dark:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <motion.div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-500 relative"
            initial={{ width: '60%' }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 md:gap-8">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <LuSkipBack size={20} className="md:w-6 md:h-6" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-800 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            {isPlaying ? (
              <LuPause size={18} className="md:w-5 md:h-5" fill="currentColor" />
            ) : (
              <LuPlay size={18} className="ml-1 md:w-5 md:h-5" fill="currentColor" />
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <LuSkipForward size={20} className="md:w-6 md:h-6" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
