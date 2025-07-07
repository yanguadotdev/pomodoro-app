import { Check, Pause, Play, RotateCcw } from "lucide-react";
import type { TimerState } from "../types";
import Button from "./Button";

interface ClockAnimationProps {
    timer: TimerState;
    radius: number;
    strokeDasharray: number;
    strokeDashoffset: number;
    formatTime: (seconds: number) => string;
    toggleTimer: () => void;
    resetTimer: () => void;
}

export default function ClockAnimation({ timer, radius, strokeDasharray, strokeDashoffset, formatTime, toggleTimer, resetTimer }: ClockAnimationProps) {
    return (
        <div className="relative">
            <div className="flex flex-col items-center">
                {/* SVG circular clock */}
                <div className="relative">
                    <svg width="280" height="280" className="transform -rotate-90">
                        {/* Circle background */}
                        <circle
                            cx="140"
                            cy="140"
                            r={radius}
                            fill="transparent"
                            stroke="rgba(255, 255, 255, .2)"
                            strokeWidth="8"
                        />

                        {/* Circle progress */}
                        <circle
                            cx="140"
                            cy="140"
                            r={radius}
                            fill="transparent"
                            stroke={timer.isBreak ? "#10B981" : "#8B5CF6"}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                            style={{
                                filter: `drop-shadow(0 0 10px ${timer.isBreak ? '#10B981' : '#8B5CF6'})`
                            }}
                        />
                    </svg>

                    {/* Central content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {timer.isCompleted ? (
                            <div className="text-center">
                                <Check className="w-16 h-16 text-green-400 mx-auto mb-2" />
                                <p className="text-white text-lg font-semibold">¡Completado!</p>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-4">
                                    <p className="text-white text-sm opacity-80">
                                        {timer.isBreak ? 'Descanso' : 'Estudio'}
                                    </p>
                                    <p className="text-white text-xs opacity-60">
                                        Sesión {timer.currentInterval} de {timer.totalIntervals}
                                    </p>
                                </div>

                                <div className="text-5xl font-mono font-bold text-white mb-4">
                                    {formatTime(timer.currentSeconds)}
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        onClick={toggleTimer}
                                        variant="green"
                                    >
                                        {timer.isRunning
                                            ? <Pause className="size-7" />
                                            : <Play className="size-7" />
                                        }
                                    </Button>

                                    <Button
                                        onClick={resetTimer}
                                        variant="red"
                                    >
                                        <RotateCcw className="size-7" />
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}