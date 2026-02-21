import React from 'react';
import { PORTFOLIO_DATA } from '@config/portfolio-data';
import {
  LuGraduationCap,
  LuCalendar,
  LuStar,
  LuBookOpen,
  LuAward
} from 'react-icons/lu';
import { motion } from 'framer-motion';

const EducationApp: React.FC = () => {
  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-y-auto relative">
      <div className="max-w-4xl mx-auto p-6 space-y-12">
        {/* Timeline Line */}
        <div className="absolute left-6 md:left-1/2 top-20 bottom-20 w-px bg-slate-200 dark:bg-slate-700 -z-10" />

        <h1 className="text-3xl font-bold text-center mb-8 relative z-10 bg-white dark:bg-slate-900 px-4 inline-block">
          Academic Journey
        </h1>

        {PORTFOLIO_DATA.education.map((edu, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              index % 2 === 0 ? 'md:flex-row-reverse' : ''
            }`}
          >
            {/* Timeline Dot */}
            <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-slate-900 transform -translate-x-1/2 z-10" />

            {/* Content Card */}
            <div className={`flex-1 w-full md:w-1/2 ${
              index % 2 === 0 ? 'md:text-right pr-8 pl-12 md:pl-0' : 'pl-12 md:pl-8'
            }`}>
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700/50 hover:shadow-xl transition-shadow relative group">
                <div className="absolute top-4 right-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors">
                  <LuGraduationCap size={32} />
                </div>

                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {edu.degree}
                </h2>
                <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">
                  {edu.university}
                </h3>

                <div className={`flex items-center gap-4 text-sm text-slate-500 mb-4 ${
                  index % 2 === 0 ? 'md:justify-end' : ''
                }`}>
                  <div className="flex items-center gap-1">
                    <LuCalendar size={14} />
                    <span>{edu.timeline}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LuStar size={14} className="text-yellow-500" />
                    <span>CGPA: {edu.cgpa}</span>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {edu.description}
                </p>

                {/* Coursework Chips */}
                {edu.coursework && (
                  <div className={`flex flex-wrap gap-2 ${
                    index % 2 === 0 ? 'md:justify-end' : ''
                  }`}>
                    {edu.coursework.map((course, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white dark:bg-slate-700 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-default"
                        title={course}
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Academic Achievements */}
        {PORTFOLIO_DATA.academicAchievements && PORTFOLIO_DATA.academicAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl p-8 border border-yellow-100 dark:border-yellow-900/30 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl -z-10" />

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-yellow-700 dark:text-yellow-400">
              <LuAward size={28} />
              Academic Achievements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PORTFOLIO_DATA.academicAchievements.map((achievement, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-yellow-100 dark:border-slate-700 hover:border-yellow-300 transition-colors"
                >
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400">
                    <LuAward size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">
                      {achievement.title}
                    </h3>
                    <span className="text-sm text-slate-500 font-mono">
                      {achievement.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EducationApp;
