import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
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

interface AboutAppProps {
  windowId: string;
  mode: 'desktop' | 'mobile';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

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
      suffix: ' Yrs', // Simplified for now, could calculate actual years
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
    <motion.div
      className={`h-full w-full overflow-y-auto bg-gray-50 text-gray-900 ${
        isMobile ? 'p-6 pb-24' : 'p-8'
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={`mx-auto flex flex-col gap-8 ${isMobile ? 'max-w-full' : 'max-w-4xl'}`}>
        {/* Top Section */}
        <motion.div
          className={`flex ${isMobile ? 'flex-col items-center text-center' : 'flex-row items-center text-left'} gap-8`}
          variants={itemVariants}
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
                <span className="text-4xl font-bold text-gray-400">
                  {personal.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              {personal.name}
            </h1>
            <h2 className="text-xl font-medium text-gray-600">{personal.title}</h2>

            <div className={`flex items-center gap-2 text-gray-500 ${isMobile ? 'justify-center' : 'justify-start'}`}>
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
        </motion.div>

        {/* Bio Section */}
        <motion.div variants={itemVariants} className="prose prose-lg max-w-none text-gray-600">
          <p className="leading-relaxed">{personal.bio}</p>
        </motion.div>

        {/* Quick Stats Row */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
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
        </motion.div>

        {/* Social Links Section */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
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
        </motion.div>

        {/* Interests/Hobbies Section */}
        <motion.div variants={itemVariants} className="space-y-4">
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
        </motion.div>
      </div>
    </motion.div>
  );
};

// Simple CountUp component for stats animation
const CountUp = ({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);

      // Easing function: easeOutExpo
      const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

      setCount(Math.floor(end * ease));

      if (progress < duration * 1000) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count}{suffix}</>;
};

export default AboutApp;
