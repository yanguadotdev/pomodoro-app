import { useContext, useEffect, useRef, useState } from "react"
import type { TimerState } from "../types"
import { useSound } from "./useSound"
import { calculateSessionDuration } from "@/lib/timer-utils"
import { ConfigContext, type ContextValueProps } from "@/context/configContext"

export function useTimer() {
  const { settings } = useContext(ConfigContext) as ContextValueProps
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    currentSeconds: 0,
    totalSeconds: 0,
    isBreak: false,
    currentInterval: 1,
    totalIntervals: settings.intervals,
    isCompleted: false,
    completedSessions: 0,
    totalStudyTime: 0
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { playNotificationSound } = useSound({ soundEnabled: settings.soundEnabled })

  const initializeTimer = () => {
    const sessionDuration = calculateSessionDuration(settings.studyHours, settings.intervals, settings.breakMinutes)
    setTimer({
      isRunning: false,
      currentSeconds: sessionDuration,
      totalSeconds: sessionDuration,
      isBreak: false,
      currentInterval: 1,
      totalIntervals: settings.intervals,
      isCompleted: false,
      completedSessions: 0,
      totalStudyTime: 0
    })
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }))
  }

  const resetTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }))
    initializeTimer()
  }

  useEffect(() => {
    initializeTimer()
  }, [settings])

  useEffect(() => {
    const sessionDuration = calculateSessionDuration(settings.studyHours, settings.intervals, settings.breakMinutes)
    const breakDuration = settings.breakMinutes * 60

    if (timer.isRunning && !timer.isCompleted) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.currentSeconds <= 1) {
            // Time finished
            playNotificationSound()

            if (prev.currentInterval === prev.totalIntervals) {
              return {
                ...prev,
                isRunning: false,
                isCompleted: true,
                currentSeconds: 0,
                completedSessions: prev.totalIntervals,
                totalStudyTime: settings.studyHours * 60
              }
            }

            if (prev.isBreak) {
              // Finish rest time and start study time
              return {
                ...prev,
                currentSeconds: sessionDuration,
                totalSeconds: sessionDuration,
                isBreak: false,
                currentInterval: prev.currentInterval + 1,
                isRunning: settings.autoStart
              }
            } else {
              // Finish study time and start rest time
              return {
                ...prev,
                currentSeconds: breakDuration,
                totalSeconds: breakDuration,
                isBreak: true,
                isRunning: settings.autoStart,
                completedSessions: prev.completedSessions + 1,
                totalStudyTime: prev.totalStudyTime + (calculateSessionDuration(settings.studyHours, settings.intervals, settings.breakMinutes) / 60)
              }
            }
          } else {
            return {
              ...prev,
              currentSeconds: prev.currentSeconds - 1
            }
          }
        })
      }, 10)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timer.isRunning, timer.isCompleted, settings])

  return {
    timer,
    formatTime,
    toggleTimer,
    resetTimer
  }
}