import React from 'react';
import { motion } from 'framer-motion';
import {
  LuGraduationCap,
  LuCalendar,
  LuAward,
  LuBookOpen,
  LuSchool,
  LuTrophy,
} from 'react-icons/lu';
import { PORTFOLIO_DATA } from '../../config/portfolio-data';

interface EducationAppProps {
  windowId: string;
  mode: 'desktop' | 'mobile';
}

const EducationApp: React.FC<EducationAppProps> = ({ mode }) => {
  const { education, academicAchievements } = PORTFOLIO_DATA;
  const isMobile = mode === 'mobile';

  return (
    <div
      className={`h-full w-full overflow-y-auto bg-gray-50 text-gray-900 ${isMobile ? 'p-4' : 'p-8'}`}
    >
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-4"
        >
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <LuGraduationCap className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Education</h1>
            <p className="text-gray-500">Academic journey and achievements</p>
          </div>
        </motion.div>

        {/* Timeline Section */}
        <div className="relative border-l-2 border-gray-200 pl-8 ml-4 space-y-12">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 + 0.3 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-4 border-white bg-blue-500 shadow-sm ring-2 ring-blue-100" />

              <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-gray-900">{edu.degree}</h2>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full w-fit mt-2 sm:mt-0">
                  <LuCalendar className="h-4 w-4" />
                  <span>{edu.timeline}</span>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-2 text-lg font-medium text-gray-700">
                <LuSchool className="h-5 w-5 text-gray-400" />
                <span>{edu.university}</span>
              </div>

              <div className="mb-6 rounded-lg bg-blue-50/50 p-4 text-gray-700 border border-blue-100">
                <p className="leading-relaxed">{edu.description}</p>
                <div className="mt-2 font-semibold text-blue-700">CGPA: {edu.cgpa}</div>
              </div>

              {/* Coursework */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  <LuBookOpen className="h-4 w-4" />
                  <span>Relevant Coursework</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {edu.coursework.map((course) => (
                    <motion.span
                      key={course}
                      whileHover={{ scale: 1.05, backgroundColor: '#e0f2fe' }}
                      className="cursor-default rounded-md border border-gray-200 bg-white px-3 py-1 text-sm text-gray-600 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-700"
                      title={course} // Simple tooltip
                    >
                      {course}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Academic Achievements Section */}
        {academicAchievements && academicAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200"
          >
            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="rounded-lg bg-yellow-100 p-2 text-yellow-600">
                <LuTrophy className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Academic Achievements</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {academicAchievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:bg-white hover:shadow-md hover:border-yellow-200"
                >
                  <div className="mt-1 text-yellow-500">
                    <LuAward className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-500">{achievement.year}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EducationApp;
