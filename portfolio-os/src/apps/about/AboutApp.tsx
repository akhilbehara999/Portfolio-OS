import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LuMapPin,
  LuGithub,
  LuLinkedin,
  LuTwitter,
  LuMail,
  LuFolder,
  LuCpu,
  LuAward,
  LuBriefcase,
  LuExternalLink,
} from 'react-icons/lu';
import { PORTFOLIO_DATA } from '../../config/portfolio-data';
import { StaggerContainer, StaggerItem } from '../../components/animations/StaggerContainer';
import { CountUp } from '../../components/animations/CountUp';

interface AboutAppProps {
  windowId: string;
  mode: 'desktop' | 'mobile';
}

const AboutApp: React.FC<AboutAppProps> = ({ mode }) => {
  const { personal, projects, skills, certifications, experience } = PORTFOLIO_DATA;
  const [taglineIndex, setTaglineIndex] = useState(0);

  // Typewriter effect logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % personal.taglines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [personal.taglines.length]);

  const stats = [
    {
      label: 'Projects',
      value: projects.length,
      icon: LuFolder,
      suffix: '+',
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Skills',
      value: skills.length,
      icon: LuCpu,
      suffix: '+',
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      label: 'Certifications',
      value: certifications.length,
      icon: LuAward,
      suffix: '+',
      color: 'bg-yellow-500/10 text-yellow-600',
    },
    {
      label: 'Experience',
      value: experience.length,
      icon: LuBriefcase,
      suffix: ' Yrs',
      color: 'bg-green-500/10 text-green-600',
    },
  ];

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return LuGithub;
      case 'linkedin':
        return LuLinkedin;
      case 'twitter':
        return LuTwitter;
      case 'email':
        return LuMail;
      default:
        return LuExternalLink;
    }
  };

  const isMobile = mode === 'mobile';

  return (
    <div
      className={`h-full w-full overflow-y-auto bg-gray-50 text-gray-900 ${isMobile ? 'p-6 pb-24' : 'p-8'}`}
    >
      <StaggerContainer
        className={`mx-auto flex flex-col gap-8 ${isMobile ? 'max-w-full' : 'max-w-4xl'}`}
      >
        {/* Top Section */}
        <StaggerItem
          className={`flex ${isMobile ? 'flex-col items-center text-center' : 'flex-row items-center text-left'} gap-8`}
        >
          {/* Profile Photo */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
            <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-white ring-4 ring-white">
              {personal.avatar && !personal.avatar.includes('placeholder') ? (
                <img
                  src={personal.avatar}
                  alt={personal.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-gray-400">{personal.name.charAt(0)}</span>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{personal.name}</h1>
            <h2 className="text-xl font-medium text-gray-600">{personal.title}</h2>

            <div
              className={`flex items-center gap-2 text-gray-500 ${isMobile ? 'justify-center' : 'justify-start'}`}
            >
              <LuMapPin className="h-4 w-4" />
              <span>{personal.location}</span>
            </div>

            {/* Animated Tagline */}
            <div className="h-8 overflow-hidden pt-1">
              <AnimatePresence mode="wait">
                <motion.p
                  key={taglineIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-semibold text-transparent"
                >
                  {personal.taglines[taglineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </StaggerItem>

        {/* Bio Section */}
        <StaggerItem className="prose prose-lg max-w-none text-gray-600">
          <p className="leading-relaxed">{personal.bio}</p>
        </StaggerItem>

        {/* Quick Stats Row */}
        <StaggerItem className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-white/50 bg-white/50 p-4 shadow-sm backdrop-blur-sm transition-colors hover:border-blue-500/20 hover:bg-white/80"
            >
              <div className={`mb-3 rounded-xl p-2.5 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </StaggerItem>

        {/* Social Links Section */}
        <StaggerItem className="flex flex-wrap justify-center gap-4">
          {personal.socials.map((social) => {
            const Icon = getSocialIcon(social.platform);
            return (
              <motion.a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-900 hover:text-white hover:ring-gray-900"
              >
                <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>{social.platform}</span>
              </motion.a>
            );
          })}
        </StaggerItem>

        {/* Interests/Hobbies Section */}
        <StaggerItem className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Interests & Hobbies</h3>
          <div className="flex flex-wrap gap-2">
            {personal.interests.map((interest) => (
              <motion.span
                key={interest}
                whileHover={{ scale: 1.05 }}
                className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                {interest}
              </motion.span>
            ))}
          </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
};

export default AboutApp;
