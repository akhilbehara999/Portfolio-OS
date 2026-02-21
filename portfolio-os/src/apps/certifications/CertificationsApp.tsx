import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '@config/portfolio-data';
import {
  LuAward,
  LuExternalLink,
  LuCalendar,
  LuShieldCheck
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

const CertificationsApp: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'issuer'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  const issuers = Array.from(new Set(PORTFOLIO_DATA.certifications.map(c => c.issuer)));

  const filteredCerts = PORTFOLIO_DATA.certifications
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return a.title.localeCompare(b.title);
    });

  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-y-auto relative">
       {/* Header */}
       <div className="bg-slate-50 dark:bg-slate-950 p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
                   <LuAward size={24} />
                </div>
                <div>
                   <h1 className="text-2xl font-bold">Certifications</h1>
                   <p className="text-sm text-slate-500 dark:text-slate-400">
                     {PORTFOLIO_DATA.certifications.length} Achievements Unlocked
                   </p>
                </div>
             </div>

             <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Newest First</option>
                  <option value="name">Name (A-Z)</option>
                </select>
             </div>
          </div>
       </div>

       {/* Grid */}
       <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
             {filteredCerts.map((cert, index) => (
               <motion.div
                 key={cert.title}
                 initial={{ opacity: 0, scale: 0.9, rotateY: 90 }}
                 animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                 transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
                 className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300"
               >
                  {/* Decorative Ribbon */}
                  <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                     <div className="bg-yellow-400 text-yellow-900 text-[10px] font-bold py-1 px-8 transform rotate-45 translate-x-8 translate-y-4 shadow-sm uppercase tracking-wider text-center w-32">
                        Verified
                     </div>
                  </div>

                  <div className="p-6 flex flex-col h-full">
                     <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-2xl font-bold text-slate-400 dark:text-slate-300 shadow-inner flex-shrink-0">
                           {cert.issuer.charAt(0)}
                        </div>
                        <div className="pr-8">
                           <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                             {cert.title}
                           </h3>
                           <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                              <LuShieldCheck size={14} className="text-green-500" />
                              <span>{cert.issuer}</span>
                           </div>
                        </div>
                     </div>

                     <div className="mt-auto space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 font-mono">
                           <div className="flex items-center gap-1.5">
                              <LuCalendar size={14} />
                              <span>{cert.date}</span>
                           </div>
                           {cert.credentialId && (
                             <span className="truncate max-w-[120px]" title={cert.credentialId}>
                               ID: {cert.credentialId}
                             </span>
                           )}
                        </div>

                        {cert.link && (
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors text-sm font-medium group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-600 border border-slate-200 dark:border-slate-600 hover:border-blue-200 dark:hover:border-blue-500/50"
                          >
                             <LuExternalLink size={16} /> Verify Credential
                          </a>
                        )}
                     </div>
                  </div>
               </motion.div>
             ))}
          </AnimatePresence>
       </div>

       {filteredCerts.length === 0 && (
          <div className="text-center py-20 text-slate-400">
             <LuAward size={48} className="mx-auto mb-4 opacity-50" />
             <p>No certifications found matching your filters.</p>
          </div>
       )}
    </div>
  );
};

export default CertificationsApp;
