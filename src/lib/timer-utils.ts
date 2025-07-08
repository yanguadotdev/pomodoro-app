// Calculate duration of each session removing break time
export const calculateSessionDuration = (hours: number, intervals: number, breakMinutes: number): number => {
    const totalTimeMinutes = hours * 60
    const totalBreakTime = (intervals - 1) * breakMinutes
    const totalStudyTime = totalTimeMinutes - totalBreakTime
    return (totalStudyTime * 60) / intervals
}