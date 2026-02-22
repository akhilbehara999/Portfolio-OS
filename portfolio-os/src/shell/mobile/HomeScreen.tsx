import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_REGISTRY } from '../../config/app-registry';
import type { AppDefinition } from '../../types/app.types';
import * as LucideIcons from 'react-icons/lu';
import type { IconType } from 'react-icons';

// Helper to get icon component
const getIconComponent = (iconName: string): IconType => {
  const pascalCase = iconName
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  const iconKey = `Lu${pascalCase}`;
  return (LucideIcons as any)[iconKey] || LucideIcons.LuAppWindow;
};

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
    <motion.div key="page-0" className="flex flex-col gap-8 h-full" initial={{ x: 0 }}>
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
        {mainApps.map((app, i) => (
          <AppIcon key={app.id} app={app} onClick={() => onAppLaunch(app)} delay={i * 0.05} />
        ))}
      </div>
    </motion.div>,
    // Page 1: Utilities
    <motion.div key="page-1" className="flex flex-col gap-8 h-full pt-12 px-4" initial={{ x: 0 }}>
      {/* Quick Stats Widget */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex justify-around shadow-lg border border-white/10">
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
        {utilityApps.map((app, i) => (
          <AppIcon key={app.id} app={app} onClick={() => onAppLaunch(app)} delay={i * 0.05} />
        ))}
      </div>
    </motion.div>,
  ];

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden h-full pb-[100px]">
      {/* Pages Container */}
      <div className="flex-1 relative">
        <AnimatePresence initial={false} mode="wait" custom={page}>
          <motion.div
            key={page}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.9, x: page === 0 ? -20 : 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: page === 0 ? 20 : -20 }}
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
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === page ? 'bg-white' : 'bg-white/30'
            }`}
            layout
          />
        ))}
      </div>

      {/* Dock */}
      <motion.div
        className="mx-4 mb-2 p-3 bg-white/20 backdrop-blur-xl rounded-[2rem] flex justify-around items-center border border-white/20 shadow-xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        {dockApps.map((app, i) => (
          <AppIcon
            key={`dock-${app.id}`}
            app={app}
            onClick={() => onAppLaunch(app)}
            showLabel={false}
            size="lg"
            delay={0.5 + i * 0.1}
          />
        ))}
      </motion.div>
    </div>
  );
};

interface AppIconProps {
  app: AppDefinition;
  onClick: () => void;
  showLabel?: boolean;
  size?: 'md' | 'lg';
  delay?: number;
}

const AppIcon: React.FC<AppIconProps> = ({
  app,
  onClick,
  showLabel = true,
  size = 'md',
  delay = 0,
}) => {
  const IconComponent = React.useMemo(() => getIconComponent(app.icon), [app.icon]);

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay,
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.85 }}
        onClick={onClick}
        className={`
          flex items-center justify-center rounded-2xl shadow-lg relative overflow-hidden
          ${size === 'lg' ? 'w-[56px] h-[56px]' : 'w-[52px] h-[52px]'}
          bg-gradient-to-br from-${app.accentColor}-400 to-${app.accentColor}-600 text-white
        `}
        style={{
          background: `linear-gradient(135deg, var(--color-${app.accentColor}-400), var(--color-${app.accentColor}-600))`,
        }}
      >
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

        {React.createElement(IconComponent, {
          size: size === 'lg' ? 28 : 24,
          className: 'text-white drop-shadow-md',
        })}
      </motion.button>
      {showLabel && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="text-xs font-medium text-white drop-shadow-md text-center leading-tight px-1 truncate w-full"
        >
          {app.name}
        </motion.span>
      )}
    </div>
  );
};
