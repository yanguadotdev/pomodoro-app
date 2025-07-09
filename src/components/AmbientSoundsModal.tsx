import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useAmbientSounds } from "@/context/ambientSoundContext"
import { Volume2, VolumeX, Headphones } from "lucide-react"

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

                <div className="space-y-6 py-4">
                    {sounds.map((sound) => (
                        <div key={sound.id} className="space-y-3">
                            {/* Sound toggle */}
                            <div className="flex items-center justify-between">
                                <Label htmlFor={sound.id} className="text-base font-medium">
                                    {sound.name}
                                </Label>
                                <Switch
                                    id={sound.id}
                                    checked={sound.isActive}
                                    onCheckedChange={() => toggleSound(sound.id)}
                                />
                            </div>

                            {/* Volume control */}
                            <div className="flex items-center space-x-3">
                                <VolumeX className="w-4 h-4 text-gray-400" />
                                <Slider
                                    value={[sound.volume]}
                                    onValueChange={(value) => setVolume(sound.id, value[0])}
                                    max={1}
                                    min={0}
                                    step={0.1}
                                    className="flex-1"
                                    disabled={!sound.isActive}
                                />
                                <Volume2 className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-400 w-10">
                                    {Math.round(sound.volume * 100)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-xs text-gray-400 mt-4">
                    Los sonidos ambientales pueden ayudarte a mantener la concentración durante tus sesiones de estudio.
                </div>
            </DialogContent>
        </Dialog>
    )
}