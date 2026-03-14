'use client';

import { useEffect, useState } from 'react';

interface GameTimerProps {
  duration: number; // in milliseconds
  onTimeUp: () => void;
  isActive: boolean;
  onTick?: (timeLeft: number) => void;
}

export default function GameTimer({ duration, onTimeUp, isActive, onTick }: GameTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      
      setTimeLeft(remaining);
      
      if (onTick) {
        onTick(remaining);
      }

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [isActive, duration, startTime, onTimeUp, onTick]);

  const percentage = (timeLeft / duration) * 100;
  const seconds = (timeLeft / 1000).toFixed(1);

  // Color based on time remaining
  const getColor = () => {
    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (percentage > 60) return 'text-green-600';
    if (percentage > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Time Remaining</span>
        <span className={`text-2xl font-bold ${getTextColor()}`}>
          {seconds}s
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-100 ease-linear`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}