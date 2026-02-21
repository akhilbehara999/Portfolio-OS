import React, { useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '@config/portfolio-data';
import {
  LuX,
  LuArrowLeft,
  LuArrowRight,
  LuZoomIn,
  LuZoomOut,
  LuMaximize,
  LuMinimize
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

// Mock images if not present in data
const MOCK_IMAGES = [
  { id: 1, src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', title: 'Coding Setup', category: 'Workspace' },
  { id: 2, src: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd', title: 'Code Screen', category: 'Development' },
  { id: 3, src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12', title: 'Design Mockup', category: 'Design' },
  { id: 4, src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b', title: 'Security Dashboard', category: 'Projects' },
  { id: 5, src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c', title: 'Team Meeting', category: 'Culture' },
  { id: 6, src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085', title: 'Mobile App', category: 'Projects' },
];

const GalleryApp: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Combine real project images with mock images
  const images = [
    ...PORTFOLIO_DATA.projects.filter(p => p.image).map((p, i) => ({
      id: `proj-${i}`,
      src: p.image!,
      title: p.title,
      category: 'Project'
    })),
    ...MOCK_IMAGES
  ];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImage === null) return;
    if (e.key === 'ArrowRight') setSelectedImage((selectedImage + 1) % images.length);
    if (e.key === 'ArrowLeft') setSelectedImage((selectedImage - 1 + images.length) % images.length);
    if (e.key === 'Escape') setSelectedImage(null);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <div className="h-full w-full bg-slate-100 dark:bg-slate-900 overflow-y-auto">
       <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              layoutId={`image-${img.id}`}
              whileHover={{ scale: 1.02, y: -4 }}
              onClick={() => setSelectedImage(index)}
              className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-shadow relative group"
            >
               <img
                 src={img.src}
                 alt={img.title}
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                 loading="lazy"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <span className="text-white font-bold truncate">{img.title}</span>
                  <span className="text-white/70 text-xs uppercase tracking-wider">{img.category}</span>
               </div>
            </motion.div>
          ))}
       </div>

       {/* Lightbox */}
       <AnimatePresence>
          {selectedImage !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-sm"
              onClick={() => setSelectedImage(null)}
            >
               {/* Controls */}
               <div className="absolute top-4 right-4 flex gap-4 text-white/70 z-50">
                  <button onClick={(e) => { e.stopPropagation(); setZoom(Math.max(0.5, zoom - 0.2)); }} className="hover:text-white transition-colors"><LuZoomOut size={24} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setZoom(Math.min(3, zoom + 0.2)); }} className="hover:text-white transition-colors"><LuZoomIn size={24} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setIsFullscreen(!isFullscreen); }} className="hover:text-white transition-colors">
                     {isFullscreen ? <LuMinimize size={24} /> : <LuMaximize size={24} />}
                  </button>
                  <button onClick={() => setSelectedImage(null)} className="hover:text-white transition-colors bg-white/10 rounded-full p-2 hover:bg-white/20">
                     <LuX size={24} />
                  </button>
               </div>

               {/* Navigation */}
               <button
                 onClick={handlePrev}
                 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 rounded-full hover:bg-white/10 transition-all z-50"
               >
                  <LuArrowLeft size={32} />
               </button>

               <button
                 onClick={handleNext}
                 className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 rounded-full hover:bg-white/10 transition-all z-50"
               >
                  <LuArrowRight size={32} />
               </button>

               {/* Main Image */}
               <motion.div
                 layoutId={`image-${images[selectedImage].id}`}
                 className={`relative ${isFullscreen ? 'w-screen h-screen' : 'max-w-[90vw] max-h-[85vh]'}`}
                 style={{ scale: zoom }}
                 onClick={(e) => e.stopPropagation()}
               >
                  <img
                    src={images[selectedImage].src}
                    alt={images[selectedImage].title}
                    className="w-full h-full object-contain rounded-lg shadow-2xl"
                  />

                  {/* Caption */}
                  <div className="absolute -bottom-16 left-0 right-0 text-center text-white">
                     <h2 className="text-xl font-bold">{images[selectedImage].title}</h2>
                     <p className="text-white/60">{images[selectedImage].category}</p>
                  </div>
               </motion.div>
            </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
};

export default GalleryApp;
