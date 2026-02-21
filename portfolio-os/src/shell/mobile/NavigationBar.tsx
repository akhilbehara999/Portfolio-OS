import React from 'react';
import { motion } from 'framer-motion';

export const NavigationBar: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-[34px] flex justify-center items-center z-[100] pb-2">
      <motion.div
        className="w-[140px] h-[5px] bg-white rounded-full opacity-60 hover:opacity-100 transition-opacity"
        whileTap={{ scale: 0.95 }}
      />
    </div>
  );
};
