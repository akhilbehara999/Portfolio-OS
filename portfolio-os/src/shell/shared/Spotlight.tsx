import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/app.store';
import { APP_REGISTRY } from '../../config/app-registry';
import { useThemeStore } from '../../store/theme.store';
import { useOSStore } from '../../store/os.store';
import { LuSearch, LuCommand, LuArrowRight } from 'react-icons/lu';
import * as Icons from 'react-icons/lu';

interface SearchResult {
  id: string;
  type: 'app' | 'file' | 'action' | 'setting';
  title: string;
  description?: string;
  icon?: string;
  action: () => void;
  shortcut?: string;
}

export const Spotlight: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { launchApp } = useAppStore();
  const { isDarkMode } = useThemeStore();
  const { lock } = useOSStore(); // boot used for restart/shutdown simulation

  // Mock Files and Actions
  const mockFiles = [
    { id: 'resume.pdf', title: 'Resume.pdf', description: 'Documents', type: 'file' as const },
    { id: 'project-specs.docx', title: 'Project Specs.docx', description: 'Work', type: 'file' as const },
    { id: 'budget.xlsx', title: 'Budget 2024.xlsx', description: 'Finance', type: 'file' as const },
  ];

  const actions = [
    {
      id: 'lock',
      title: 'Lock Screen',
      description: 'System',
      type: 'action' as const,
      icon: 'Lock',
      action: () => lock()
    },
    {
        id: 'reload',
        title: 'Reload System',
        description: 'System',
        type: 'action' as const,
        icon: 'RefreshCw',
        action: () => window.location.reload()
    },
  ];

  // Filter Results
  const results: SearchResult[] = useMemo(() => {
    if (!query) return [];

    const lowerQuery = query.toLowerCase();

    const appResults = APP_REGISTRY
      .filter(app =>
        app.name.toLowerCase().includes(lowerQuery) ||
        app.description.toLowerCase().includes(lowerQuery)
      )
      .map(app => ({
        id: app.id,
        type: 'app' as const,
        title: app.name,
        description: app.description,
        icon: app.icon,
        action: () => launchApp(app.id),
        shortcut: app.shortcut
      }));

    const fileResults = mockFiles
      .filter(file => file.title.toLowerCase().includes(lowerQuery))
      .map(file => ({
        ...file,
        action: () => { /* Open file logic */ },
        icon: 'FileText'
      }));

    const actionResults = actions
      .filter(action => action.title.toLowerCase().includes(lowerQuery))
      .map(action => ({
        ...action,
        shortcut: undefined
      }));

    return [...appResults, ...actionResults, ...fileResults].slice(0, 8);
  }, [query, launchApp, lock]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          results[selectedIndex].action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Reset selection on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Auto focus input
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Helper to render icon
  const renderIcon = (iconName?: string) => {
    if (!iconName) return <LuCommand className="w-5 h-5" />;

    // Convert common names if needed or use direct mapping
    const IconComponent = (Icons as any)[iconName] ||
                          (Icons as any)['Lu' + iconName.charAt(0).toUpperCase() + iconName.slice(1)];

    if (IconComponent) return <IconComponent className="w-5 h-5" />;
    return <LuCommand className="w-5 h-5" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            className={`fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden z-[9999] border
              ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
            `}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search Bar */}
            <div className={`flex items-center px-4 py-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <LuSearch className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search apps, files, and commands..."
                className={`flex-1 ml-3 bg-transparent text-lg outline-none placeholder:text-opacity-50
                   ${isDarkMode ? 'text-white placeholder:text-gray-400' : 'text-gray-900 placeholder:text-gray-500'}
                `}
              />
              <div className="flex items-center gap-1">
                 <kbd className={`hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono
                    ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}
                 `}>
                    <span className="text-xs">ESC</span>
                 </kbd>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto" ref={listRef}>
              {results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      className={`flex items-center px-4 py-3 mx-2 rounded-lg cursor-pointer transition-colors
                        ${index === selectedIndex
                          ? (isDarkMode ? 'bg-blue-600/20' : 'bg-blue-50')
                          : 'hover:bg-opacity-50'
                        }
                        ${index === selectedIndex && isDarkMode ? 'bg-blue-600 text-white' : ''}
                        ${index === selectedIndex && !isDarkMode ? 'bg-blue-100' : ''}
                      `}
                      onClick={() => {
                        result.action();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-4
                         ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}
                         ${index === selectedIndex ? 'bg-opacity-0' : ''}
                      `}>
                        {renderIcon(result.icon)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}
                              ${index === selectedIndex ? 'text-inherit' : ''}
                           `}>
                              {result.title}
                           </span>
                           <span className={`text-xs px-1.5 py-0.5 rounded-full uppercase
                              ${result.type === 'app' ? 'bg-blue-500/20 text-blue-500' : ''}
                              ${result.type === 'file' ? 'bg-orange-500/20 text-orange-500' : ''}
                              ${result.type === 'action' ? 'bg-red-500/20 text-red-500' : ''}
                              ${index === selectedIndex ? 'bg-opacity-20 text-current' : ''}
                           `}>
                              {result.type}
                           </span>
                        </div>
                        {result.description && (
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                             ${index === selectedIndex ? 'text-inherit opacity-80' : ''}
                          `}>
                            {result.description}
                          </div>
                        )}
                      </div>

                      {result.shortcut && (
                         <div className={`text-xs font-mono opacity-50
                            ${index === selectedIndex ? 'opacity-80' : ''}
                         `}>
                            {result.shortcut}
                         </div>
                      )}

                      {index === selectedIndex && (
                        <LuArrowRight className="w-4 h-4 ml-2 opacity-50" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                 <div className={`flex flex-col items-center justify-center py-12 text-center opacity-50`}>
                    {query ? (
                       <>
                          <LuSearch className="w-12 h-12 mb-4" />
                          <p>No results found for "{query}"</p>
                       </>
                    ) : (
                       <>
                          <LuCommand className="w-12 h-12 mb-4" />
                          <p>Type to search...</p>
                       </>
                    )}
                 </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-between px-4 py-2 text-xs border-t
               ${isDarkMode ? 'bg-gray-800/50 border-gray-800 text-gray-500' : 'bg-gray-50 border-gray-100 text-gray-400'}
            `}>
                <div className="flex gap-4">
                   <span>Select <kbd className="font-mono">↑↓</kbd></span>
                   <span>Open <kbd className="font-mono">↵</kbd></span>
                </div>
                <div>
                   PortfolioOS Spotlight
                </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
