import React, { useState } from 'react'
import { CloudRain } from 'lucide-react'
import ClockAnimation from './components/ClockAnimation'
import { useTimer, useSettings, useDocumentTitle } from './hooks'
import Button from './components/Button'
import RainEffect from './components/RainEffect'
import PomodoroConfig from '@/components/PomodoroConfig'

const PomodoroApp: React.FC = () => {
  const { settings } = useSettings()
  const [rainEnabled, setRainEnabled] = useState(true)

  // CUSTOM HOOKS
  const { timer, formatTime, toggleTimer, resetTimer } = useTimer({ settings })
  useDocumentTitle({ timer, formatTime })

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/loffie-chill.webp')`
      }}
    >
      {rainEnabled && (
        <RainEffect rainEnabled={rainEnabled} />
      )}

      <Button
        onClick={() => setRainEnabled(!rainEnabled)}
        variant={rainEnabled ? 'blue' : 'black'}
        className={`absolute border-b-2 top-6 right-6 z-30`}
      >
        <CloudRain className={`size-5 ${rainEnabled ? 'text-blue-300' : 'text-gray-400'}`} />
      </Button>

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="p-8 w-full max-w-md bg-black/20 backdrop-blur-xs rounded-xl relative">
          <ClockAnimation
            timer={timer}
            formatTime={formatTime}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
          />

          <div className="absolute top-4 right-4 size-8 rounded-full">
            <PomodoroConfig />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PomodoroApp