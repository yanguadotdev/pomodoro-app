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

import { useState, useRef } from "react"
import { useMediaQuery } from "@/hooks"
import { useConfigBackground } from "@/context/configBackgroundContext"
import { cn } from "@/lib/utils"
import Button from "@/components/Button"
import { ImageIcon, Upload, X } from "lucide-react"

export default function BackgroundSelector() {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [open, setOpen] = useState(false)
    const { selectedIndex, setSelectedIndex, totalImages, imageUrls, customImage, setCustomImage } = useConfigBackground()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const thumbnails = Array.from({ length: totalImages }, (_, i) => i)

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            // Validate file type is an image
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecciona solo archivos de imagen.')
                return
            }

            // Validate file size is less than 5MB
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo es demasiado grande. El tamaño máximo es 5MB.')
                return
            }

            const reader = new FileReader()
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string
                setCustomImage(imageUrl)
                // Automatically select the uploaded image
                const newIndex = customImage ? totalImages - 1 : totalImages
                setSelectedIndex(newIndex)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveCustomImage = () => {
        setCustomImage(null)
        // If the custom image was selected, change to the first default background
        if (customImage && selectedIndex === totalImages - 1) {
            setSelectedIndex(0)
        }
    }

    const Grid = () => (
        <div className="grid grid-cols-3 gap-3 mt-4">
            {thumbnails.map(index => {
                const isCustomImage = customImage && index === totalImages - 1

                return (
                    <div
                        key={index}
                        className="relative"
                    >
                        <button
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                                "rounded-md overflow-hidden border transition-all w-full",
                                selectedIndex === index
                                    ? "border-orange-500 ring-1 ring-orange-400"
                                    : "border-orange-400/40"
                            )}
                        >
                            <img
                                src={imageUrls[index]}
                                alt={isCustomImage ? "Imagen personalizada" : `Fondo ${index}`}
                                className="object-cover w-full h-20 transition-transform duration-300 hover:transform-[scale(1.2)_rotate(5deg)]"
                            />
                        </button>
                        {isCustomImage && (
                            <button
                                onClick={handleRemoveCustomImage}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                                title="Eliminar imagen personalizada"
                            >
                                <X className="size-3" />
                            </button>
                        )}
                    </div>
                )
            })}

            {/* Botón para subir imagen personalizada como elemento de la grid */}
            <div className="relative">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-20 border border-orange-400/40 rounded-md hover:border-orange-500 transition-colors flex items-center justify-center bg-black/20 hover:bg-black/30"
                    title="Subir imagen personalizada"
                >
                    <Upload className="size-6 text-orange-400" />
                </button>
            </div>
        </div>
    )

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button aria-label="Personaliza el fondo">
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
                <Button aria-label="Personaliza el fondo">
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
                <p className="text-xs text-gray-400 mt-8 text-balance text-center px-4 pb-4">
                    <span className="font-semibold">Consejo:</span> Asegúrate de subir una imagen con buen contraste para que el contenido sea legible. Fondos muy claros pueden dificultar la visibilidad del temporizador y otros elementos.
                </p>
            </DrawerContent>
        </Drawer>
    )
}