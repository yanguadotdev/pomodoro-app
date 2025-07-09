import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '@/hooks'

export function useUIVisibility(isRunning: boolean) {
    const isDesktop = useMediaQuery('(min-width: 768px)')
    const [showUI, setShowUI] = useState(true)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (!isDesktop) {
            setShowUI(true)
            return
        }

        const resetInactivityTimer = () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            setShowUI(true)

            if (isRunning) {
                timeoutRef.current = setTimeout(() => {
                    setShowUI(false)
                }, 5000)
            }
        }

        if (isRunning) {
            document.addEventListener('mousemove', resetInactivityTimer)
            document.addEventListener('mousedown', resetInactivityTimer)
            document.addEventListener('keydown', resetInactivityTimer)
            document.addEventListener('touchstart', resetInactivityTimer)

            // Trigger once on mount to start countdown if idle
            resetInactivityTimer()
        } else {
            setShowUI(true)
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
            document.removeEventListener('mousemove', resetInactivityTimer)
            document.removeEventListener('mousedown', resetInactivityTimer)
            document.removeEventListener('keydown', resetInactivityTimer)
            document.removeEventListener('touchstart', resetInactivityTimer)
        }
    }, [isRunning, isDesktop])

    return { showUI }
}
