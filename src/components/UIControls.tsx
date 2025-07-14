import { lazy, memo } from "react"
import { motion, AnimatePresence } from "motion/react"
import Button from "@/components/Button"
import { CloudRain } from "lucide-react"
import AmbientSoundsProvider from "@/context/ambientSoundContext"

const PomodoroConfig = lazy(() => import('@/components/PomodoroConfig'))
const AmbientSoundsModal = lazy(() => import('@/components/AmbientSoundsModal'))
const BackgroundSelector = lazy(() => import('@/components/BackgroundSelector'))

const AbsoluteButton = memo(({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
        >
            {children}
        </motion.div>
    )
})

const UIControls = memo(({ showUI, rainEnabled, setRainEnabled }: { showUI: boolean, rainEnabled: boolean, setRainEnabled: () => void }) => {
    return (
        <AnimatePresence>
            <AmbientSoundsProvider>
                {showUI && (
                    <>
                        <div className="absolute top-4 right-4 rounded-full">
                            <AbsoluteButton>
                                <PomodoroConfig />
                            </AbsoluteButton>
                        </div>

                        <div className="absolute top-4 left-4 rounded-full">
                            <AbsoluteButton>
                                <AmbientSoundsModal />
                            </AbsoluteButton>
                        </div>

                        <div className="absolute bottom-4 left-4 rounded-full">
                            <AbsoluteButton>
                                <BackgroundSelector />
                            </AbsoluteButton>
                        </div>

                        <div className="absolute bottom-4 right-4 rounded-full">
                            <AbsoluteButton>
                                <Button aria-label="Alterna efecto de lluvia" onClick={setRainEnabled}>
                                    <CloudRain className={`size-5 ${rainEnabled ? 'text-blue-300' : 'text-gray-400'}`} />
                                </Button>
                            </AbsoluteButton>
                        </div>
                    </>
                )}
            </AmbientSoundsProvider>
        </AnimatePresence>
    )
})

UIControls.displayName = 'UIControls'
export default UIControls