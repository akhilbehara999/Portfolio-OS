import { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { LuFolder, LuBriefcase, LuAward, LuCode } from 'react-icons/lu';
import { PORTFOLIO_DATA } from '../config/portfolio-data';

interface QuickStatsWidgetProps {
  size?: 'small' | 'medium' | 'large';
}

const StatItem = ({
  icon: Icon,
  count,
  label,
  delay,
}: {
  icon: any;
  count: number;
  label: string;
  delay: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref);

  // Spring animation for the number
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    if (isInView) {
      spring.set(count);
    }
  }, [isInView, count, spring]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="flex flex-col items-center justify-center p-3 bg-white/40 dark:bg-white/5 rounded-xl border border-white/10 shadow-sm"
    >
      <div className="p-2 rounded-full bg-blue-500/10 dark:bg-blue-400/20 mb-2">
        <Icon className="text-xl text-blue-600 dark:text-blue-300" />
      </div>
      <motion.span className="text-2xl font-bold text-slate-800 dark:text-white leading-none">
        {display}
      </motion.span>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</span>
    </motion.div>
  );
};

export const QuickStatsWidget = ({ size = 'medium' }: QuickStatsWidgetProps) => {
  const projectsCount = PORTFOLIO_DATA.projects.length;
  const skillsCount = PORTFOLIO_DATA.skills.length;
  const certificationsCount = PORTFOLIO_DATA.certifications.length;
  const experienceCount = PORTFOLIO_DATA.experience.length;

  return (
    <div
      className={`glass-panel w-full h-full rounded-2xl flex flex-col ${size === 'small' ? 'p-3' : 'p-5'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Overview
        </h3>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        <StatItem icon={LuFolder} count={projectsCount} label="Projects" delay={0.1} />
        <StatItem icon={LuCode} count={skillsCount} label="Skills" delay={0.2} />
        <StatItem icon={LuAward} count={certificationsCount} label="Certs" delay={0.3} />
        <StatItem icon={LuBriefcase} count={experienceCount} label="Exp" delay={0.4} />
      </div>
    </div>
  );
};
