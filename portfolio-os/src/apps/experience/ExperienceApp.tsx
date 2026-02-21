import React from 'react';
import { PORTFOLIO_DATA } from '@config/portfolio-data';
import {
  LuBriefcase,
  LuBuilding,
  LuCalendar,
  LuMapPin,
  LuCheckCircle
} from 'react-icons/lu';
import { motion } from 'framer-motion';

const ExperienceApp: React.FC = () => {
  // Simple calculation for years of experience
  const startYear = 2021; // Could be from data
  const currentYear = new Date().getFullYear();
  const totalYears = currentYear - startYear;

  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-y-auto relative">
       {/* Background Decoration */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
       </div>

       <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
          <div className="text-center mb-12">
             <h1 className="text-3xl font-bold mb-2">Work Experience</h1>
             <p className="text-slate-500 dark:text-slate-400">
               {totalYears}+ years of professional experience building software
             </p>
          </div>

          <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 md:ml-0 space-y-12">
             {PORTFOLIO_DATA.experience.map((exp, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 className="relative pl-8 md:pl-12"
               >
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-4 border-blue-500 shadow-sm" />

                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
                     <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                           {/* Company Logo Placeholder */}
                           <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                              {exp.company.charAt(0)}
                           </div>

                           <div>
                              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{exp.role}</h2>
                              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                                 <LuBuilding size={16} />
                                 <span>{exp.company}</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-col md:items-end gap-1 text-sm text-slate-500 dark:text-slate-400">
                           <div className="flex items-center gap-1.5">
                              <LuCalendar size={14} />
                              <span>{exp.duration}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <LuMapPin size={14} />
                              <span>Remote / On-site</span>
                              {/* Add location to data schema if needed */}
                           </div>
                        </div>
                     </div>

                     <ul className="space-y-3 mb-6">
                        {exp.description.map((point, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                             <LuCheckCircle className="mt-1 text-green-500 flex-shrink-0" size={16} />
                             <span>{point}</span>
                          </li>
                        ))}
                     </ul>

                     <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        {exp.techUsed.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-600/50"
                          >
                            {tech}
                          </span>
                        ))}
                     </div>
                  </div>
               </motion.div>
             ))}
          </div>

          {PORTFOLIO_DATA.experience.length === 0 && (
             <div className="text-center py-20 text-slate-400">
                <LuBriefcase size={48} className="mx-auto mb-4 opacity-50" />
                <p>More experiences coming soon... 🚀</p>
             </div>
          )}
       </div>
    </div>
  );
};

export default ExperienceApp;
