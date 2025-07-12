import React, { useState } from 'react'
import { CloudRain } from 'lucide-react'
import ClockAnimation from './components/ClockAnimation'
import { useTimer, useDocumentTitle, useUIVisibility, useAudioManager } from './hooks'
import Button from './components/Button'
import RainEffect from './components/RainEffect'
import PomodoroConfig from '@/components/PomodoroConfig'
import AmbientSoundsModal from '@/components/AmbientSoundsModal'
import { motion, AnimatePresence } from 'motion/react'
import BackgroundSelector from './components/BackgroundSelector'
import { useConfigBackground } from './context/configBackgroundContext'

const PomodoroApp: React.FC = () => {
  const [rainEnabled, setRainEnabled] = useState(true)
  const { imageUrl } = useConfigBackground()

  // CUSTOM HOOKS
  const { timer, formatTime, toggleTimer, resetTimer } = useTimer()
  useDocumentTitle({ timer, formatTime })
  useAudioManager()
  const { showUI } = useUIVisibility(timer.isRunning)

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    >
      {rainEnabled && (
        <RainEffect rainEnabled={rainEnabled} />
      )}

      <Button
        onClick={() => setRainEnabled(!rainEnabled)}
        className={`absolute border-b-2 top-6 right-6 z-30`}
      >
        <CloudRain className={`size-5 ${rainEnabled ? 'text-blue-300' : 'text-gray-400'}`} />
      </Button>

      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <div className="p-8 w-full max-w-md relative">
          <ClockAnimation
            timer={timer}
            formatTime={formatTime}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
          />

          <div className="absolute top-4 right-4 size-8 rounded-full">
            <AnimatePresence>
              {
                showUI && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <PomodoroConfig />
                  </motion.div>
                )
              }
            </AnimatePresence>
          </div>
          <div className="absolute top-4 left-4 size-8 rounded-full">
            <AnimatePresence>
              {
                showUI && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <AmbientSoundsModal />
                  </motion.div>
                )
              }
            </AnimatePresence>


          </div>
          <div className="absolute bottom-4 left-4 size-8 rounded-full">
            <AnimatePresence>
              {
                showUI && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    <BackgroundSelector />
                  </motion.div>
                )
              }
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PomodoroApp