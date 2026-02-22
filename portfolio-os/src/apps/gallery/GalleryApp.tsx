import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuX,
  LuChevronLeft,
  LuChevronRight,
  LuExternalLink,
  LuGithub,
  LuFilter
} from 'react-icons/lu';
import { PORTFOLIO_DATA, type Project } from '../../config/portfolio-data';

interface GalleryAppProps {
  windowId: string;
  mode: 'desktop' | 'mobile';
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const GalleryApp: React.FC<GalleryAppProps> = () => {
  const { projects } = PORTFOLIO_DATA;

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const handleClose = () => {
    setSelectedProject(null);
  };

  const handleNext = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    if (!selectedProject) return;
    const currentIndex = filteredProjects.findIndex(p => p.title === selectedProject.title);
    const nextIndex = (currentIndex + 1) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIndex]);
  }, [selectedProject, filteredProjects]);

  const handlePrev = useCallback((e?: React.MouseEvent | KeyboardEvent) => {
    e?.stopPropagation();
    if (!selectedProject) return;
    const currentIndex = filteredProjects.findIndex(p => p.title === selectedProject.title);
    const prevIndex = (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSelectedProject(filteredProjects[prevIndex]);
  }, [selectedProject, filteredProjects]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === 'ArrowRight') handleNext(e);
      if (e.key === 'ArrowLeft') handlePrev(e);
      if (e.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, handleNext, handlePrev]);

  // Generate a consistent gradient for projects without images
  const getGradient = (title: string) => {
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `linear-gradient(135deg, hsl(${hue}, 70%, 80%) 0%, hsl(${(hue + 40) % 360}, 70%, 60%) 100%)`;
  };

  return (
    <div className="h-full w-full bg-gray-900 text-white flex flex-col overflow-hidden relative">
      {/* Header / Filter */}
      <div className="p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur z-10 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LuFilter className="w-5 h-5 text-purple-400" />
          Gallery
        </h2>

        <div
          className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-20"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={project.title}
                onClick={() => setSelectedProject(project)}
                className="group relative aspect-video cursor-pointer rounded-xl overflow-hidden bg-gray-800 border border-gray-700 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/10"
              >
                {/* Image or Placeholder */}
                <div
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{ background: project.image && !project.image.includes('placeholder') ? `url(${project.image}) center/cover` : getGradient(project.title) }}
                >
                  {project.image && !project.image.includes('placeholder') && (
                     <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-0" onLoad={(e) => (e.target as HTMLImageElement).classList.remove('opacity-0')} />
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="font-bold text-white text-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{project.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-gray-950/95 backdrop-blur-xl flex flex-col"
          >
            {/* Toolbar */}
            <div className="flex justify-between items-center p-4 shrink-0">
              <span className="text-gray-400 text-sm">
                {filteredProjects.findIndex(p => p.title === selectedProject.title) + 1} / {filteredProjects.length}
              </span>
              <button
                onClick={handleClose}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
              >
                <LuX className="w-6 h-6" />
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center relative px-4 sm:px-12 pb-20 sm:pb-4 overflow-hidden">
              {/* Navigation Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 p-3 rounded-full bg-gray-800/50 hover:bg-gray-700 text-white backdrop-blur transition-all hover:scale-110 z-10"
              >
                <LuChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 p-3 rounded-full bg-gray-800/50 hover:bg-gray-700 text-white backdrop-blur transition-all hover:scale-110 z-10"
              >
                <LuChevronRight className="w-6 h-6" />
              </button>

              {/* Image Container with Swipe */}
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <motion.div
                  key={selectedProject.title}
                  initial={{ scale: 0.9, opacity: 0, x: 100 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0.9, opacity: 0, x: -100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(_, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      handleNext();
                    } else if (swipe > swipeConfidenceThreshold) {
                      handlePrev();
                    }
                  }}
                  className="relative w-full max-w-5xl flex-1 flex items-center justify-center mb-6 cursor-grab active:cursor-grabbing"
                >
                   <div
                    className="rounded-lg shadow-2xl overflow-hidden max-h-[60vh] sm:max-h-[70vh] w-auto max-w-full pointer-events-none"
                    style={{ background: selectedProject.image && !selectedProject.image.includes('placeholder') ? 'transparent' : getGradient(selectedProject.title) }}
                   >
                     {selectedProject.image && !selectedProject.image.includes('placeholder') ? (
                       <img
                         src={selectedProject.image}
                         alt={selectedProject.title}
                         className="max-h-full max-w-full object-contain"
                       />
                     ) : (
                        <div className="w-[600px] h-[400px] max-w-full max-h-full flex items-center justify-center text-gray-500 font-bold text-2xl">
                          {selectedProject.title}
                        </div>
                     )}
                   </div>
                </motion.div>

                {/* Details */}
                <motion.div
                  key={`details-${selectedProject.title}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center max-w-2xl shrink-0"
                >
                  <h2 className="text-2xl font-bold mb-2 text-white">{selectedProject.title}</h2>
                  <p className="text-gray-400 mb-4">{selectedProject.description}</p>

                  <div className="flex justify-center gap-4">
                    {selectedProject.githubLink && (
                      <a
                        href={selectedProject.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white"
                      >
                        <LuGithub className="w-4 h-4" />
                        <span>Code</span>
                      </a>
                    )}
                    {selectedProject.liveLink && (
                      <a
                        href={selectedProject.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                      >
                        <LuExternalLink className="w-4 h-4" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryApp;
