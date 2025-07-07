import { useEffect } from "react"
import type { TimerState } from "../types"

interface DocumentTitleProps {
    timer: TimerState
    formatTime: (seconds: number) => string
}

export function useDocumentTitle({ timer, formatTime }: DocumentTitleProps) {
    useEffect(() => {
        if (timer.isRunning) {
            const timeStr = formatTime(timer.currentSeconds)
            const mode = timer.isBreak ? 'Descanso' : 'Estudio'
            document.title = `${timeStr} - ${mode} | Pomodoro Timer`
        } else {
            document.title = 'Pomodoro Timer'
        }

        return () => {
            document.title = 'Pomodoro Timer'
        }
    }, [timer.currentSeconds, timer.isBreak, timer.isRunning])
}