import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Toggle } from "@/components/ui/toggle"
import { useAmbientSounds } from "@/context/ambientSoundContext"
import { Coffee, Headphones, Keyboard } from "lucide-react"
import { CloudRain, FlameKindling, Waves, Bird } from "lucide-react"
import { Label } from "./ui/label"

const soundIcons = {
    rain: CloudRain,
    fire: FlameKindling,
    water: Waves,
    birds: Bird,
    coffee: Coffee,
    keyboard: Keyboard,
}

export default function AmbientSoundsModal() {
    const { sounds, toggleSound, setVolume, isModalOpen, setIsModalOpen } = useAmbientSounds()

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <button className="text-white group">
                    <Headphones className="size-7 transition-transform duration-300" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900/95 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Sonidos Ambientales
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-3 gap-8 gap-y-10">
                    {sounds.map((sound) => {
                        const Icon = soundIcons[sound.id]
                        return (
                            <div key={sound.id} className="flex flex-col items-center relative">
                                {/* Sound toggle */}
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

                <div className="text-xs text-gray-400 mt-8">
                    Los sonidos ambientales pueden ayudarte a mantener la concentración durante tus sesiones de estudio.
                </div>
            </DialogContent>
        </Dialog>
    )
}