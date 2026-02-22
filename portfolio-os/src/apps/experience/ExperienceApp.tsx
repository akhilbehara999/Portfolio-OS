import React from 'react';
import { motion } from 'framer-motion';
import { LuBriefcase, LuCalendar, LuBuilding, LuCheck, LuLayers } from 'react-icons/lu';
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
  SiWordpress,
  SiPhp,
} from 'react-icons/si';
import { PORTFOLIO_DATA, type Experience } from '../../config/portfolio-data';

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
    wordpress: SiWordpress,
    php: SiPhp,
  };
  return iconMap[normalized] || LuLayers;
};

interface ExperienceAppProps {
  windowId: string;
  mode: 'desktop' | 'mobile';
}

const ExperienceCard = ({ experience, index }: { experience: Experience; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.15, type: 'spring', stiffness: 50 }}
      className="relative mb-12 pl-8 last:mb-0 md:pl-12"
    >
      {/* Timeline Connector */}
      <div className="absolute left-0 top-0 flex h-full w-12 justify-center">
        <div className="h-full w-px bg-gray-200"></div>
      </div>

      {/* Timeline Dot */}
      <div className="absolute left-0 top-0 flex w-12 justify-center pt-2">
        <div className="h-3 w-3 rounded-full border-2 border-white bg-blue-500 ring-4 ring-blue-50"></div>
      </div>

      <div className="group relative rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:border-blue-500/30 hover:shadow-md md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-xl font-bold text-blue-600 shadow-sm">
              {experience.company.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{experience.role}</h3>
              <div className="flex items-center gap-2 text-base font-medium text-gray-700">
                <LuBuilding className="h-4 w-4 text-gray-400" />
                {experience.company}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600">
            <LuCalendar className="h-4 w-4 text-gray-400" />
            {experience.duration}
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 space-y-3">
          {experience.description.map((point, i) => (
            <div key={i} className="flex items-start gap-3 text-gray-600">
              <LuCheck className="mt-1 h-5 w-5 shrink-0 text-blue-500/50" />
              <span className="leading-relaxed">{point}</span>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-gray-100/50 pt-4">
          {experience.techUsed.map((tech) => {
            const Icon = getTechIcon(tech);
            return (
              <div
                key={tech}
                className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <Icon className="h-3.5 w-3.5 text-gray-400" />
                {tech}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const ExperienceApp: React.FC<ExperienceAppProps> = ({ mode }) => {
  const { experience } = PORTFOLIO_DATA;
  const isMobile = mode === 'mobile';

  // Calculate total experience duration roughly
  const totalExperience = '3+ Years';

  return (
    <div
      className={`h-full w-full overflow-y-auto bg-gray-50/50 ${isMobile ? 'p-6 pb-24' : 'p-12'}`}
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Professional Experience
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            My career journey and professional milestones.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm shadow-blue-500/20">
            <LuBriefcase className="h-4 w-4" />
            <span>{totalExperience} Experience</span>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Main vertical line for the whole list */}
          <div className="absolute left-6 top-2 h-[calc(100%-2rem)] w-px bg-gray-200 md:left-6"></div>

          {experience.length > 0 ? (
            <div className="space-y-2">
              {experience.map((exp, index) => (
                <ExperienceCard key={index} experience={exp} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <LuBriefcase className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                More experiences coming soon... 🚀
              </h3>
            </div>
          )}
        </div>

        {/* Footer/Resume Download Prompt could go here */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">Looking for a more detailed overview?</p>
          {/* Could link to Resume app if available */}
        </motion.div>
      </div>
    </div>
  );
};

export default ExperienceApp;
