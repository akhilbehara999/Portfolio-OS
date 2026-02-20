import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useContextMenu, ContextMenuItem } from '../../hooks/useContextMenu';
import { LuChevronRight } from 'react-icons/lu';
import { useThemeStore } from '../../store/theme.store';
import * as Icons from 'react-icons/lu'; // Import all icons to dynamically render

interface ContextMenuProps {
  items: ContextMenuItem[];
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  children,
  className = "",
  disabled = false
}) => {
  const {
    isOpen,
    position,
    menuItems,
    openContextMenu,
    closeContextMenu,
    menuRef
  } = useContextMenu();

  const { isDarkMode } = useThemeStore();

  const handleContextMenu = (e: React.MouseEvent) => {
    if (disabled) return;
    openContextMenu(e, items);
  };

  // Helper to render icon dynamically
  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName] || (Icons as any)['Lu' + iconName.charAt(0).toUpperCase() + iconName.slice(1)];
    if (IconComponent) {
      return <IconComponent className="w-4 h-4" />;
    }
    return null;
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  // Render the menu content
  const renderMenu = () => {
    // Use portal to render at body level to avoid overflow issues
    if (typeof document !== 'undefined') {
        return createPortal(
            <AnimatePresence>
                {isOpen && (
                  <motion.div
                    ref={menuRef}
                    className={`fixed z-[9999] min-w-[220px] p-1.5 rounded-lg border shadow-xl backdrop-blur-xl
                      ${isDarkMode
                        ? 'bg-gray-900/90 border-gray-700 text-gray-100'
                        : 'bg-white/90 border-gray-200 text-gray-800'
                      }`}
                    style={{ top: position.y, left: position.x }}
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside (unless item click)
                  >
                    {menuItems.map((item, index) => (
                      <React.Fragment key={index}>
                        {item.separator ? (
                          <div className={`my-1 h-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        ) : (
                          <motion.div
                            variants={itemVariants}
                            // Using motion.div for container, but inner button handles click
                          >
                            <button
                              disabled={item.disabled}
                              onClick={(e) => {
                                 e.stopPropagation();
                                 if (item.disabled) return;
                                 item.action();
                                 closeContextMenu();
                              }}
                              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-left group
                                ${item.disabled
                                  ? 'opacity-50 cursor-not-allowed'
                                  : isDarkMode
                                    ? 'hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white'
                                    : 'hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white'
                                }
                              `}
                            >
                              {/* Icon */}
                              {item.icon && <span className="opacity-70 group-hover:opacity-100">{renderIcon(item.icon)}</span>}

                              {/* Label */}
                              <span className="flex-1">{item.label}</span>

                              {/* Shortcut */}
                              {item.shortcut && (
                                <span className="text-xs opacity-50 font-mono group-hover:opacity-80 group-hover:text-white">
                                  {item.shortcut}
                                </span>
                              )}

                              {/* Submenu Indicator */}
                              {item.submenu && <LuChevronRight className="w-4 h-4 opacity-50" />}
                            </button>
                          </motion.div>
                        )}
                      </React.Fragment>
                    ))}
                  </motion.div>
                )}
            </AnimatePresence>,
            document.body
        );
    }
    return null;
  };

  return (
    <>
      <div onContextMenu={handleContextMenu} className={className}>
        {children}
      </div>
      {renderMenu()}
    </>
  );
};
