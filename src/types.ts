export interface RainDrop {
  id: number;
  left: number;
  animationDuration: number;
  opacity: number;
  height: number;
}

export interface PomodoroSettings {
  studyHours: number;
  breakMinutes: number;
  intervals: number;
  soundEnabled: boolean;
  autoStart: boolean;
}

export interface TimerState {
  isRunning: boolean;
  currentSeconds: number;
  totalSeconds: number;
  isBreak: boolean;
  currentInterval: number;
  totalIntervals: number;
  isCompleted: boolean;
  completedSessions: number;
  totalStudyTime: number;
}