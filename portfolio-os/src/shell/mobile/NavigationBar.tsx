import React from 'react';
import { motion } from 'framer-motion';

export const NavigationBar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[calc(34px+var(--sab))] flex justify-center items-center z-[100] pb-[calc(8px+var(--sab))]">
      <motion.div
        className="w-[140px] h-[5px] bg-white rounded-full opacity-60 hover:opacity-100 transition-opacity"
        whileTap={{ scale: 0.95 }}
      />
    </div>
  );
};
