import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import { useState } from "react"
import { useMediaQuery } from "@/hooks"
import { useConfigBackground } from "@/context/configBackgroundContext"
import { cn } from "@/lib/utils"
import Button from "@/components/Button"
import { ImageIcon } from "lucide-react"

export default function BackgroundSelector() {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [open, setOpen] = useState(false)
    const { selectedIndex, setSelectedIndex, totalImages, imageUrls } = useConfigBackground()

    const thumbnails = Array.from({ length: totalImages }, (_, i) => i)

    const Grid = () => (
        <div className="grid grid-cols-3 gap-3 mt-4">
            {thumbnails.map(index => (
                <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={cn(
                        "rounded-md overflow-hidden border transition-all",
                        selectedIndex === index
                            ? "border-orange-500 ring-1 ring-orange-400"
                            : "border-orange-400/40"
                    )}
                >
                    <img
                        src={imageUrls[index]}
                        alt={`Fondo ${index}`}
                        className="object-cover w-full h-20"
                    />
                </button>
            ))}
        </div>
    )

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <ImageIcon className="size-6" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-center">Seleccionar fondo</DialogTitle>
                    </DialogHeader>
                    <Grid />
                    <p className="text-xs text-gray-400 mt-8 text-balance text-center">
                        <span className="font-semibold">Consejo:</span> Asegúrate de subir una imagen con buen contraste para que el contenido sea legible. Fondos muy claros pueden dificultar la visibilidad del temporizador y otros elementos.
                    </p>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>
                    <ImageIcon className="size-6" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-center">
                    <DrawerTitle>Seleccionar fondo</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                    <Grid />
                </div>
                <p className="text-xs text-gray-400 mt-8 text-balance text-center">
                    <span className="font-semibold">Consejo:</span> Asegúrate de subir una imagen con buen contraste para que el contenido sea legible. Fondos muy claros pueden dificultar la visibilidad del temporizador y otros elementos.
                </p>
            </DrawerContent>
        </Drawer>
    )
}
