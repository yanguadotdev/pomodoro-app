import { useState, useEffect, useRef } from 'react';
import type { TimerState } from '../types';

const modes = {
  focus: { time: 25, label: 'Focus', color: 'text-orange-400' },
  shortBreak: { time: 5, label: 'Short Break', color: 'text-green-400' },
  longBreak: { time: 15, label: 'Long Break', color: 'text-blue-400' }
};

export const useTimer = () => {
  const [timer, setTimer] = useState<TimerState>({
    hours: 0,
    minutes: 25,
    seconds: 0,
    isActive: false,
    mode: 'focus',
    cycles: 0
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calcular progreso para la animación
  const totalSeconds = modes[timer.mode].time * 60;
  const currentSeconds = timer.minutes * 60 + timer.seconds;
  const progress = 1 - (currentSeconds / totalSeconds);

  // Timer logic
  useEffect(() => {
    if (timer.isActive) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds === 0) {
            if (prev.minutes === 0) {
              // Timer finished
              handleTimerComplete();
              return { ...prev, isActive: false };
            }
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          }
          return { ...prev, seconds: prev.seconds - 1 };
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer.isActive]);

  const handleTimerComplete = () => {
    // Vibration API for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
    
    setTimer(prev => {
      let newMode: 'focus' | 'shortBreak' | 'longBreak' = 'focus';
      let newCycles = prev.cycles;

      if (prev.mode === 'focus') {
        newCycles += 1;
        newMode = newCycles % 4 === 0 ? 'longBreak' : 'shortBreak';
      } else {
        newMode = 'focus';
      }

      return {
        ...prev,
        mode: newMode,
        minutes: modes[newMode].time,
        seconds: 0,
        cycles: newCycles
      };
    });
  };

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isActive: !prev.isActive }));
  };

  const resetTimer = () => {
    setTimer(prev => ({
      ...prev,
      isActive: false,
      minutes: modes[prev.mode].time,
      seconds: 0
    }));
  };

  const switchMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setTimer(prev => ({
      ...prev,
      mode,
      minutes: modes[mode].time,
      seconds: 0,
      isActive: false
    }));
  };

  const formatTime = (hours: number, minutes: number, seconds: number): string => {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timer,
    modes,
    progress,
    toggleTimer,
    resetTimer,
    switchMode,
    formatTime
  };
};