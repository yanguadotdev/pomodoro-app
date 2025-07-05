import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Settings, X, CloudRain } from 'lucide-react'
import type { TimerState, RainDrop } from './types'
import ClockAnimation from './components/ClockAnimation';

const PomodoroApp: React.FC = () => {
  const [timer, setTimer] = useState<TimerState>({
    hours: 0,
    minutes: 25,
    seconds: 0,
    isActive: false,
    mode: 'focus',
    cycles: 0
  });

  const [showSettings, setShowSettings] = useState(false);
  const [focusTitle, setFocusTitle] = useState('');
  const [rainEnabled, setRainEnabled] = useState(true);
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rainIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const modes = {
    focus: { time: 25, label: 'Focus', color: 'text-orange-400' },
    shortBreak: { time: 5, label: 'Short Break', color: 'text-green-400' },
    longBreak: { time: 15, label: 'Long Break', color: 'text-blue-400' }
  };

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

  // Rain effect
  useEffect(() => {
    if (rainEnabled) {
      rainIntervalRef.current = setInterval(() => {
        createRainDrop();
      }, 150);
    } else {
      if (rainIntervalRef.current) clearInterval(rainIntervalRef.current);
      setRainDrops([]);
    }

    return () => {
      if (rainIntervalRef.current) clearInterval(rainIntervalRef.current);
    };
  }, [rainEnabled]);

  const createRainDrop = () => {
    const newDrop: RainDrop = {
      id: Date.now() + Math.random(),
      left: Math.random() * 100,
      animationDuration: Math.random() * 2 + 1.5,
      opacity: Math.random() * 0.6 + 0.2,
      height: Math.random() * 80 + 40
    };

    setRainDrops(prev => [...prev, newDrop]);

    setTimeout(() => {
      setRainDrops(prev => prev.filter(drop => drop.id !== newDrop.id));
    }, newDrop.animationDuration * 1000);
  };

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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/loffie-chill.webp')`
        }}
      />

      {/* Rain Effect */}
      {rainEnabled && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {rainDrops.map(drop => (
            <div
              key={drop.id}
              className="absolute w-0.5 bg-gradient-to-b from-transparent via-blue-200 to-transparent"
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

      {/* Rain Control */}
      <button
        onClick={() => setRainEnabled(!rainEnabled)}
        className="absolute top-6 right-6 z-30 bg-black/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/30 transition-all hover:scale-110"
      >
        <CloudRain className={`w-5 h-5 ${rainEnabled ? 'text-blue-300' : 'text-gray-400'}`} />
      </button>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 w-full max-w-md border border-white/10 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-xl font-semibold">🍅 Pomodoro</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-white/70 hover:text-white transition-colors hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex bg-black/20 rounded-lg p-1 mb-6">
            {Object.entries(modes).map(([key, mode]) => (
              <button
                key={key}
                onClick={() => switchMode(key as keyof typeof modes)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  timer.mode === key
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* Focus Title */}
          <div className="mb-4">
            <input
              type="text"
              value={focusTitle}
              onChange={(e) => setFocusTitle(e.target.value)}
              placeholder="click to add focus title"
              className="w-full bg-transparent text-white/70 text-center text-sm placeholder-white/50 border-none outline-none hover:text-white focus:text-white transition-colors py-2 rounded-lg hover:bg-white/5 focus:bg-white/5"
            />
          </div>

          {/* Rive Animation */}
          <div>
            <ClockAnimation 
              isActive={timer.isActive} 
              mode={timer.mode} 
              progress={progress}
            />
          </div>

          {/* Timer Display */}
          <div className="text-center mb-8 w-max mx-auto">
            <div className="text-4xl font-light text-white mb-2">
              {formatTime(timer.hours, timer.minutes, timer.seconds)}
            </div>
            <div className="flex justify-center text-xs text-white/50 uppercase tracking-wider">
              <span className='flex-1'>HR</span>
              <span className='flex-1'>MIN</span>
              <span className='flex-1'>SEC</span>
            </div>
          </div>

          {/* Mode Badge */}
          <div className="text-center mb-6">
            <span className="bg-black/30 px-4 py-2 rounded-full text-sm text-white/70 backdrop-blur-sm">
              Mode: {modes[timer.mode].label}
            </span>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={toggleTimer}
              className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 transform hover:scale-105 ${
                timer.isActive 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
                  : 'bg-white text-black hover:bg-white/90 shadow-lg'
              }`}
            >
              {timer.isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause Timer
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Timer
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all transform hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-black/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-white/50 mb-2">
            Not into pomodoro? Try our stopwatch/time-tracker with Track
          </div>

          {/* Cycles Counter */}
          <div className="text-center text-sm text-white/70">
            🏆 Completed cycles: {timer.cycles}
          </div>
        </div>
      </div>

      {/* Custom CSS */}
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
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default PomodoroApp;