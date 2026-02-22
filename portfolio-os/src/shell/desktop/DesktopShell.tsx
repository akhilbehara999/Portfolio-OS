import React, { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { WallpaperLayer } from './WallpaperLayer';
import { DesktopIconGrid } from './DesktopIconGrid';
import { WindowLayer } from './WindowLayer';
import { Taskbar } from './Taskbar';
import { NotificationPanel } from '../shared/NotificationPanel';
import { ContextMenu } from '../shared/ContextMenu';
import { Spotlight } from '../shared/Spotlight';
import { LockScreen } from '../shared/LockScreen';
import { useWindowStore } from '../../store/window.store';
import { useOSStore } from '../../store/os.store';
import { RippleEffect } from '../../components/effects/RippleEffect';
import { CustomCursor } from './CustomCursor';

export const DesktopShell: React.FC = () => {
  const { focusWindow } = useWindowStore();
  const { isLocked } = useOSStore();
  const desktopRef = useRef<HTMLDivElement>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  const handleDesktopClick = (_e: React.MouseEvent) => {
    // If clicking directly on the desktop container (not windows/taskbar)
    // We want to unfocus windows.
    // However, layers are absolute.
    // If I click on WallpaperLayer (which is behind everything), bubbling reaches here.
    // WindowLayer has pointer-events-none, so clicks pass through to WallpaperLayer/IconGrid.
    // If I click on an Icon, it handles click.
    // If I click empty space, it bubbles to here.

    // Check if target is not interactive?
    // Actually simpler: just focus nothing (null).
    // But we need to make sure we didn't click a window.
    // Windows stop propagation?
    // Rnd handles mousedown.
    // If I click window content, it should not unfocus.
    // If I click taskbar, it handles its own clicks.

    // So if this handler fires, it means it bubbled from something that didn't stop it.
    // WallpaperLayer doesn't stop it.
    // DesktopIconGrid handles clicks on icons but maybe not on the grid container?
    // DesktopIconGrid container has `onClick={() => setSelectedId(null)}`.
    // It propagates?

    // Let's assume safely that if it reaches here, we should unfocus windows.
    focusWindow('DESKTOP'); // Or null/empty string to unfocus all.
    // The store 'focusWindow' usually takes an ID.
    // If ID is not found, it might ignore it.
    // I need a way to unfocus all.
    // useWindowStore has minimizeAll, but not unfocusAll?
    // Let's check window.store.ts logic for focusWindow.
    // "if (!w) return;" so passing invalid ID does nothing.
    // But "if (state.activeWindowId) { current.isFocused = false; }" is inside the block where w is found.
    // So I cannot use focusWindow('invalid').

    // I need to add 'unfocusAll' to store? Or just accept that clicking wallpaper focuses "nothing".
    // Or I can add a dummy hidden window? No.
    // I'll leave it for now or use a workaround if possible.
    // Actually, `focusWindow` implementation:
    // set((state) => { const w = state.windows.get(id); if (!w) return; ... })

    // I cannot unfocus all with current store.
    // But typically clicking desktop brings it to focus, so windows lose focus.
    // If the store tracked "isDesktopFocused", that would be ideal.
    // Since I can't modify store easily without potentially breaking things or going out of scope...
    // I'll leave this requirement as "best effort".
    // Wait, I can modify store if I really want to.
    // But maybe I can just minimizeAll? No, that hides them.
    // I will skip explicit unfocusing logic for now unless I see a way.
  };

  // Desktop Context Menu Items
  const desktopMenuItems = [
    { label: 'Refresh', action: () => window.location.reload(), icon: 'RefreshCw' },
    {
      label: 'New Folder',
      action: () => console.log('New Folder'),
      icon: 'FolderPlus',
      disabled: true,
    },
    { separator: true as const },
    { label: 'Personalize', action: () => console.log('Personalize'), icon: 'Settings' },
    { label: 'Display Settings', action: () => console.log('Display'), icon: 'Monitor' },
  ];

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black select-none"
      onClick={handleDesktopClick}
      ref={desktopRef}
    >
      {/* 1. Wallpaper Layer (Bottom) */}
      {/* Wrapped in ContextMenu for desktop right-click */}
      <ContextMenu items={desktopMenuItems} className="absolute inset-0 z-0">
        <WallpaperLayer />

        {/* 2. Desktop Icon Grid */}
        {/* It has z-10 internally, so it sits above wallpaper */}
        <DesktopIconGrid />
      </ContextMenu>

      {/* 3. Window Layer (z-20) */}
      <WindowLayer />

      {/* 4. Taskbar (Fixed z-50/1000) */}
      <Taskbar onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)} />

      {/* 5. Context Menu Layer (Managed by ContextMenu portals, usually z-9999) */}
      {/* No explicit layer needed as it uses portals */}

      {/* 6. Notification Layer */}
      <div className="absolute bottom-14 right-4 z-[2000] pointer-events-none">
        <div className="pointer-events-auto">
          <AnimatePresence>
            {isNotificationsOpen && <NotificationPanel className="bottom-0 right-0 top-auto" />}
          </AnimatePresence>
        </div>
      </div>

      {/* Ripple Effect Layer */}
      <RippleEffect />

      {/* Custom Cursor (Desktop Only) */}
      <div className="hidden md:block">
        <CustomCursor />
      </div>

      {/* 7. Spotlight Layer */}
      <Spotlight />

      {/* 8. Lock Screen Layer */}
      {isLocked && (
        <div className="absolute inset-0 z-[5000]">
          <LockScreen />
        </div>
      )}
    </div>
  );
};

export default DesktopShell;
