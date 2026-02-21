import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useWindowStore } from '../store/window.store';

interface SystemMonitorWidgetProps {
  size?: 'small' | 'medium' | 'large';
}

export const SystemMonitorWidget = ({ size = 'medium' }: SystemMonitorWidgetProps) => {
  const [cpuUsage, setCpuUsage] = useState(15);
  const [memoryUsage, setMemoryUsage] = useState(24);
  const [cpuHistory, setCpuHistory] = useState<number[]>(new Array(30).fill(15));
  const [uptime, setUptime] = useState(0);
  const { windows } = useWindowStore();

  const windowCount = windows.size;
  const processCount = 42 + windowCount * 3;

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate CPU Usage
      const baseLoad = 15;
      const load = Math.min(100, Math.max(5, baseLoad + Math.random() * 30 + windowCount * 2));

      setCpuUsage(Math.floor(load));
      setCpuHistory(prev => {
        const newHistory = [...prev.slice(1), load];
        return newHistory;
      });

      // Simulate Memory Usage
      const baseMem = 20;
      const mem = Math.min(95, baseMem + windowCount * 4 + Math.random() * 2);
      setMemoryUsage(Math.floor(mem));

      setUptime(prev => prev + 2);
    }, 2000);

    return () => clearInterval(interval);
  }, [windowCount]);

  const formatUptime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const getPathData = (data: number[], fill: boolean) => {
    const width = 100;
    const height = 40;
    const maxVal = 100;

    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (val / maxVal) * height;
      return `${x},${y}`;
    });

    if (fill) {
      return `M0,${height} L${points.join(' L')} L${width},${height} Z`;
    }
    return `M${points[0]} L${points.slice(1).join(' L')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-panel w-full h-full rounded-2xl flex flex-col justify-between overflow-hidden ${size === 'small' ? 'p-3' : 'p-4'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">System Status</h3>
        <span className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-white/10 px-2 py-0.5 rounded">
          UP: {formatUptime(uptime)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3">
        {/* CPU Bar */}
        <div className="flex flex-col">
          <div className="flex justify-between text-xs mb-1">
             <span className="text-slate-600 dark:text-slate-300 font-medium">CPU</span>
             <span className="font-bold text-blue-500">{cpuUsage}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              animate={{ width: `${cpuUsage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Memory Bar */}
        <div className="flex flex-col">
          <div className="flex justify-between text-xs mb-1">
             <span className="text-slate-600 dark:text-slate-300 font-medium">MEM</span>
             <span className="font-bold text-purple-500">{memoryUsage}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-500"
              animate={{ width: `${memoryUsage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="flex-1 relative min-h-[40px] w-full bg-slate-50 dark:bg-black/20 rounded border border-slate-200 dark:border-white/5 overflow-hidden">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full absolute inset-0">
            <motion.path
              d={getPathData(cpuHistory, true)}
              className="fill-blue-500/20"
              animate={{ d: getPathData(cpuHistory, true) }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
            <motion.path
              d={getPathData(cpuHistory, false)}
              fill="none"
              className="stroke-blue-500"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              animate={{ d: getPathData(cpuHistory, false) }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
        </svg>
      </div>

      <div className="mt-2 flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
        <span>Procs: {processCount}</span>
        <span>Threads: {processCount * 4 + 12}</span>
      </div>
    </motion.div>
  );
};
