import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useAmbientSounds } from "@/context/ambientSoundContext"
import { Coffee, Headphones, Keyboard } from "lucide-react"
import { CloudRain, FlameKindling, Waves, Bird } from "lucide-react"
import { Label } from "@/components/ui/label"
import Button from "@/components/Button"
import { useMediaQuery } from "@/hooks"
import { useState } from "react"

const soundIcons = {
    rain: CloudRain,
    fire: FlameKindling,
    water: Waves,
    birds: Bird,
    coffee: Coffee,
    keyboard: Keyboard,
}

export default function AmbientSoundsModal() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Headphones className="size-7 transition-transform duration-300" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="md:max-w-[425px] text-center">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-center">
                            Sonidos Ambientales
                        </DialogTitle>
                    </DialogHeader>
                    <GridSounds />

                    <div className="text-xs text-gray-400 mt-8 text-balance">
                        Los sonidos ambientales pueden ayudarte a mantener la concentración durante tus sesiones de estudio.
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DrawerTrigger asChild>
                <Button>
                    <Headphones className="size-7 transition-transform duration-300" />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="md:max-w-[425px] text-center">
                <DrawerHeader>
                    <DrawerTitle className="text-xl font-semibold">
                        Sonidos Ambientales
                    </DrawerTitle>
                </DrawerHeader>

                <GridSounds />

                <div className="text-xs text-gray-400 mt-8 text-balance">
                    Los sonidos ambientales pueden ayudarte a mantener la concentración durante tus sesiones de estudio.
                </div>
            </DrawerContent>
        </Drawer>
    )
}

function GridSounds() {
    const { sounds, toggleSound, setVolume } = useAmbientSounds()

    return (
        <div className="grid grid-cols-3 gap-8 gap-y-10 px-4 pb-4">
            {sounds.map((sound) => {
                const Icon = soundIcons[sound.id]
                return (
                    <div key={sound.id} className="flex flex-col items-center relative">
                        <Label htmlFor={sound.id} className="text-xs font-medium mb-1">{sound.name}</Label>
                        <Toggle
                            id={sound.id}
                            pressed={sound.isActive}
                            onPressedChange={() => toggleSound(sound.id)}
                        >
                            <Icon className="size-6" />
                        </Toggle>
                        {
                            sound.isActive && (
                                <Slider
                                    value={[sound.volume]}
                                    onValueChange={(value) => setVolume(sound.id, value[0])}
                                    max={1}
                                    min={0}
                                    step={0.1}
                                    className="absolute -bottom-4 inset-x-0 max-w-18 mx-auto"
                                />
                            )
                        }
                    </div>
                )
            })}
        </div>
    )
}