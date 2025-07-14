import { Pause, Play, RotateCcw } from "lucide-react"
import type { TimerState } from "../types"
import { useProgressCalculation } from "../hooks"
import SpecialButton from "./SpecialButton"
import { useEffect, useState, lazy, Suspense } from "react"
import { AnimatePresence, motion } from "motion/react"

const LazyLottie = lazy(() => import("lottie-react"))

interface ClockAnimationProps {
    timer: TimerState
    formatTime: (seconds: number) => string
    toggleTimer: () => void
    resetTimer: () => void
}

export default function ClockAnimation({ timer, formatTime, toggleTimer, resetTimer }: ClockAnimationProps) {
    const { radius, strokeDasharray, strokeDashoffset } = useProgressCalculation({ timer })
    const [animationData, setAnimationData] = useState<any | null>(null)

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>

        if (timer.isCompleted) {
            // ⏳ Import animation of 
            import("@/assets/lotties/complete-session.json").then((mod) => {
                setAnimationData(mod.default)
            })

            timeout = setTimeout(() => {
                resetTimer()
            }, 2000)
        }

        return () => clearTimeout(timeout)
    }, [timer.isCompleted])

    return (
        <div className="relative">
            <div className="flex flex-col items-center">
                {/* SVG circular clock */}
                <div className="relative">
                    <svg width="280" height="280" className="transform -rotate-90">
                        <circle
                            cx="140"
                            cy="140"
                            r={radius}
                            fill="rgba(0, 0, 0, .5)"
                            stroke="rgba(255, 255, 255, .25)"
                            strokeWidth="8"
                        />
                        <circle
                            cx="140"
                            cy="140"
                            r={radius}
                            fill="transparent"
                            stroke={timer.isBreak ? "#10B981" : "#9810fa"}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                            style={{
                                filter: `drop-shadow(0 0 10px ${timer.isBreak ? '#10B981' : '#9810fa'})`
                            }}
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <AnimatePresence>
                            {timer.isCompleted ? (
                                <div className="text-center -mt-12">
                                    <Suspense fallback={null}>
                                        {animationData && (
                                            <LazyLottie
                                                className="size-48"
                                                animationData={animationData}
                                                loop={false}
                                            />
                                        )}
                                    </Suspense>
                                    <p className="text-white text-lg font-semibold -mt-12">¡Completado!</p>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ duration: .4, damping: 12, type: 'spring', stiffness: 100 }}
                                >
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
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
