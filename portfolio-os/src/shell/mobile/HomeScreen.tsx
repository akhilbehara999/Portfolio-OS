import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_REGISTRY } from '../../config/app-registry';
import type { AppDefinition } from '../../types/app.types';

interface HomeScreenProps {
  onAppLaunch: (app: AppDefinition) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onAppLaunch }) => {
  const [page, setPage] = useState(0);

  // Group apps
  const mainApps = APP_REGISTRY.filter((app) =>
    ['about', 'projects', 'skills', 'experience', 'resume', 'terminal'].includes(app.id)
  );

  const utilityApps = APP_REGISTRY.filter((app) => !mainApps.find((a) => a.id === app.id));

  const dockApps = APP_REGISTRY.filter((app) =>
    ['about', 'projects', 'contact', 'resume', 'terminal'].includes(app.id)
  );

  const pages = [
    // Page 0: Main
    <div key="page-0" className="flex flex-col gap-8 h-full">
      {/* Date/Greeting Widget */}
      <div className="flex flex-col gap-1 pt-12 px-6">
        <div className="text-sm font-medium uppercase tracking-wider opacity-60">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <div className="text-4xl font-bold tracking-tight">Good Morning,</div>
        <div className="text-4xl font-bold tracking-tight text-blue-500">Visitor</div>
      </div>

      {/* Featured Apps Grid */}
      <div className="grid grid-cols-4 gap-y-6 px-4">
        {mainApps.map((app) => (
          <AppIcon key={app.id} app={app} onClick={() => onAppLaunch(app)} />
        ))}
      </div>
    </div>,
    // Page 1: Utilities
    <div key="page-1" className="flex flex-col gap-8 h-full pt-12 px-4">
      {/* Quick Stats Widget */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex justify-around">
        <div className="text-center">
          <div className="text-2xl font-bold">10+</div>
          <div className="text-xs opacity-60">Projects</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">5+</div>
          <div className="text-xs opacity-60">Years</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">100%</div>
          <div className="text-xs opacity-60">Passion</div>
        </div>
      </div>

      {/* Remaining Apps Grid */}
      <div className="grid grid-cols-4 gap-y-6">
        {utilityApps.map((app) => (
          <AppIcon key={app.id} app={app} onClick={() => onAppLaunch(app)} />
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden h-full pb-[100px]">
      {/* Pages Container */}
      <div className="flex-1 relative">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={page}
            className="absolute inset-0"
            initial={{ opacity: 0, x: page === 0 ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: page === 0 ? 100 : -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, { offset }) => {
              if (offset.x < -100) {
                if (page < pages.length - 1) setPage(page + 1);
              } else if (offset.x > 100) {
                if (page > 0) setPage(page - 1);
              }
            }}
          >
            {pages[page]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Page Indicators */}
      <div className="flex justify-center gap-2 mb-4">
        {pages.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === page ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Dock */}
      <div className="mx-4 mb-2 p-3 bg-white/20 backdrop-blur-xl rounded-3xl flex justify-around items-center">
        {dockApps.map((app) => (
          <AppIcon
            key={`dock-${app.id}`}
            app={app}
            onClick={() => onAppLaunch(app)}
            showLabel={false}
            size="lg"
          />
        ))}
      </div>
    </div>
  );
};

interface AppIconProps {
  app: AppDefinition;
  onClick: () => void;
  showLabel?: boolean;
  size?: 'md' | 'lg';
}

const AppIcon: React.FC<AppIconProps> = ({ app, onClick, showLabel = true, size = 'md' }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        className={`
          flex items-center justify-center rounded-2xl shadow-lg
          ${size === 'lg' ? 'w-[56px] h-[56px]' : 'w-[52px] h-[52px]'}
          bg-gradient-to-br from-${app.accentColor}-400 to-${app.accentColor}-600 text-white
        `}
        style={{
          background: `linear-gradient(135deg, var(--color-${app.accentColor}-400), var(--color-${app.accentColor}-600))`,
        }}
      >
        <div className="text-2xl font-bold uppercase">{app.name.substring(0, 1)}</div>
      </motion.button>
      {showLabel && (
        <span className="text-xs font-medium text-white drop-shadow-md text-center leading-tight px-1 truncate w-full">
          {app.name}
        </span>
      )}
    </div>
  );
};
