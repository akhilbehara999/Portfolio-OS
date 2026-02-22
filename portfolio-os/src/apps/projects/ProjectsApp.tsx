import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuSearch,
  LuLayoutGrid,
  LuList,
  LuGithub,
  LuExternalLink,
  LuArrowLeft,
  LuLayers,
} from 'react-icons/lu';
import {
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiPython,
  SiTensorflow,
  SiFlask,
  SiFirebase,
  SiRust,
  SiDocker,
  SiPostgresql,
  SiRedis,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiNodedotjs,
  SiMongodb,
  SiAmazon,
  SiGit,
  SiLinux,
  SiNextdotjs,
  SiOpencv,
  SiPytorch,
  SiScikitlearn,
  SiTableau,
  SiPandas,
  SiNumpy,
  SiKeras,
  SiFlutter,
  SiSqlite,
} from 'react-icons/si';
import { PORTFOLIO_DATA, type Project } from '../../config/portfolio-data';

// --- Icon Mapping Helper ---
const getTechIcon = (tech: string) => {
  const normalized = tech.toLowerCase().replace(/\s+/g, '');
  const iconMap: Record<string, React.ElementType> = {
    react: SiReact,
    typescript: SiTypescript,
    tailwindcss: SiTailwindcss,
    python: SiPython,
    tensorflow: SiTensorflow,
    flask: SiFlask,
    firebase: SiFirebase,
    rust: SiRust,
    docker: SiDocker,
    postgresql: SiPostgresql,
    redis: SiRedis,
    javascript: SiJavascript,
    html: SiHtml5,
    css: SiCss3,
    nodejs: SiNodedotjs,
    mongodb: SiMongodb,
    aws: SiAmazon,
    git: SiGit,
    linux: SiLinux,
    nextjs: SiNextdotjs,
    opencv: SiOpencv,
    pytorch: SiPytorch,
    scikitlearn: SiScikitlearn,
    tableau: SiTableau,
    pandas: SiPandas,
    numpy: SiNumpy,
    keras: SiKeras,
    flutter: SiFlutter,
    sqlite: SiSqlite,
  };
  return iconMap[normalized] || LuLayers; // Fallback icon
};

// --- Interfaces ---
interface ProjectsAppProps {
  windowId: string;
  mode: 'desktop' | 'mobile';
}

// --- Components ---

const ProjectCard = ({
  project,
  viewMode,
  onClick,
}: {
  project: Project;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}) => {
  const isGrid = viewMode === 'grid';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{
        y: -4,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      }}
      className={`group relative overflow-hidden rounded-xl border border-white/40 bg-white/60 shadow-sm backdrop-blur-md transition-all hover:border-blue-500/50 ${
        isGrid ? 'flex flex-col' : 'flex flex-row items-center gap-4 p-4'
      }`}
      onClick={onClick}
    >
      {/* Image Placeholder */}
      <div
        className={`${
          isGrid ? 'h-48 w-full' : 'h-24 w-24 shrink-0 rounded-lg'
        } relative overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100`}
      >
        {project.image && !project.image.includes('placeholder') ? (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-4xl font-bold text-gray-400">
            {project.title
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
        )}

        {project.featured && isGrid && (
          <div className="absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white shadow-md">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`flex flex-1 flex-col ${isGrid ? 'p-4' : ''}`}>
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
            {project.title}
          </h3>
          {project.featured && !isGrid && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
              Featured
            </span>
          )}
        </div>

        <p className={`mt-2 text-sm text-gray-600 ${isGrid ? 'line-clamp-2' : 'line-clamp-2'}`}>
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.slice(0, isGrid ? 4 : 6).map((tech) => {
            const Icon = getTechIcon(tech);
            return (
              <div
                key={tech}
                className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                title={tech}
              >
                <Icon className="h-3 w-3" />
                <span className={isGrid ? 'hidden xl:inline' : 'inline'}>{tech}</span>
              </div>
            );
          })}
          {project.techStack.length > (isGrid ? 4 : 6) && (
            <span className="flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500">
              +{project.techStack.length - (isGrid ? 4 : 6)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className={`mt-4 flex items-center gap-2 ${!isGrid && 'ml-auto mt-0 self-end'}`}>
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              onClick={(e) => e.stopPropagation()}
              title="View Source"
            >
              <LuGithub className="h-5 w-5" />
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              onClick={(e) => e.stopPropagation()}
              title="Live Demo"
            >
              <LuExternalLink className="h-5 w-5" />
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="ml-auto flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
          >
            Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectDetails = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-50 flex flex-col overflow-y-auto bg-white/95 backdrop-blur-xl"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200/50 bg-white/80 p-4 backdrop-blur-md">
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
        >
          <LuArrowLeft className="h-5 w-5" />
          Back to Projects
        </button>
        <div className="flex gap-2">
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <LuGithub className="h-4 w-4" />
              GitHub
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <LuExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl p-6 md:p-8">
        {/* Header Image */}
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-2xl bg-gray-100 md:h-96">
          {project.image && !project.image.includes('placeholder') ? (
            <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-6xl font-bold text-gray-400">
              {project.title
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{project.title}</h1>
              {project.featured && (
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                  Featured
                </span>
              )}
            </div>
            <p className="mt-2 text-lg text-gray-600">{project.category}</p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-600">
            <p>{project.longDescription}</p>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-bold text-gray-900">Technologies Used</h3>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech) => {
                const Icon = getTechIcon(tech);
                return (
                  <div
                    key={tech}
                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
                  >
                    <Icon className="h-5 w-5 text-gray-500" />
                    {tech}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Related Projects Logic could go here, for now simpler */}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="mb-6 text-xl font-bold text-gray-900">More Projects</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {PORTFOLIO_DATA.projects
              .filter((p) => p.title !== project.title)
              .slice(0, 2)
              .map((related) => (
                <div
                  key={related.title}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-200 overflow-hidden">
                    {related.image && !related.image.includes('placeholder') ? (
                      <img src={related.image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 font-bold">
                        {related.title.substring(0, 2)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{related.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">{related.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsApp: React.FC<ProjectsAppProps> = ({ mode }) => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filters = ['All', 'Featured', 'AI/ML', 'Web Development', 'Data Science', 'Tools', 'IoT'];

  const filteredProjects = useMemo(() => {
    return PORTFOLIO_DATA.projects.filter((project) => {
      const matchesFilter =
        filter === 'All' ||
        (filter === 'Featured' ? project.featured : project.category === filter);
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.techStack.some((tech) => tech.toLowerCase().includes(search.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const isMobile = mode === 'mobile';

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-50/50">
      <div
        className={`flex h-full flex-col ${selectedProject ? 'overflow-hidden' : 'overflow-y-auto'}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-gray-200/50 bg-white/80 p-6 backdrop-blur-md">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                My Projects{' '}
                <span className="ml-2 text-lg font-normal text-gray-500">
                  ({filteredProjects.length})
                </span>
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-lg p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <LuLayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <LuList className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <LuSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                      filter === f
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 p-6 ${isMobile ? 'pb-24' : ''}`}>
          {filteredProjects.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' // Added lg:grid-cols-3 for wider screens
                  : 'grid-cols-1'
              }`}
            >
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    viewMode={viewMode}
                    onClick={() => setSelectedProject(project)}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-64 flex-col items-center justify-center text-center"
            >
              <div className="mb-4 rounded-full bg-gray-100 p-6">
                <LuSearch className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No projects found</h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              <button
                onClick={() => {
                  setFilter('All');
                  setSearch('');
                }}
                className="mt-6 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Detail View Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetails project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsApp;
