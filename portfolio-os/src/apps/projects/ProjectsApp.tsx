import React, { useState, useMemo } from 'react';
import { PORTFOLIO_DATA } from '@config/portfolio-data';
import {
  LuSearch,
  LuExternalLink,
  LuGithub,
  LuLayout,
  LuGrid,
  LuList,
  LuArrowLeft,
  LuLayers,
  LuCode,
  LuTag
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectsApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  const categories = ['All', 'Featured', ...Array.from(new Set(PORTFOLIO_DATA.projects.map(p => p.category)))];

  const filteredProjects = useMemo(() => {
    return PORTFOLIO_DATA.projects.filter(project => {
      const matchesCategory = activeCategory === 'All'
        ? true
        : activeCategory === 'Featured'
          ? project.featured
          : project.category === activeCategory;
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            project.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Detail View
  if (selectedProjectIndex !== null) {
    const project = PORTFOLIO_DATA.projects[selectedProjectIndex];
    const relatedProjects = PORTFOLIO_DATA.projects
      .filter((p, i) => i !== selectedProjectIndex && p.category === project.category)
      .slice(0, 2);

    return (
      <div className="h-full w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10 flex items-center gap-4">
          <button
            onClick={() => setSelectedProjectIndex(null)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LuArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold truncate">{project.title}</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="p-6 max-w-4xl mx-auto space-y-8"
        >
          {/* Hero Image / Placeholder */}
          <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 relative shadow-lg">
             {project.image ? (
               <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold opacity-30">
                 {project.title.substring(0, 2).toUpperCase()}
               </div>
             )}
             {project.featured && (
               <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                 Featured
               </div>
             )}
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {project.longDescription}
              </p>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <LuLayers className="text-blue-500" /> Key Features
                </h3>
                <ul className="space-y-2">
                   {/* Mock features if not in data schema, or parse description */}
                   <li className="flex items-start gap-2">
                     <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                     <span>Innovative architecture using modern frameworks</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                     <span>Optimized performance and responsiveness</span>
                   </li>
                   <li className="flex items-start gap-2">
                     <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                     <span>User-centric design implementation</span>
                   </li>
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-500">Links</h3>
                <div className="flex flex-col gap-3">
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
                      <LuExternalLink size={18} /> Live Demo
                    </a>
                  )}
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors font-medium">
                      <LuGithub size={18} /> Source Code
                    </a>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-slate-500">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm border border-slate-200 dark:border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                 <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-slate-500">Category</h3>
                 <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full text-sm">
                   <LuTag size={14} /> {project.category}
                 </span>
              </div>
            </div>
          </div>

          {relatedProjects.length > 0 && (
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
               <h3 className="text-xl font-bold mb-6">Related Projects</h3>
               <div className="grid md:grid-cols-2 gap-6">
                 {relatedProjects.map((p) => {
                   // Find index in main list
                   const originalIndex = PORTFOLIO_DATA.projects.findIndex(proj => proj.title === p.title);
                   return (
                     <div
                       key={p.title}
                       onClick={() => setSelectedProjectIndex(originalIndex)}
                       className="cursor-pointer group bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-100 dark:border-slate-700 hover:border-blue-400 transition-all"
                     >
                        <h4 className="font-bold group-hover:text-blue-500 transition-colors">{p.title}</h4>
                        <p className="text-sm text-slate-500 line-clamp-1">{p.description}</p>
                     </div>
                   );
                 })}
               </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Grid/List View
  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 sticky top-0 z-10">
         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              My Projects <span className="text-sm font-normal text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">{PORTFOLIO_DATA.projects.length}</span>
            </h1>

            <div className="flex gap-2 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <LuSearch className="absolute left-3 top-2.5 text-slate-400" size={18} />
                 <input
                   type="text"
                   placeholder="Search projects..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                 />
               </div>

               <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
                 <button
                   onClick={() => setViewMode('grid')}
                   className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'}`}
                 >
                   <LuGrid size={20} />
                 </button>
                 <button
                   onClick={() => setViewMode('list')}
                   className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'text-slate-500'}`}
                 >
                   <LuList size={20} />
                 </button>
               </div>
            </div>
         </div>

         {/* Filters */}
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
         <AnimatePresence mode="popLayout">
           <motion.div
             layout
             className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}
           >
             {filteredProjects.map((project, index) => {
               // Must find original index for selection
               const originalIndex = PORTFOLIO_DATA.projects.findIndex(p => p.title === project.title);

               return (
                 <motion.div
                   layout
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.9 }}
                   transition={{ duration: 0.3 }}
                   key={project.title}
                   className={`group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex ${viewMode === 'list' ? 'flex-row h-48' : 'flex-col'}`}
                   onClick={() => setSelectedProjectIndex(originalIndex)}
                 >
                    {/* Image */}
                    <div className={`relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 ${viewMode === 'list' ? 'w-1/3' : 'h-48'}`}>
                       {project.image ? (
                         <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-400/50">
                           {project.title.substring(0, 2).toUpperCase()}
                         </div>
                       )}
                       {project.featured && (
                         <div className="absolute top-3 right-3 bg-yellow-400/90 backdrop-blur-sm text-yellow-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                           Featured
                         </div>
                       )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                       <h3 className="font-bold text-lg mb-2 group-hover:text-blue-500 transition-colors">{project.title}</h3>
                       <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                         {project.description}
                       </p>

                       {/* Tech Stack Preview */}
                       <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.techStack.slice(0, 4).map(tech => (
                            <span key={tech} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded text-xs border border-slate-200 dark:border-slate-700/50">
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 4 && (
                            <span className="px-2 py-0.5 text-xs text-slate-500">+{project.techStack.length - 4}</span>
                          )}
                       </div>

                       {/* Actions */}
                       <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
                          <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            Details
                          </button>
                          <div className="flex gap-3">
                             {project.githubLink && (
                               <a href={project.githubLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                 <LuGithub size={18} />
                               </a>
                             )}
                             {project.liveLink && (
                               <a href={project.liveLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-slate-400 hover:text-blue-500 transition-colors">
                                 <LuExternalLink size={18} />
                               </a>
                             )}
                          </div>
                       </div>
                    </div>
                 </motion.div>
               );
             })}
           </motion.div>
         </AnimatePresence>

         {filteredProjects.length === 0 && (
           <div className="flex flex-col items-center justify-center h-64 text-slate-400">
             <LuSearch size={48} className="mb-4 opacity-50" />
             <p className="text-lg">No projects found</p>
             <p className="text-sm">Try adjusting your filters or search query</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default ProjectsApp;
