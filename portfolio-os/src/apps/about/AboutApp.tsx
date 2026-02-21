import React, { useState, useEffect } from 'react';
import { PORTFOLIO_DATA } from '@config/portfolio-data';
import {
  LuMapPin,
  LuMail,
  LuGithub,
  LuLinkedin,
  LuTwitter,
  LuBriefcase,
  LuCode,
  LuAward,
  LuFileText
} from 'react-icons/lu';
import { motion } from 'framer-motion';

const AboutApp: React.FC = () => {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % PORTFOLIO_DATA.personal.taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Projects', value: PORTFOLIO_DATA.projects.length + '+', icon: LuBriefcase, color: 'text-blue-500' },
    { label: 'Skills', value: PORTFOLIO_DATA.skills.length + '+', icon: LuCode, color: 'text-purple-500' },
    { label: 'Certifications', value: PORTFOLIO_DATA.certifications.length + '+', icon: LuAward, color: 'text-yellow-500' },
    { label: 'Experience', value: PORTFOLIO_DATA.experience.length + '+', icon: LuFileText, color: 'text-green-500' },
  ];

  return (
    <div className="h-full w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8"
        >
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-tr from-blue-500 to-purple-500 p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-800">
                {PORTFOLIO_DATA.personal.avatar ? (
                  <img src={PORTFOLIO_DATA.personal.avatar} alt={PORTFOLIO_DATA.personal.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-slate-200 dark:bg-slate-700">
                    {PORTFOLIO_DATA.personal.name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-xl -z-10 group-hover:blur-2xl transition-all duration-500" />
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              {PORTFOLIO_DATA.personal.name}
            </h1>
            <h2 className="text-xl font-medium text-slate-600 dark:text-slate-300 mb-2">
              {PORTFOLIO_DATA.personal.title}
            </h2>

            <div className="h-8 mb-4 font-mono text-blue-500 dark:text-blue-400">
              <span className="mr-2">&gt;</span>
              <motion.span
                key={taglineIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {PORTFOLIO_DATA.personal.taglines[taglineIndex]}
              </motion.span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-5 bg-blue-500 ml-1 align-middle"
              />
            </div>

            <div className="flex items-center justify-center md:justify-start text-slate-500 dark:text-slate-400 gap-2">
              <LuMapPin size={18} />
              <span>{PORTFOLIO_DATA.personal.location}</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 backdrop-blur-sm hover:transform hover:-translate-y-1 transition-transform duration-300">
              <div className="flex flex-col items-center">
                <stat.icon className={`mb-2 ${stat.color}`} size={24} />
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bio Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="prose dark:prose-invert max-w-none"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
            About Me
          </h3>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {PORTFOLIO_DATA.personal.bio}
          </p>
        </motion.section>

        {/* Interests */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-1 bg-purple-500 rounded-full"></span>
            Interests & Hobbies
          </h3>
          <div className="flex flex-wrap gap-2">
            {PORTFOLIO_DATA.personal.interests.map((interest, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {interest}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Social Links */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 pt-8 border-t border-slate-200 dark:border-slate-800"
        >
          {PORTFOLIO_DATA.personal.socials.map((social) => {
            const Icon = social.icon === 'github' ? LuGithub :
                        social.icon === 'linkedin' ? LuLinkedin :
                        social.icon === 'twitter' ? LuTwitter :
                        LuMail;

            return (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl font-medium"
              >
                <Icon size={20} />
                {social.platform}
              </a>
            );
          })}
        </motion.section>
      </div>
    </div>
  );
};

export default AboutApp;
