'use client';

import { useEffect, useState } from 'react';

interface GameTimerProps {
  duration: number;
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
      if (onTick) onTick(remaining);
      if (remaining <= 0) { clearInterval(interval); onTimeUp(); }
    }, 50);
    return () => clearInterval(interval);
  }, [isActive, duration, startTime, onTimeUp, onTick]);

  const percentage = (timeLeft / duration) * 100;
  const seconds = (timeLeft / 1000).toFixed(1);

  const getBarColor = () => {
    if (percentage > 60) return '#4ADE80';
    if (percentage > 30) return '#FACC15';
    return '#EF4444';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium" style={{ color: '#64748b' }}>Time Remaining</span>
        <span className="text-2xl font-bold" style={{ color: getBarColor() }}>{seconds}s</span>
      </div>
      <div className="w-full rounded-full h-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div className="h-full rounded-full transition-all duration-100 ease-linear"
          style={{ width: `${percentage}%`, background: getBarColor() }} />
      </div>
    </div>
  );
}
