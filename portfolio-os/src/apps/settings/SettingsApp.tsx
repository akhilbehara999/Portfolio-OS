import React, { useState } from 'react';
import { useThemeStore } from '@store/theme.store';
import { useOSStore } from '@store/os.store';
import { useSettingsStore } from '@store/settings.store';
import { THEME_PRESETS } from '@config/theme-presets';
import { WALLPAPERS } from '@config/wallpapers';
import { APP_REGISTRY } from '@config/app-registry';
import {
  LuMonitor,
  LuSmartphone,
  LuPalette,
  LuZap,
  LuInfo,
  LuKeyboard,
  LuLayoutGrid,
  LuMoon,
  LuSun,
  LuRotateCcw,
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

type SettingsTab = 'appearance' | 'animations' | 'desktop' | 'mobile' | 'about' | 'shortcuts';

const SettingsApp: React.FC = () => {
  const { deviceMode, uptime } = useOSStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');

  const isMobile = deviceMode === 'mobile';

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: LuPalette },
    { id: 'animations', label: 'Animations', icon: LuZap },
    { id: 'desktop', label: 'Desktop', icon: LuMonitor, hidden: isMobile },
    { id: 'mobile', label: 'Mobile', icon: LuSmartphone, hidden: !isMobile },
    { id: 'shortcuts', label: 'Shortcuts', icon: LuKeyboard },
    { id: 'about', label: 'About', icon: LuInfo },
  ];

  return (
    <div className="flex h-full w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden">
      {/* Sidebar / Navigation */}
      <div
        className={`${isMobile ? 'w-16' : 'w-64'} flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col`}
      >
        <div className="p-4 font-bold text-xl hidden md:block">Settings</div>
        <nav className="flex-1 overflow-y-auto py-2">
          {tabs
            .filter((t) => !t.hidden)
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={`w-full flex items-center px-4 py-3 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-2 border-blue-500'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <tab.icon size={20} className={isMobile ? 'mx-auto' : 'mr-3'} />
                <span className={isMobile ? 'hidden' : 'block'}>{tab.label}</span>
              </button>
            ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 capitalize">{activeTab}</h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'appearance' && <AppearanceSettings />}
              {activeTab === 'animations' && <AnimationSettings />}
              {activeTab === 'desktop' && <DesktopSettings />}
              {activeTab === 'mobile' && <MobileSettings />}
              {activeTab === 'shortcuts' && <ShortcutsSettings />}
              {activeTab === 'about' && <AboutSettings uptime={uptime} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const AppearanceSettings: React.FC = () => {
  const {
    currentTheme,
    setTheme,
    currentWallpaper,
    setWallpaper,
    isDarkMode,
    toggleDarkMode,
    accentColor,
    setAccentColor,
    transparency,
    setTransparency,
    fontScale,
    setFontScale,
  } = useThemeStore();

  const colors = [
    '#3b82f6',
    '#ef4444',
    '#10b981',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
    '#06b6d4',
    '#64748b',
  ];

  return (
    <div className="space-y-8">
      {/* Theme Presets */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Theme Presets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setTheme(preset.id)}
              className={`relative overflow-hidden rounded-xl border-2 transition-all text-left group ${
                currentTheme.id === preset.id
                  ? 'border-blue-500 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
            >
              <div className="h-20 w-full" style={{ background: preset.colors.background }}>
                <div className="h-full w-full flex items-center justify-center space-x-2 opacity-50">
                  <div
                    className="w-8 h-8 rounded-lg shadow-sm"
                    style={{ background: preset.colors.surface }}
                  />
                  <div
                    className="w-8 h-8 rounded-full shadow-sm"
                    style={{ background: preset.colors.accent }}
                  />
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800">
                <div className="font-medium text-sm">{preset.name}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Dark/Light Mode */}
      <section className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div>
          <h3 className="font-semibold">Color Mode</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Switch between light and dark appearance
          </p>
        </div>
        <button
          onClick={toggleDarkMode}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          {isDarkMode ? <LuMoon size={18} /> : <LuSun size={18} />}
          <span>{isDarkMode ? 'Dark' : 'Light'}</span>
        </button>
      </section>

      {/* Accent Color */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Accent Color</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setAccentColor(color)}
              className={`w-10 h-10 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${
                accentColor === color
                  ? 'ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 ring-blue-500'
                  : ''
              }`}
              style={{ backgroundColor: color }}
            >
              {accentColor === color && <div className="w-2 h-2 bg-white rounded-full" />}
            </button>
          ))}
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer"
          />
        </div>
      </section>

      {/* Wallpapers */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Wallpaper</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {WALLPAPERS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => setWallpaper(wp.id)}
              className={`aspect-video rounded-lg overflow-hidden border-2 transition-all relative group ${
                currentWallpaper.id === wp.id
                  ? 'border-blue-500'
                  : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  background:
                    wp.type === 'static' || wp.type === 'gradient'
                      ? wp.source
                      : `url(${wp.thumbnail})`, // Fallback/Thumbnail logic ideally
                  backgroundColor: '#333',
                }}
              >
                {/* For SVG data URIs, we can use img */}
                <img src={wp.source} alt={wp.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/40 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">{wp.name}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Sliders */}
      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Transparency</h3>
            <span className="text-sm text-slate-500">{Math.round(transparency * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={transparency}
            onChange={(e) => setTransparency(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Font Scale</h3>
            <span className="text-sm text-slate-500">{Math.round(fontScale * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.8"
            max="1.2"
            step="0.05"
            value={fontScale}
            onChange={(e) => setFontScale(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </section>
    </div>
  );
};

const AnimationSettings: React.FC = () => {
  const { animationSpeed, setAnimationSpeed } = useThemeStore();
  const {
    enableWindowAnimations,
    setWindowAnimations,
    enableHoverEffects,
    setHoverEffects,
    resetDefaults,
  } = useSettingsStore();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Animation Preferences</h3>
        <button
          onClick={() => {
            setAnimationSpeed(1);
            resetDefaults('animations');
          }}
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          <LuRotateCcw size={14} className="mr-1" /> Reset
        </button>
      </div>

      <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium">Animation Speed</label>
            <span className="text-sm text-slate-500">{animationSpeed}x</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.25"
            value={animationSpeed}
            onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Off (0x)</span>
            <span>Normal (1x)</span>
            <span>Fast (2x)</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Window Animations</div>
            <div className="text-sm text-slate-500">Animate windows when opening and closing</div>
          </div>
          <Switch checked={enableWindowAnimations} onChange={setWindowAnimations} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Hover Effects</div>
            <div className="text-sm text-slate-500">Enable visual feedback on hover</div>
          </div>
          <Switch checked={enableHoverEffects} onChange={setHoverEffects} />
        </div>
      </section>

      {/* Preview Box */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Preview</h3>
        <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden relative">
          <motion.div
            className="w-20 h-20 bg-blue-500 rounded-lg shadow-lg"
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
              borderRadius: ['20%', '50%', '20%'],
            }}
            transition={{
              duration: animationSpeed > 0 ? 2 / animationSpeed : 0,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={enableHoverEffects ? { scale: 1.1, backgroundColor: '#60a5fa' } : {}}
          />
          <div className="absolute bottom-2 text-xs text-slate-400">
            Animation Speed: {animationSpeed}x
          </div>
        </div>
      </section>
    </div>
  );
};

const DesktopSettings: React.FC = () => {
  const {
    taskbarPosition,
    setTaskbarPosition,
    iconSize,
    setIconSize,
    showDesktopIcons,
    setShowDesktopIcons,
    enableWindowSnap,
    setWindowSnap,
    resetDefaults,
  } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Desktop Configuration</h3>
        <button
          onClick={() => resetDefaults('desktop')}
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          <LuRotateCcw size={14} className="mr-1" /> Reset
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div>
          <label className="block font-medium mb-2">Taskbar Position</label>
          <div className="grid grid-cols-4 gap-2">
            {(['bottom', 'top', 'left', 'right'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => setTaskbarPosition(pos)}
                disabled={pos !== 'bottom'} // Future support
                className={`px-4 py-2 rounded-lg border text-sm capitalize ${
                  taskbarPosition === pos
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 opacity-50 cursor-not-allowed'
                } ${pos === 'bottom' ? '!opacity-100 !cursor-pointer' : ''}`}
              >
                {pos}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Currently only &apos;bottom&apos; is supported.
          </p>
        </div>

        <div>
          <label className="block font-medium mb-2">Icon Size</label>
          <div className="flex space-x-4">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <label key={size} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="iconSize"
                  checked={iconSize === size}
                  onChange={() => setIconSize(size)}
                  className="text-blue-500 focus:ring-blue-500"
                />
                <span className="capitalize">{size}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div>
            <div className="font-medium">Show Desktop Icons</div>
            <div className="text-sm text-slate-500">Toggle visibility of icons on the desktop</div>
          </div>
          <Switch checked={showDesktopIcons} onChange={setShowDesktopIcons} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Window Snapping</div>
            <div className="text-sm text-slate-500">Snap windows to screen edges</div>
          </div>
          <Switch checked={enableWindowSnap} onChange={setWindowSnap} />
        </div>
      </div>
    </div>
  );
};

const MobileSettings: React.FC = () => {
  const {
    mobileGridDensity,
    setMobileGridDensity,
    appDrawerStyle,
    setAppDrawerStyle,
    gestureSensitivity,
    setGestureSensitivity,
    resetDefaults,
  } = useSettingsStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Mobile Experience</h3>
        <button
          onClick={() => resetDefaults('mobile')}
          className="text-sm text-blue-500 hover:underline flex items-center"
        >
          <LuRotateCcw size={14} className="mr-1" /> Reset
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div>
          <label className="block font-medium mb-2">Home Screen Grid</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setMobileGridDensity('comfortable')}
              className={`p-3 rounded-lg border text-left ${mobileGridDensity === 'comfortable' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}
            >
              <div className="font-medium">Comfortable</div>
              <div className="text-xs text-slate-500">4 columns</div>
            </button>
            <button
              onClick={() => setMobileGridDensity('compact')}
              className={`p-3 rounded-lg border text-left ${mobileGridDensity === 'compact' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}
            >
              <div className="font-medium">Compact</div>
              <div className="text-xs text-slate-500">5 columns</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">App Drawer Style</label>
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setAppDrawerStyle('grid')}
              className={`flex-1 py-1 text-sm rounded-md transition-all ${appDrawerStyle === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm font-medium' : 'text-slate-500'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setAppDrawerStyle('list')}
              className={`flex-1 py-1 text-sm rounded-md transition-all ${appDrawerStyle === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm font-medium' : 'text-slate-500'}`}
            >
              List
            </button>
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">Gesture Sensitivity</label>
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={gestureSensitivity === 'low' ? 0 : gestureSensitivity === 'medium' ? 1 : 2}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setGestureSensitivity(val === 0 ? 'low' : val === 1 ? 'medium' : 'high');
            }}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Low</span>
            <span>Medium</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShortcutsSettings: React.FC = () => {
  // We can group shortcuts by category manually or from APP_REGISTRY
  const systemShortcuts = [
    { keys: ['Alt', 'F4'], description: 'Close active window' },
    { keys: ['Win', 'D'], description: 'Show desktop' },
    { keys: ['Alt', 'Tab'], description: 'Switch windows' },
  ];

  const appShortcuts = APP_REGISTRY.filter((app) => app.shortcut).map((app) => ({
    keys: app.shortcut!.split('+'),
    description: `Launch ${app.name}`,
  }));

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-3">Keys</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {[...systemShortcuts, ...appShortcuts].map((s, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-3">
                  <div className="flex gap-1">
                    {s.keys.map((k, j) => (
                      <kbd
                        key={j}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-xs font-sans text-slate-600 dark:text-slate-300 shadow-sm"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {s.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AboutSettings: React.FC<{ uptime: number }> = ({ uptime }) => {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-8 text-center max-w-lg mx-auto pt-8">
      <div className="flex justify-center">
        <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
          <LuLayoutGrid className="text-white w-12 h-12" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">PortfolioOS</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">v1.0.0</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-left space-y-4">
        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
          <span className="text-slate-500">Developer</span>
          <span className="font-medium">Jules The Agent</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
          <span className="text-slate-500">Built With</span>
          <span className="font-medium text-right">React, TypeScript, Tailwind, Zustand</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
          <span className="text-slate-500">System Uptime</span>
          <span className="font-medium font-mono">{formatUptime(uptime)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-slate-500">Source</span>
          <a
            href="https://github.com/jules/portfolio-os"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="text-xs text-slate-400">© 2024 PortfolioOS. All rights reserved.</div>
    </div>
  );
};

const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({
  checked,
  onChange,
}) => (
  <button
    onClick={() => onChange(!checked)}
    className={`w-12 h-6 rounded-full transition-colors relative ${
      checked ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
    }`}
  >
    <div
      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${
        checked ? 'left-7' : 'left-1'
      }`}
    />
  </button>
);

export default SettingsApp;
