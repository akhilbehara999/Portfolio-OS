import React, { useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import {
  LuWifi,
  LuBluetooth,
  LuMoon,
  LuSun,
  LuVolume2,
  LuLock,
  LuMusic,
  LuBatteryFull,
} from 'react-icons/lu';
import { useThemeStore } from '../../store/theme.store';
import { useOSStore } from '../../store/os.store';

interface NotificationShadeProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickTile = ({ icon: Icon, label, active, onClick, color }: any) => {
  const activeColor = color || 'bg-blue-500';
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group w-full">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${active ? activeColor : 'bg-white/10 group-hover:bg-white/20'}`}
      >
        <Icon className={`w-6 h-6 ${active ? 'text-white' : 'text-white/80'}`} />
      </div>
      <span className="text-xs font-medium text-center w-full truncate">{label}</span>
    </button>
  );
};

const NotificationItem = ({ app, title, time, content }: any) => (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-1 active:scale-[0.98] transition-transform w-full">
    <div className="flex justify-between items-center text-xs opacity-60">
      <span className="font-semibold">{app}</span>
      <span>{time}</span>
    </div>
    <div className="font-medium text-sm">{title}</div>
    <div className="text-xs opacity-80 line-clamp-2">{content}</div>
  </div>
);

export const NotificationShade: React.FC<NotificationShadeProps> = ({ isOpen, onClose }) => {
  const { toggleDarkMode, isDarkMode } = useThemeStore();
  const { isLocked, lock } = useOSStore();

  // Quick Settings State
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(50);

  // Drag logic
  const y = useMotionValue(0);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-md text-white flex flex-col pointer-events-auto"
      initial={{ y: '-100%' }}
      animate={{ y: isOpen ? '0%' : '-100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ bottom: 0.2 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -100 || info.velocity.y < -500) {
          onClose();
        }
      }}
      style={{ y }}
    >
      {/* Header */}
      <div className="pt-12 px-6 pb-4 flex justify-between items-end">
        <div className="text-4xl font-light">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="flex gap-4 text-sm font-medium opacity-80">
          <span>
            {new Date().toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1">
            <LuBatteryFull className="inline" /> 100%
          </span>
        </div>
      </div>

      {/* Quick Settings Grid */}
      <div className="px-6 grid grid-cols-4 gap-4 mb-6 place-items-center">
        <QuickTile icon={LuWifi} label="Wi-Fi" active={wifi} onClick={() => setWifi(!wifi)} />
        <QuickTile
          icon={LuBluetooth}
          label="Bluetooth"
          active={bluetooth}
          onClick={() => setBluetooth(!bluetooth)}
        />
        <QuickTile
          icon={isDarkMode ? LuMoon : LuSun}
          label="Theme"
          active={true}
          onClick={toggleDarkMode}
          color={isDarkMode ? 'bg-indigo-500' : 'bg-orange-400'}
        />
        <QuickTile icon={LuLock} label="Lock" active={isLocked} onClick={lock} color="bg-red-500" />
      </div>

      {/* Sliders */}
      <div className="px-6 mb-6 flex flex-col gap-4">
        <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
          <LuSun className="w-5 h-5 opacity-60" />
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value))}
            className="flex-1 accent-white h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
          />
        </div>
        <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3">
          <LuVolume2 className="w-5 h-5 opacity-60" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="flex-1 accent-white h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Music Widget */}
      <div className="mx-6 mb-6 bg-white/10 rounded-3xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <LuMusic className="w-6 h-6" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="font-medium truncate">Building the future</div>
          <div className="text-xs opacity-60 truncate">One commit at a time</div>
        </div>
        <button className="p-2 hover:bg-white/20 rounded-full">
          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
        </button>
      </div>

      {/* Notifications */}
      <div className="flex-1 overflow-y-auto px-6 pb-10">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-sm font-semibold uppercase tracking-wider opacity-60">
            Notifications
          </span>
          {/* Clear all button could go here */}
        </div>
        <div className="flex flex-col gap-3">
          <NotificationItem
            app="Mail"
            title="New Message"
            time="2m ago"
            content="Hey, are we still on for the meeting tomorrow?"
          />
          <NotificationItem
            app="Calendar"
            title="Meeting Reminder"
            time="15m ago"
            content="Team Sync in 30 minutes."
          />
          <NotificationItem
            app="System"
            title="Update Available"
            time="1h ago"
            content="Portfolio OS v2.0 is ready to install."
          />
        </div>
      </div>

      {/* Bottom handle to close */}
      <div
        className="w-full flex justify-center py-4 absolute bottom-0 bg-gradient-to-t from-black/50 to-transparent"
        onClick={onClose}
      >
        <div className="w-12 h-1.5 bg-white/30 rounded-full" />
      </div>
    </motion.div>
  );
};
