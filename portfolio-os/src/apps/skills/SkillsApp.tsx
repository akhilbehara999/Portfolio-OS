import React, { useState, useMemo } from 'react';
import { PORTFOLIO_DATA } from '@config/portfolio-data';
import {
  LuSearch,
  LuCode,
  LuBarChart,
  LuDatabase,
  LuServer,
  LuLayout,
  LuGrid,
  LuList
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const SkillsApp: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', ...Array.from(new Set(PORTFOLIO_DATA.skills.map(s => s.category)))];

  const filteredSkills = useMemo(() => {
    return PORTFOLIO_DATA.skills.filter(skill => {
      const matchesCategory = activeCategory === 'All' || skill.category === activeCategory;
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const topCategory = useMemo(() => {
    const counts = PORTFOLIO_DATA.skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }, []);

  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
          <div className="relative w-full md:w-64">
            <LuSearch className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
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

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}
          >
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors shadow-sm hover:shadow-lg ${
                  viewMode === 'list' ? 'flex items-center gap-6' : ''
                }`}
              >
                <div className={`flex items-center gap-3 mb-3 ${viewMode === 'list' ? 'w-1/3 mb-0' : ''}`}>
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 text-blue-500 dark:text-blue-400`}>
                    {/* Placeholder icon logic - in real app would map strictly */}
                    <LuCode size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">{skill.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{skill.category}</p>
                  </div>
                </div>

                <div className={`w-full ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex justify-between mb-1 text-xs font-medium text-slate-500">
                    <span>Proficiency</span>
                    <span>{skill.proficiency}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.proficiency}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>
                  <div className="mt-2 text-xs text-right text-slate-400 font-mono">
                    {skill.proficiency >= 90 ? 'Expert' :
                     skill.proficiency >= 75 ? 'Advanced' :
                     skill.proficiency >= 50 ? 'Intermediate' : 'Beginner'}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredSkills.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <LuSearch size={48} className="mb-4 opacity-50" />
            <p>No skills found matching "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between text-xs text-slate-500 font-mono">
        <span>Total Skills: {PORTFOLIO_DATA.skills.length}</span>
        <span>Top Category: {topCategory}</span>
      </div>
    </div>
  );
};

export default SkillsApp;
