import { useState, useEffect } from 'react';

interface FormattedTime {
  time: string;
  date: string;
  hours: number;
  minutes: number;
  seconds: number;
  is24Hour: boolean;
  isPM: boolean;
}

/**
 * Hook to provide real-time clock functionality.
 * Updates every second.
 */
export const useClock = (use24HourFormat: boolean = false): FormattedTime => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Initial update handled in useState

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const isPM = hours >= 12;

  // Format time
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24HourFormat,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };

  const timeString = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
  const dateString = new Intl.DateTimeFormat('en-US', dateOptions).format(now);

  return {
    time: timeString,
    date: dateString,
    hours,
    minutes,
    seconds,
    is24Hour: use24HourFormat,
    isPM,
  };
};
