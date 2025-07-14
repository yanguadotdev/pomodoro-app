import { useState, useMemo, useCallback } from 'react'
import ClockAnimation from '@/components/ClockAnimation'
import { useTimer, useDocumentTitle, useUIVisibility } from '@/hooks'
import RainEffect from '@/components/RainEffect'
import { useConfigBackground } from '@/context/configBackgroundContext'
import UIControls from '@/components/UIControls'

const PomodoroApp: React.FC = () => {
  const [rainEnabled, setRainEnabled] = useState(true)
  const { imageUrl } = useConfigBackground()

  // CUSTOM HOOKS
  const { timer, formatTime, toggleTimer, resetTimer } = useTimer()
  useDocumentTitle({ timer, formatTime })
  const { showUI } = useUIVisibility(timer.isRunning)

  const backgroundStyle = useMemo(() => ({
    backgroundImage: `url(${imageUrl})`,
  }), [imageUrl])

  const handleRainToggle = useCallback(() => {
    setRainEnabled(prev => !prev)
  }, [])

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={backgroundStyle}
    >
      {rainEnabled && (
        <RainEffect rainEnabled={rainEnabled} />
      )}

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="p-8 w-full max-w-md relative before:absolute before:inset-0 before:bg-black/60 before:blur-[100px]">
          <ClockAnimation
            timer={timer}
            formatTime={formatTime}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
          />
          <UIControls
            showUI={showUI}
            rainEnabled={rainEnabled}
            setRainEnabled={handleRainToggle}
          />
        </div>
      </div>
    </div>
  )
}

export default PomodoroApp