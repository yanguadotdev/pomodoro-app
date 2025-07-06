import React, { useEffect, useRef, useState } from 'react'
import { CloudRain } from 'lucide-react'
import { useRainEffect } from './hooks/useRainEffect';
import type { PomodoroSettings } from './types';
import ClockAnimation from './components/ClockAnimation';
import { useTimer } from './hooks/useTimer';

const PomodoroApp: React.FC = () => {
  const { timer, setTimer, settings, calculateSessionDuration, toggleTimer, resetTimer } = useTimer();

  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState<PomodoroSettings>(settings);
  const [rainEnabled, setRainEnabled] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const playNotificationSound = () => {
    if (settings.soundEnabled) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const { rainDrops } = useRainEffect(rainEnabled, 'storm');

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const updatePageTitle = (seconds: number, isBreak: boolean, isRunning: boolean) => {
    if (isRunning) {
      const timeStr = formatTime(seconds);
      const mode = isBreak ? 'Descanso' : 'Estudio';
      document.title = `${timeStr} - ${mode} | Pomodoro Timer`;
    } else {
      document.title = 'Pomodoro Timer';
    }
  };

  useEffect(() => {
    updatePageTitle(timer.currentSeconds, timer.isBreak, timer.isRunning);
  }, [timer.currentSeconds, timer.isBreak, timer.isRunning]);

  useEffect(() => {
    return () => {
      document.title = 'Pomodoro Timer';
    };
  }, []);


  // ===================================================================================
  useEffect(() => {
    if (timer.isRunning && !timer.isCompleted) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.currentSeconds <= 1) {
            // Time finished
            playNotificationSound();

            if (prev.isBreak) {
              // Finish rest time and start study time
              if (prev.currentInterval < prev.totalIntervals) {
                const sessionDuration = calculateSessionDuration(settings.studyHours, settings.intervals, settings.breakMinutes);
                return {
                  ...prev,
                  currentSeconds: sessionDuration,
                  totalSeconds: sessionDuration,
                  isBreak: false,
                  currentInterval: prev.currentInterval + 1,
                  isRunning: settings.autoStart
                };
              } else {
                return {
                  ...prev,
                  isRunning: false,
                  isCompleted: true,
                  currentSeconds: 0,
                  completedSessions: prev.totalIntervals,
                  totalStudyTime: settings.studyHours * 60
                };
              }
            } else {
              // Finish study time and start rest time
              const breakDuration = settings.breakMinutes * 60;
              return {
                ...prev,
                currentSeconds: breakDuration,
                totalSeconds: breakDuration,
                isBreak: true,
                isRunning: settings.autoStart,
                completedSessions: prev.completedSessions + 1,
                totalStudyTime: prev.totalStudyTime + (calculateSessionDuration(settings.studyHours, settings.intervals, settings.breakMinutes) / 60)
              };
            }
          } else {
            return {
              ...prev,
              currentSeconds: prev.currentSeconds - 1
            };
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.isCompleted, settings]);


  // Calculate progress
  const progress2 = timer.totalSeconds > 0 ?
    ((timer.totalSeconds - timer.currentSeconds) / timer.totalSeconds) * 100 : 0;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress2 / 100) * circumference;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/loffie-chill.webp')`
        }}
      />

      {rainEnabled && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {rainDrops.map(drop => (
            <div
              key={drop.id}
              className="absolute w-[.5px] bg-gradient-to-b from-transparent via-blue-200 to-transparent"
              style={{
                left: `${drop.left}%`,
                height: `${drop.height}px`,
                opacity: drop.opacity,
                animation: `fall ${drop.animationDuration}s linear`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setRainEnabled(!rainEnabled)}
        className="absolute top-6 right-6 z-30 bg-black/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/30 transition-all hover:scale-110"
      >
        <CloudRain className={`w-5 h-5 ${rainEnabled ? 'text-blue-300' : 'text-gray-400'}`} />
      </button>

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/10 shadow-2xl">
          <div>
            <ClockAnimation
              timer={timer}
              radius={radius}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              formatTime={formatTime}
              toggleTimer={toggleTimer}
              resetTimer={resetTimer}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-100px);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PomodoroApp;