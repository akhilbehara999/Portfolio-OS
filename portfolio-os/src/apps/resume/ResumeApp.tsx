import React, { useState, useRef } from 'react';
import { PORTFOLIO_DATA } from '@config/portfolio-data';
import {
  LuPrinter,
  LuDownload,
  LuZoomIn,
  LuZoomOut,
  LuFileText,
  LuCode
} from 'react-icons/lu';
import { motion } from 'framer-motion';

const ResumeApp: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would link to a PDF file
    // For now, trigger print as PDF
    window.print();
  };

  const ResumeContent = () => (
    <div className="bg-white text-slate-900 p-8 md:p-12 shadow-sm min-h-[1100px] w-full max-w-[800px] mx-auto origin-top transition-transform duration-200" style={{ transform: `scale(${zoom})` }}>
       {/* Header */}
       <header className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
          <div>
             <h1 className="text-4xl font-bold uppercase tracking-wide mb-2">{PORTFOLIO_DATA.personal.name}</h1>
             <h2 className="text-xl text-slate-600 font-medium">{PORTFOLIO_DATA.personal.title}</h2>
          </div>
          <div className="text-right text-sm space-y-1">
             <div>{PORTFOLIO_DATA.contact.email}</div>
             <div>{PORTFOLIO_DATA.contact.phone}</div>
             <div>{PORTFOLIO_DATA.contact.location}</div>
             <div className="text-blue-600 underline">github.com/jules</div>
          </div>
       </header>

       {/* Summary */}
       <section className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-3 text-slate-500">Professional Summary</h3>
          <p className="text-slate-800 leading-relaxed">{PORTFOLIO_DATA.personal.bio}</p>
       </section>

       {/* Experience */}
       <section className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-4 text-slate-500">Experience</h3>
          <div className="space-y-6">
             {PORTFOLIO_DATA.experience.map((exp, i) => (
               <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                     <h4 className="font-bold text-lg">{exp.role}</h4>
                     <span className="text-sm text-slate-500 font-mono">{exp.duration}</span>
                  </div>
                  <div className="text-slate-700 font-medium mb-2">{exp.company}</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                     {exp.description.map((desc, j) => (
                       <li key={j}>{desc}</li>
                     ))}
                  </ul>
               </div>
             ))}
          </div>
       </section>

       {/* Education */}
       <section className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-4 text-slate-500">Education</h3>
          {PORTFOLIO_DATA.education.map((edu, i) => (
            <div key={i} className="mb-4">
               <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold">{edu.university}</h4>
                  <span className="text-sm text-slate-500 font-mono">{edu.timeline}</span>
               </div>
               <div>{edu.degree}</div>
               <div className="text-sm text-slate-600 mt-1">CGPA: {edu.cgpa}</div>
            </div>
          ))}
       </section>

       {/* Skills */}
       <section className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-4 text-slate-500">Skills</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
             {PORTFOLIO_DATA.skills.slice(0, 12).map((skill, i) => (
               <div key={i} className="flex justify-between">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-slate-500">{skill.proficiency}%</span>
               </div>
             ))}
          </div>
       </section>

       {/* Projects */}
       <section>
          <h3 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-4 text-slate-500">Key Projects</h3>
          <div className="space-y-4">
             {PORTFOLIO_DATA.projects.filter(p => p.featured).slice(0, 3).map((p, i) => (
               <div key={i}>
                  <div className="flex justify-between items-baseline">
                     <h4 className="font-bold">{p.title}</h4>
                     <span className="text-xs text-slate-500 font-mono">{p.category}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{p.description}</p>
               </div>
             ))}
          </div>
       </section>
    </div>
  );

  const RawContent = () => (
    <div className="bg-slate-900 text-slate-300 p-6 md:p-8 font-mono text-sm overflow-x-auto min-h-full">
       <pre>{JSON.stringify(PORTFOLIO_DATA, null, 2)}</pre>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col bg-slate-100 dark:bg-slate-800 overflow-hidden">
       {/* Toolbar */}
       <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm z-10">
          <div className="flex items-center gap-2">
             <button
               onClick={handleDownload}
               className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
             >
                <LuDownload size={16} /> <span className="hidden sm:inline">Download PDF</span>
             </button>
             <button
               onClick={handlePrint}
               className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium transition-colors"
             >
                <LuPrinter size={16} /> <span className="hidden sm:inline">Print</span>
             </button>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded p-1 gap-1">
             <button
               onClick={() => setViewMode('formatted')}
               className={`p-1.5 rounded transition-colors ${viewMode === 'formatted' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
               title="Formatted View"
             >
                <LuFileText size={18} />
             </button>
             <button
               onClick={() => setViewMode('raw')}
               className={`p-1.5 rounded transition-colors ${viewMode === 'raw' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
               title="Raw JSON View"
             >
                <LuCode size={18} />
             </button>
          </div>

          <div className="flex items-center gap-2">
             <button
               onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
               className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
               disabled={viewMode === 'raw'}
             >
                <LuZoomOut size={18} />
             </button>
             <span className="text-xs w-12 text-center font-mono text-slate-500">{Math.round(zoom * 100)}%</span>
             <button
               onClick={() => setZoom(Math.min(2, zoom + 0.1))}
               className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500"
               disabled={viewMode === 'raw'}
             >
                <LuZoomIn size={18} />
             </button>
          </div>
       </div>

       {/* Content Area */}
       <div className="flex-1 overflow-auto bg-slate-200 dark:bg-slate-950 p-4 md:p-8 flex justify-center">
          {viewMode === 'formatted' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[800px]"
            >
               <ResumeContent />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-4xl h-full bg-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-700"
            >
               <RawContent />
            </motion.div>
          )}
       </div>

       {/* Print Styles */}
       <style>{`
         @media print {
           @page { margin: 0; size: auto; }
           body * { visibility: hidden; }
           #root, #root * { visibility: visible; }
           .h-full { height: auto !important; overflow: visible !important; }
           header, nav, button, .bg-slate-200, .dark\\:bg-slate-950 { display: none !important; }
           .bg-white { box-shadow: none !important; margin: 0 !important; transform: none !important; width: 100% !important; max-width: none !important; }
         }
       `}</style>
    </div>
  );
};

export default ResumeApp;
