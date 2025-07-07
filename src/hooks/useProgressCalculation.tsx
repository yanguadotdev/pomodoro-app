import { useMemo } from 'react'
import type { TimerState } from '../types'

interface UseProgressCalculationProps {
  timer: TimerState
  radius?: number
}

export const useProgressCalculation = ({
  timer,
  radius = 120
}: UseProgressCalculationProps) => {
  return useMemo(() => {
    const progress = timer.totalSeconds > 0 
      ? ((timer.totalSeconds - timer.currentSeconds) / timer.totalSeconds) * 100 
      : 0
    
    const circumference = 2 * Math.PI * radius
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return {
      progress,
      radius,
      circumference,
      strokeDasharray,
      strokeDashoffset
    }
  }, [timer.totalSeconds, timer.currentSeconds, radius])
}