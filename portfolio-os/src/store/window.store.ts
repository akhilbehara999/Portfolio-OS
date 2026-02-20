import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { WindowState, WindowSize, WindowPosition } from '../types/window.types';
import { APP_REGISTRY } from '@config/app-registry';

interface WindowStoreState {
  windows: Map<string, WindowState>;
  activeWindowId: string | null;
  windowOrder: string[];
  nextZIndex: number;
}

interface WindowStoreActions {
  openWindow: (appId: string, options?: { metadata?: any }) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  moveWindow: (windowId: string, position: WindowPosition) => void;
  resizeWindow: (windowId: string, size: WindowSize) => void;
  snapWindow: (windowId: string, direction: 'left' | 'right' | 'top' | 'maximize') => void;
  minimizeAll: () => void;
  restoreAll: () => void;
  closeAll: () => void;
  getWindowsByApp: (appId: string) => WindowState[];
}

const CASCADE_OFFSET = 30;
const INITIAL_Z_INDEX = 100;

export const useWindowStore = create<WindowStoreState & WindowStoreActions>()(
  persist(
    immer((set, get) => ({
      windows: new Map(),
      activeWindowId: null,
      windowOrder: [],
      nextZIndex: INITIAL_Z_INDEX,

      openWindow: (appId, options) => {
        const app = APP_REGISTRY.find(a => a.id === appId);
        if (!app) return;

        // Check singleton
        if (app.singleton) {
          const existing = Array.from(get().windows.values()).find(w => w.appId === appId);
          if (existing) {
            get().focusWindow(existing.id);
            if (existing.isMinimized) {
              set(state => {
                 const w = state.windows.get(existing.id);
                 if (w) w.isMinimized = false;
              });
            }
            return;
          }
        }

        const id = crypto.randomUUID();
        const zIndex = get().nextZIndex;

        // Calculate position (cascade)
        const count = get().windows.size;
        const offset = count * CASCADE_OFFSET;
        // Default position logic
        const startX = 50;
        const startY = 50;
        const position = {
          x: startX + (offset % 300),
          y: startY + (offset % 200)
        };

        const newWindow: WindowState = {
          id,
          appId,
          title: app.name,
          icon: app.icon,
          position,
          size: app.defaultWindowSize,
          minSize: { width: 300, height: 200 },
          maxSize: undefined,
          isMinimized: false,
          isMaximized: false,
          isFocused: true,
          isResizable: true,
          isDraggable: true,
          zIndex,
          opacity: 1,
          state: 'opening',
          component: app.component,
          metadata: options?.metadata,
        };

        set(state => {
          state.windows.set(id, newWindow);
          state.activeWindowId = id;
          state.windowOrder.push(id);
          state.nextZIndex += 1;
        });

        // Animation delay for opening
        setTimeout(() => {
           set(state => {
             const w = state.windows.get(id);
             if (w) w.state = 'open';
           });
        }, 300);
      },

      closeWindow: (id) => {
        set(state => {
           const w = state.windows.get(id);
           if (w) w.state = 'closing';
        });

        setTimeout(() => {
          set(state => {
            state.windows.delete(id);
            state.windowOrder = state.windowOrder.filter(wId => wId !== id);
            if (state.activeWindowId === id) {
              const last = state.windowOrder[state.windowOrder.length - 1];
              state.activeWindowId = last || null;
              if (last) {
                const w = state.windows.get(last);
                if (w) w.isFocused = true;
              }
            }
          });
        }, 300);
      },

      minimizeWindow: (id) => {
         set(state => {
           const w = state.windows.get(id);
           if (w) {
             w.isMinimized = true;
             w.isFocused = false;
           }
           if (state.activeWindowId === id) {
             state.activeWindowId = null;
           }
         });
      },

      maximizeWindow: (id) => {
        set(state => {
          const w = state.windows.get(id);
          if (w) {
             w.isMaximized = !w.isMaximized;
             if (w.isMaximized) {
               w.isFocused = true;
               state.activeWindowId = id;
               w.zIndex = state.nextZIndex;
               state.nextZIndex++;

               const idx = state.windowOrder.indexOf(id);
               if (idx !== -1) {
                  state.windowOrder.splice(idx, 1);
                  state.windowOrder.push(id);
               }
             }
          }
        });
      },

      focusWindow: (id) => {
        set(state => {
           const w = state.windows.get(id);
           if (!w) return;

           if (state.activeWindowId === id) return;

           if (state.activeWindowId) {
             const current = state.windows.get(state.activeWindowId);
             if (current) current.isFocused = false;
           }

           w.isFocused = true;
           w.isMinimized = false;
           state.activeWindowId = id;

           w.zIndex = state.nextZIndex;
           state.nextZIndex++;

           const idx = state.windowOrder.indexOf(id);
           if (idx !== -1) {
              state.windowOrder.splice(idx, 1);
              state.windowOrder.push(id);
           }
        });
      },

      moveWindow: (id, pos) => {
        set(state => {
           const w = state.windows.get(id);
           if (w && !w.isMaximized) {
             w.position = pos;
           }
        });
      },

      resizeWindow: (id, size) => {
        set(state => {
           const w = state.windows.get(id);
           if (w && !w.isMaximized) {
             w.size = size;
           }
        });
      },

      snapWindow: (id, direction) => {
         if (typeof window === 'undefined') return;

         set(state => {
            const w = state.windows.get(id);
            if (!w) return;

            const screenW = window.innerWidth;
            const screenH = window.innerHeight; // excluding taskbar if possible, but hardcoded here

            if (direction === 'maximize') {
               w.isMaximized = true;
            } else if (direction === 'left') {
               w.isMaximized = false;
               w.position = { x: 0, y: 0 };
               w.size = { width: screenW / 2, height: screenH - 48 };
            } else if (direction === 'right') {
               w.isMaximized = false;
               w.position = { x: screenW / 2, y: 0 };
               w.size = { width: screenW / 2, height: screenH - 48 };
            } else if (direction === 'top') {
               w.isMaximized = true;
            }
         });
      },

      minimizeAll: () => {
         set(state => {
            state.windows.forEach(w => {
               w.isMinimized = true;
               w.isFocused = false;
            });
            state.activeWindowId = null;
         });
      },

      restoreAll: () => {
         set(state => {
            state.windows.forEach(w => {
               w.isMinimized = false;
            });
            if (state.windowOrder.length > 0) {
               const lastId = state.windowOrder[state.windowOrder.length - 1];
               const w = state.windows.get(lastId);
               if (w) {
                  w.isFocused = true;
                  state.activeWindowId = lastId;
               }
            }
         });
      },

      closeAll: () => {
         set(state => {
            state.windows.clear();
            state.windowOrder = [];
            state.activeWindowId = null;
         });
      },

      getWindowsByApp: (appId) => {
         return Array.from(get().windows.values()).filter(w => w.appId === appId);
      },
    })),
    {
      name: 'portfolio-window-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        windows: Array.from(state.windows.entries()).map(([k, v]) => {
           // eslint-disable-next-line @typescript-eslint/no-unused-vars
           const { component, ...rest } = v;
           return [k, rest];
        }),
        windowOrder: state.windowOrder,
        activeWindowId: state.activeWindowId,
        nextZIndex: state.nextZIndex,
      }),
      merge: (persistedState: any, currentState) => {
         if (!persistedState) return currentState;

         const windows = new Map<string, WindowState>();
         if (persistedState.windows && Array.isArray(persistedState.windows)) {
            persistedState.windows.forEach(([id, wState]: [string, any]) => {
               const app = APP_REGISTRY.find(a => a.id === wState.appId);
               if (app) {
                  windows.set(id, {
                     ...wState,
                     component: app.component,
                  });
               }
            });
         }

         return {
            ...currentState,
            ...persistedState,
            windows,
         };
      },
    }
  )
);
