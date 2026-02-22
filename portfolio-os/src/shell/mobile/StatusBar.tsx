import React from 'react';
import { motion } from 'framer-motion';
import { LuWifi, LuBatteryFull, LuSignal } from 'react-icons/lu';
import { useOSStore } from '../../store/os.store';

interface StatusBarProps {
  color?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ color = 'white' }) => {
  const { currentTime } = useOSStore();

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[calc(44px+var(--sat))] pt-[var(--sat)] px-6 flex items-center justify-between z-[100]"
      style={{ color }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="font-medium text-sm w-20">{formattedTime}</div>

      <div className="flex-1 text-center font-semibold text-sm opacity-0">
        {/* Dynamic Title can go here */}
      </div>

      <div className="flex items-center gap-2 w-20 justify-end">
        <LuSignal className="w-4 h-4" />
        <LuWifi className="w-4 h-4" />
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold">100%</span>
          <LuBatteryFull className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};
