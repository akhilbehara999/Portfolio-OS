import { useState, useEffect } from 'react';
import { useWindowStore } from '../store/window.store';
import { useAppStore } from '../store/app.store';
import { useOSStore } from '../store/os.store';

export interface SystemStats {
  /** CPU usage in percentage (0-100) */
  cpuUsage: number;
  /** Memory usage in MB */
  memoryUsage: number;
  /** Number of active processes */
  processCount: number;
  /** Number of open windows */
  windowCount: number;
  /** System uptime in seconds */
  uptime: number;
  /** Frames per second */
  fps: number;
}

/**
 * Hook to monitor system simulations.
 * Calculates CPU, Memory usage, and track system stats.
 */
export const useSystemMonitor = (): SystemStats => {
  const windowCount = useWindowStore((state) => state.windows.size);
  const processCount = useAppStore((state) => state.runningApps.size);
  const uptime = useOSStore((state) => state.uptime);

  const [stats, setStats] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    fps: 60,
  });

  useEffect(() => {
    // Update simulated stats every 2 seconds
    const updateStats = () => {
      // Simulate CPU load based on active apps and windows
      // Base load + load per process + load per window + random fluctuation
      let cpu = 5 + processCount * 2.5 + windowCount * 3;
      cpu += Math.random() * 10 - 5;

      // Clamp between 0-100
      cpu = Math.max(2, Math.min(100, cpu));

      // Simulate Memory usage based on DOM nodes (proxy for complexity)
      const domNodes =
        typeof document !== 'undefined' ? document.getElementsByTagName('*').length : 0;
      // Base system memory + per process + per DOM node
      const memory = 250 + processCount * 80 + domNodes * 0.5;

      // FPS simulation
      // Drop FPS if CPU usage is high
      let fps = 60;
      if (cpu > 90) fps = 30 + Math.random() * 10;
      else if (cpu > 70) fps = 45 + Math.random() * 10;
      else fps = 58 + Math.random() * 4; // fluctuating around 60

      setStats({
        cpuUsage: Math.round(cpu),
        memoryUsage: Math.round(memory),
        fps: Math.round(fps),
      });
    };

    updateStats();
    const timer = setInterval(updateStats, 2000);

    return () => clearInterval(timer);
  }, [processCount, windowCount]);

  return {
    ...stats,
    processCount,
    windowCount,
    uptime,
  };
};
