import { useState, lazy, Suspense, useMemo, useCallback, memo } from 'react'
import { CloudRain } from 'lucide-react'
import ClockAnimation from '@/components/ClockAnimation'
import { useTimer, useDocumentTitle, useUIVisibility } from '@/hooks'
import Button from '@/components/Button'
import RainEffect from '@/components/RainEffect'
import { motion, AnimatePresence } from 'motion/react'
import { useConfigBackground } from '@/context/configBackgroundContext'

const PomodoroConfig = lazy(() => import('@/components/PomodoroConfig'))
const AmbientSoundsModal = lazy(() => import('@/components/AmbientSoundsModal'))
const BackgroundSelector = lazy(() => import('@/components/BackgroundSelector'))

const AbsoluteButton = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        className="absolute inset-0"
      >
        {children}
      </motion.div>
    </Suspense>
  )
})
const LoadingSpinner = () => (
  <div className="size-8 rounded-full bg-gray-600/20 animate-pulse" />
)

const UIControls = memo(({ rainEnabled, setRainEnabled }: { rainEnabled: boolean, setRainEnabled: () => void }) => {
  return (
    <>
      <div className="absolute top-4 right-4 size-8 rounded-full">
        <AbsoluteButton>
          <PomodoroConfig />
        </AbsoluteButton>
      </div>

      <div className="absolute top-4 left-4 size-8 rounded-full">
        <AbsoluteButton>
          <AmbientSoundsModal />
        </AbsoluteButton>
      </div>

      <div className="absolute bottom-4 left-4 size-8 rounded-full">
        <AbsoluteButton>
          <BackgroundSelector />
        </AbsoluteButton>
      </div>

      <div className="absolute bottom-4 right-4 size-8 rounded-full">
        <AbsoluteButton>
          <Button onClick={setRainEnabled}>
            <CloudRain className={`size-5 ${rainEnabled ? 'text-blue-300' : 'text-gray-400'}`} />
          </Button>
        </AbsoluteButton>
      </div>
    </>
  )
})


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
        <div className="p-8 w-full max-w-md relative">
          <ClockAnimation
            timer={timer}
            formatTime={formatTime}
            toggleTimer={toggleTimer}
            resetTimer={resetTimer}
          />

          <AnimatePresence>
            {showUI && (
              <UIControls
                rainEnabled={rainEnabled}
                setRainEnabled={handleRainToggle}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default PomodoroApp