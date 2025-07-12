import { useEffect } from "react"
import type { TimerState } from "../types"

interface DocumentTitleProps {
    timer: TimerState
    formatTime: (seconds: number) => string
}

const DEFAULT_TITLE = 'Focus Pomodoro - Mejora tu concentración con sonidos naturales'

export function useDocumentTitle({ timer, formatTime }: DocumentTitleProps) {
    useEffect(() => {
        if (timer.isRunning) {
            const timeStr = formatTime(timer.currentSeconds)
            const mode = timer.isBreak ? 'Descanso' : 'Estudio'
            document.title = `${timeStr} - ${mode} | Pomodoro Timer`
        } else {
            document.title = DEFAULT_TITLE
        }

        return () => {
            document.title = DEFAULT_TITLE
        }
    }, [timer.currentSeconds, timer.isBreak, timer.isRunning])
}