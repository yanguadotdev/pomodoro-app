export interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  isActive: boolean;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  cycles: number;
}

export interface RainDrop {
  id: number;
  left: number;
  animationDuration: number;
  opacity: number;
  height: number;
}