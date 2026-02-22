import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { PORTFOLIO_DATA } from '../config/portfolio-data';

interface GreetingWidgetProps {
  size?: 'small' | 'medium' | 'large';
}

export const GreetingWidget = ({ size = 'medium' }: GreetingWidgetProps) => {
  const [greeting, setGreeting] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const name = PORTFOLIO_DATA.personal.name;
  const dateStr = format(new Date(), 'MMMM d, yyyy');

  useEffect(() => {
    const hour = new Date().getHours();
    let text = 'Good Morning ☀️';
    if (hour >= 5 && hour < 12) text = 'Good Morning ☀️';
    else if (hour >= 12 && hour < 17) text = 'Good Afternoon 🌤️';
    else if (hour >= 17 && hour < 21) text = 'Good Evening 🌆';
    else text = 'Good Night 🌙';

    setGreeting(text);
  }, []);

  useEffect(() => {
    if (!greeting) return;

    // Reset state when greeting changes
    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < greeting.length) {
        setDisplayedText(greeting.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [greeting]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-start justify-center p-6 w-full h-full glass-panel rounded-2xl overflow-hidden ${
        size === 'small' ? 'p-4' : ''
      }`}
    >
      <div className="flex items-center mb-2 min-h-[2.5rem]">
        <h1
          className={`font-bold tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap ${
            size === 'small' ? 'text-xl' : 'text-3xl'
          }`}
        >
          {displayedText}
        </h1>
        {isTyping && (
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className={`ml-1 bg-blue-500 rounded-full ${
              size === 'small' ? 'w-0.5 h-6' : 'w-1 h-8'
            }`}
          />
        )}
      </div>

      <div
        className={`text-slate-600 dark:text-slate-300 ${size === 'small' ? 'text-sm' : 'text-lg'}`}
      >
        <p className="font-medium text-slate-900 dark:text-white">{name}</p>
        <p className="text-sm opacity-70 mt-1">{dateStr}</p>
      </div>
    </motion.div>
  );
};
