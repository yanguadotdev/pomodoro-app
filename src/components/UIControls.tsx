import { lazy, memo, Suspense } from "react"
import { motion } from "motion/react"
import Button from "@/components/Button"
import { CloudRain } from "lucide-react"

const PomodoroConfig = lazy(() => import('@/components/PomodoroConfig'))
const AmbientSoundsModal = lazy(() => import('@/components/AmbientSoundsModal'))
const BackgroundSelector = lazy(() => import('@/components/BackgroundSelector'))
const AmbientSoundsProvider = lazy(() => import('@/context/ambientSoundContext'))

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

const UIControls = memo(({ showUI, rainEnabled, setRainEnabled }: { showUI: boolean, rainEnabled: boolean, setRainEnabled: () => void }) => {
    return (
        <Suspense fallback={null}>
            <AmbientSoundsProvider>
                {showUI && (
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
                )}
            </AmbientSoundsProvider>
        </Suspense>
    )
})

export default UIControls