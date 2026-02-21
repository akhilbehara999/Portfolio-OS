import React, { useState, useEffect, useMemo } from 'react';
import { virtualFs } from '@core/file-system/virtual-fs';
import { useAppStore } from '@store/app.store';
import {
  LuFolder,
  LuFile,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUp,
  LuSearch,
  LuGrid,
  LuList,
  LuHome,
  LuMonitor,
  LuImage,
  LuFileText,
  LuDownload,
  LuBriefcase
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'grid' | 'list';

const FileExplorerApp: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [history, setHistory] = useState<string[]>(['/home/user']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { launchApp } = useAppStore();

  const currentNode = useMemo(() => virtualFs.getNodeByPath(currentPath), [currentPath]);

  const files = useMemo(() => {
    if (!currentNode || currentNode.type !== 'folder') return [];

    let items = virtualFs.listDirectory(currentNode.id);

    if (searchQuery) {
       // Simple search in current directory
       items = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return items;
  }, [currentNode, searchQuery]);

  const navigateTo = (path: string) => {
    if (path === currentPath) return;

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
    setSearchQuery('');
    setSelectedId(null);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const goUp = () => {
    if (currentPath === '/') return;
    const parentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
    navigateTo(parentPath);
  };

  const handleItemClick = (item: any) => {
    setSelectedId(item.id);
  };

  const handleItemDoubleClick = (item: any) => {
    if (item.type === 'folder') {
      navigateTo(item.path);
    } else {
      openFile(item);
    }
  };

  const openFile = (file: any) => {
    // Determine app to open based on extension/type
    if (file.name === 'Resume.pdf') {
      launchApp('resume');
    } else if (file.path.includes('Projects') && file.type === 'folder') {
       // Folders in Projects might be opened as projects?
       // But here we are navigating inside.
       // If it's a file inside a project folder
    } else if (file.fileType === 'IMAGE' || file.name.endsWith('.png') || file.name.endsWith('.jpg')) {
       launchApp('gallery'); // Assuming gallery handles opening generic or we need to pass props
    } else {
       // Default fallback? Maybe text editor if we had one.
       // For now, assume most files are just placeholders or specific ones.
    }
  };

  const getIcon = (item: any) => {
    if (item.type === 'folder') {
      if (item.name === 'Desktop') return <LuMonitor className="text-blue-500" size={viewMode === 'grid' ? 48 : 20} />;
      if (item.name === 'Documents') return <LuFolder className="text-yellow-500" size={viewMode === 'grid' ? 48 : 20} />;
      if (item.name === 'Pictures') return <LuImage className="text-purple-500" size={viewMode === 'grid' ? 48 : 20} />;
      if (item.name === 'Projects') return <LuBriefcase className="text-green-500" size={viewMode === 'grid' ? 48 : 20} />;
      if (item.name === 'Downloads') return <LuDownload className="text-blue-400" size={viewMode === 'grid' ? 48 : 20} />;
      return <LuFolder className="text-blue-400" size={viewMode === 'grid' ? 48 : 20} />;
    }

    if (item.name.endsWith('.pdf')) return <LuFileText className="text-red-500" size={viewMode === 'grid' ? 40 : 20} />;
    if (item.name.endsWith('.md')) return <LuFileText className="text-slate-500" size={viewMode === 'grid' ? 40 : 20} />;
    if (item.name.endsWith('.png') || item.name.endsWith('.jpg')) return <LuImage className="text-purple-500" size={viewMode === 'grid' ? 40 : 20} />;

    return <LuFile className="text-gray-400" size={viewMode === 'grid' ? 40 : 20} />;
  };

  const quickAccess = [
    { name: 'Home', path: '/home/user', icon: LuHome },
    { name: 'Desktop', path: '/home/user/Desktop', icon: LuMonitor },
    { name: 'Documents', path: '/home/user/Documents', icon: LuFolder },
    { name: 'Projects', path: '/home/user/Projects', icon: LuBriefcase },
    { name: 'Pictures', path: '/home/user/Pictures', icon: LuImage },
  ];

  const breadcrumbs = currentPath.split('/').filter(Boolean);

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* Toolbar */}
      <div className="flex items-center p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 gap-2">
        <div className="flex gap-1">
          <button
            onClick={goBack}
            disabled={historyIndex === 0}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
          >
            <LuArrowLeft size={18} />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
          >
            <LuArrowRight size={18} />
          </button>
          <button
            onClick={goUp}
            disabled={currentPath === '/'}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
          >
            <LuArrowUp size={18} />
          </button>
        </div>

        {/* Breadcrumbs / Path Bar */}
        <div className="flex-1 flex items-center px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded mx-2 text-sm overflow-hidden">
           <button
             onClick={() => navigateTo('/')}
             className="hover:bg-slate-100 dark:hover:bg-slate-800 px-1 rounded mr-1"
           >
             /
           </button>
           {breadcrumbs.map((part, i) => {
              const path = '/' + breadcrumbs.slice(0, i + 1).join('/');
              return (
                <div key={path} className="flex items-center">
                  <span className="text-slate-400 mx-0.5">/</span>
                  <button
                    onClick={() => navigateTo(path)}
                    className="hover:bg-slate-100 dark:hover:bg-slate-800 px-1 rounded truncate max-w-[100px]"
                  >
                    {part}
                  </button>
                </div>
              );
           })}
        </div>

        {/* Search */}
        <div className="relative w-48 hidden sm:block">
           <LuSearch className="absolute left-2 top-1.5 text-slate-400" size={16} />
           <input
             type="text"
             placeholder="Search"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-8 pr-2 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:border-blue-500 transition-colors"
           />
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-200 dark:bg-slate-800 rounded p-0.5">
           <button
             onClick={() => setViewMode('grid')}
             className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
           >
             <LuGrid size={16} />
           </button>
           <button
             onClick={() => setViewMode('list')}
             className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
           >
             <LuList size={16} />
           </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hidden md:flex flex-col py-2">
           <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Access</div>
           {quickAccess.map((item) => (
             <button
               key={item.path}
               onClick={() => navigateTo(item.path)}
               className={`flex items-center px-4 py-2 text-sm transition-colors ${
                 currentPath === item.path
                   ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                   : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
               }`}
             >
               <item.icon size={18} className="mr-3 text-slate-500" />
               {item.name}
             </button>
           ))}
        </div>

        {/* Main Content */}
        <div
           className="flex-1 overflow-y-auto p-4"
           onClick={() => setSelectedId(null)}
        >
           {files.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <LuFolder size={48} className="mb-2 opacity-50" />
               <p>This folder is empty</p>
             </div>
           ) : (
             <>
               {viewMode === 'grid' ? (
                 <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                   {files.map((file) => (
                     <motion.div
                       key={file.id}
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className={`flex flex-col items-center p-2 rounded-lg cursor-pointer border transition-colors ${
                         selectedId === file.id
                           ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
                           : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
                       }`}
                       onClick={(e) => { e.stopPropagation(); handleItemClick(file); }}
                       onDoubleClick={(e) => { e.stopPropagation(); handleItemDoubleClick(file); }}
                     >
                       <div className="mb-2">
                         {getIcon(file)}
                       </div>
                       <span className="text-sm text-center line-clamp-2 w-full break-words">
                         {file.name}
                       </span>
                     </motion.div>
                   ))}
                 </div>
               ) : (
                 <div className="min-w-full">
                    <div className="grid grid-cols-[auto_1fr_100px] gap-4 px-4 py-2 text-xs font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                       <div className="w-6"></div>
                       <div>Name</div>
                       <div>Size</div>
                    </div>
                    {files.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`grid grid-cols-[auto_1fr_100px] gap-4 px-4 py-2 items-center cursor-pointer border-b border-slate-100 dark:border-slate-800/50 ${
                          selectedId === file.id
                            ? 'bg-blue-100 dark:bg-blue-900/30'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }`}
                        onClick={(e) => { e.stopPropagation(); handleItemClick(file); }}
                        onDoubleClick={(e) => { e.stopPropagation(); handleItemDoubleClick(file); }}
                      >
                         <div>{getIcon(file)}</div>
                         <div className="font-medium text-sm">{file.name}</div>
                         <div className="text-xs text-slate-500">{file.size > 0 ? `${Math.ceil(file.size / 1024)} KB` : '--'}</div>
                      </motion.div>
                    ))}
                 </div>
               )}
             </>
           )}
        </div>
      </div>

      {/* Footer / Status Bar */}
      <div className="px-4 py-1 text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between">
         <span>{files.length} items</span>
         <span>{currentPath}</span>
      </div>
    </div>
  );
};

export default FileExplorerApp;
