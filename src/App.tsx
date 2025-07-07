import React, { useState } from 'react'
import { CloudRain } from 'lucide-react'
import { useRainEffect } from './hooks/useRainEffect'
import ClockAnimation from './components/ClockAnimation'
import { useTimer, useSettings, useDocumentTitle } from './hooks'
import Button from './components/Button'

const PomodoroApp: React.FC = () => {
  const { settings } = useSettings()
  const [rainEnabled, setRainEnabled] = useState(true)

  // CUSTOM HOOKS
  const { rainDrops } = useRainEffect(rainEnabled, 'storm')
  const { timer, formatTime, toggleTimer, resetTimer } = useTimer({ settings })
  useDocumentTitle({ timer, formatTime })

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/loffie-chill.webp')`
      }}
    >
      {rainEnabled && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {rainDrops.map(drop => (
            <div
              key={drop.id}
              className="absolute w-[.5px] bg-gradient-to-b from-transparent via-blue-200/60 to-transparent"
              style={{
                left: `${drop.left}%`,
                height: `${drop.height}px`,
                opacity: drop.opacity,
                animation: `rainFall ${drop.animationDuration}s linear`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>
      )}

      <Button
        onClick={() => setRainEnabled(!rainEnabled)}
        variant={rainEnabled ? 'blue' : 'black'}
        className={`absolute border-b-2 top-6 right-6 z-30`}
      >
        <CloudRain className={`size-5 ${rainEnabled ? 'text-blue-300' : 'text-gray-400'}`} />
      </Button>

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="p-8 w-full max-w-md">
          <div>
            <ClockAnimation
              timer={timer}
              formatTime={formatTime}
              toggleTimer={toggleTimer}
              resetTimer={resetTimer}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rainFall {
          0% {
            transform: translateY(-20px);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0.1;
          }
        }
      `}</style>
    </div>
  )
}

export default PomodoroApp