import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuSearch,
  LuLayoutGrid,
  LuList,
  LuCode,
  LuDatabase,
  LuServer,
  LuCpu,
  LuLayers,
  LuTerminal,
  LuWrench,
  LuBox,
} from 'react-icons/lu';
import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNodedotjs,
  SiTensorflow,
  SiPytorch,
  SiPandas,
  SiNumpy,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiGit,
  SiAmazonwebservices,
  SiFigma,
  SiNextdotjs,
  SiFastapi,
  SiScikitlearn,
  SiTableau,
  SiLinux,
  SiCplusplus,
  SiKubernetes,
  SiRedis,
  SiMysql,
  SiPostman,
  SiDjango,
  SiOpencv,
} from 'react-icons/si';
import { PORTFOLIO_DATA, type Skill } from '../../config/portfolio-data';

interface SkillsAppProps {
  windowId: string;
  mode: 'desktop' | 'mobile';
}

const categories = [
  'All',
  'Languages',
  'Frameworks',
  'AI/ML',
  'Data Science',
  'Databases',
  'DevOps',
  'Tools',
];

const iconMap: Record<string, React.ElementType> = {
  python: SiPython,
  javascript: SiJavascript,
  typescript: SiTypescript,
  react: SiReact,
  nodejs: SiNodedotjs,
  tensorflow: SiTensorflow,
  pytorch: SiPytorch,
  pandas: SiPandas,
  numpy: SiNumpy,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  docker: SiDocker,
  git: SiGit,
  aws: SiAmazonwebservices,
  figma: SiFigma,
  nextjs: SiNextdotjs,
  fastapi: SiFastapi,
  'scikit-learn': SiScikitlearn,
  tableau: SiTableau,
  linux: SiLinux,
  cpp: SiCplusplus,
  kubernetes: SiKubernetes,
  redis: SiRedis,
  sql: SiMysql, // Approximate
  postman: SiPostman,
  django: SiDjango,
  opencv: SiOpencv,
  matplotlib: LuBox, // No specific icon in Si usually
};

const getIcon = (iconName: string, category: string) => {
  const Icon = iconMap[iconName.toLowerCase()] || iconMap[iconName] || null;
  if (Icon) return Icon;

  switch (category) {
    case 'Languages':
      return LuCode;
    case 'Databases':
      return LuDatabase;
    case 'DevOps':
      return LuTerminal;
    case 'Tools':
      return LuWrench;
    case 'AI/ML':
    case 'Data Science':
      return LuCpu;
    case 'Frameworks':
      return LuLayers;
    default:
      return LuServer;
  }
};

const SkillsApp: React.FC<SkillsAppProps> = ({ mode }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredSkills = useMemo(() => {
    return PORTFOLIO_DATA.skills.filter((skill) => {
      const matchesCategory = activeCategory === 'All' || skill.category === activeCategory;
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const topCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    PORTFOLIO_DATA.skills.forEach((skill) => {
      counts[skill.category] = (counts[skill.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  }, []);

  const getProficiencyLabel = (p: number) => {
    if (p >= 90) return 'Expert';
    if (p >= 75) return 'Advanced';
    if (p >= 50) return 'Intermediate';
    return 'Beginner';
  };

  const isMobile = mode === 'mobile';

  return (
    <div className="flex h-full flex-col bg-gray-50 text-gray-900">
      {/* Top Bar */}
      <div className="flex flex-col gap-4 border-b border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 md:max-w-md">
            <LuSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* View Toggle (Desktop only) */}
          {!isMobile && (
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-md p-2 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                <LuLayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-md p-2 transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                <LuList className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`relative whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === category ? 'text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
              {activeCategory === category && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 -z-10 rounded-full bg-blue-50"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <motion.div
          layout
          className={`grid gap-4 ${
            viewMode === 'grid' || isMobile
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.name}
                skill={skill}
                viewMode={isMobile ? 'grid' : viewMode}
                getIcon={getIcon}
                getProficiencyLabel={getProficiencyLabel}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredSkills.length === 0 && (
          <div className="mt-20 flex flex-col items-center justify-center text-gray-400">
            <LuSearch className="mb-4 h-12 w-12 opacity-50" />
            <p className="text-lg">No skills found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-gray-200 bg-white px-6 py-3 text-sm text-gray-500">
        <div className="flex justify-between">
          <span>Total Skills: {PORTFOLIO_DATA.skills.length}</span>
          <span>Top Category: {topCategory}</span>
        </div>
      </div>
    </div>
  );
};

interface SkillCardProps {
  skill: Skill;
  viewMode: 'grid' | 'list';
  getIcon: (name: string, category: string) => React.ElementType;
  getProficiencyLabel: (p: number) => string;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, viewMode, getIcon, getProficiencyLabel }) => {
  const Icon = React.useMemo(
    () => getIcon(skill.icon, skill.category),
    [skill.icon, skill.category, getIcon]
  );
  const isGrid = viewMode === 'grid';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, borderColor: 'rgba(59, 130, 246, 0.5)' }}
      className={`group relative flex ${
        isGrid ? 'flex-col gap-4 p-5' : 'flex-row items-center gap-6 p-4'
      } overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md`}
    >
      <div
        className={`flex items-center justify-center rounded-lg bg-gray-50 ${
          isGrid ? 'h-12 w-12' : 'h-10 w-10'
        }`}
      >
        {React.createElement(Icon, {
          className: `${isGrid ? 'h-7 w-7' : 'h-6 w-6'} text-gray-700 group-hover:text-blue-600 transition-colors`,
        })}
      </div>

      <div className={`flex-1 ${isGrid ? '' : 'flex items-center justify-between gap-8'}`}>
        <div className={isGrid ? 'mb-3' : ''}>
          <h3 className="font-semibold text-gray-900">{skill.name}</h3>
          <span className="text-xs text-gray-500">{skill.category}</span>
        </div>

        <div className={isGrid ? 'space-y-2' : 'flex-1 max-w-md'}>
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-600">Proficiency</span>
            <span className="text-blue-600">{getProficiencyLabel(skill.proficiency)}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${skill.proficiency}%` }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsApp;
