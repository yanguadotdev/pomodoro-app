import { useEffect, useState } from "react"
import type { PomodoroSettings, TimerState } from "../types"

export function useTimer() {
  const [settings, setSettings] = useState<PomodoroSettings>({
    studyHours: 1,
    breakMinutes: 10,
    intervals: 2,
    soundEnabled: true,
    autoStart: true
  })
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    currentSeconds: 0,
    totalSeconds: 0,
    isBreak: false,
    currentInterval: 1,
    totalIntervals: 2,
    isCompleted: false,
    completedSessions: 0,
    totalStudyTime: 0
  })

  // Calculate duration of each session removing break time
  const calculateSessionDuration = (hours: number, intervals: number, breakMinutes: number = settings.breakMinutes): number => {
    const totalTimeMinutes = hours * 60
    const totalBreakTime = (intervals - 1) * breakMinutes
    const totalStudyTime = totalTimeMinutes - totalBreakTime
    return (totalStudyTime * 60) / intervals
  }

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

  return {
    timer,
    setTimer,
    settings,
    setSettings,
    initializeTimer,
    calculateSessionDuration,
    toggleTimer,
    resetTimer
  }
}