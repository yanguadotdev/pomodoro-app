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
    const { selectedIndex, setSelectedIndex, totalImages } = useConfigBackground()

    const thumbnails = Array.from({ length: totalImages }, (_, i) => i + 1)

    const Grid = () => (
        <div className="grid grid-cols-3 gap-3 mt-4">
            {thumbnails.map(index => (
                <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={cn(
                        "rounded-md overflow-hidden border-2 transition-all",
                        selectedIndex === index
                            ? "border-purple-500 ring-2 ring-purple-400"
                            : "border-transparent hover:border-white/40"
                    )}
                >
                    <img
                        src={`/backgrounds/image-${index.toString().padStart(2, '0')}.webp`}
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
                        <DialogTitle>Seleccionar fondo</DialogTitle>
                    </DialogHeader>
                    <Grid />
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
                <DrawerHeader className="text-left">
                    <DrawerTitle>Seleccionar fondo</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                    <Grid />
                </div>
            </DrawerContent>
        </Drawer>
    )
}
