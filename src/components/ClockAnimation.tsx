import { Pause, Play, RotateCcw } from "lucide-react"
import type { TimerState } from "../types"
import { useProgressCalculation } from "../hooks"
import SpecialButton from "./SpecialButton"
import Lottie from "lottie-react"
import completeSessionAnimation from "../../public/lotties/complete-session.json"

interface ClockAnimationProps {
    timer: TimerState
    formatTime: (seconds: number) => string
    toggleTimer: () => void
    resetTimer: () => void
}

export default function ClockAnimation({ timer, formatTime, toggleTimer, resetTimer }: ClockAnimationProps) {
    const { radius, strokeDasharray, strokeDashoffset } = useProgressCalculation({ timer })

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
                            stroke={timer.isBreak ? "#10B981" : "#ff6900"}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                            style={{
                                filter: `drop-shadow(0 0 10px ${timer.isBreak ? '#10B981' : '#ff6900'})`
                            }}
                        />
                    </svg>

                    {/* Central content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {timer.isCompleted ? (
                            <div className="text-center">
                                <Lottie
                                    className="size-full"
                                    animationData={completeSessionAnimation}
                                    loop={false}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-4">
                                    <p className="text-white text-shadow-accent text-sm">
                                        {timer.isBreak ? 'Descanso' : 'Estudio'}
                                    </p>
                                    <p className="text-white text-xs opacity-80 text-shadow-accent">
                                        Sesión {timer.currentInterval} de {timer.totalIntervals}
                                    </p>
                                </div>

                                <div className="text-5xl font-mono font-bold text-white mb-4">
                                    {formatTime(timer.currentSeconds)}
                                </div>

                                <div className="flex items-center gap-4">
                                    <SpecialButton
                                        onClick={toggleTimer}
                                        className="bg-green-800 backdrop-blur-xs"
                                        rounded
                                        variant="green"
                                    >
                                        {timer.isRunning
                                            ? <Pause className="size-7" />
                                            : <Play className="size-7" />
                                        }
                                    </SpecialButton>

                                    <SpecialButton
                                        onClick={resetTimer}
                                        className="bg-red-800 backdrop-blur-xs"
                                        rounded
                                        variant="red"
                                    >
                                        <RotateCcw className="size-7" />
                                    </SpecialButton>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}