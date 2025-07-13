import { createContext, useContext, useEffect, useState } from "react"

interface ConfigBackgroundContextValue {
    imageUrl: string
    selectedIndex: number
    setSelectedIndex: (index: number) => void
    totalImages: number
    imageUrls: string[]
    customImage: string | null
    setCustomImage: (imageUrl: string | null) => void
}

// Importa automáticamente todas las imágenes
const imageModules = import.meta.glob('/src/assets/backgrounds/*.webp', {
    eager: true,
    as: 'url'
})
const defaultImageUrls = Object.values(imageModules) as string[]

const loadIndex = () => {
    const storedIndex = localStorage.getItem("backgroundImageIndex")
    if (storedIndex !== null) {
        return parseInt(storedIndex)
    }
    return 0
}

const loadCustomImage = (): string | null => {
    const storedCustomImage = localStorage.getItem("customBackgroundImage")
    return storedCustomImage || null
}

const ConfigBackgroundContext = createContext<ConfigBackgroundContextValue | null>(null)

export const ConfigBackgroundProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedIndex, setSelectedIndex] = useState(() => loadIndex())
    const [customImage, setCustomImage] = useState<string | null>(() => loadCustomImage())

    useEffect(() => {
        localStorage.setItem("backgroundImageIndex", selectedIndex.toString())
    }, [selectedIndex])

    useEffect(() => {
        if (customImage) {
            localStorage.setItem("customBackgroundImage", customImage)
        } else {
            localStorage.removeItem("customBackgroundImage")
        }
    }, [customImage])

    // Combina imágenes por defecto con la imagen personalizada
    const imageUrls = customImage ? [...defaultImageUrls, customImage] : defaultImageUrls
    const imageUrl = imageUrls[selectedIndex]

    return (
        <ConfigBackgroundContext.Provider
            value={{
                imageUrl,
                selectedIndex,
                setSelectedIndex,
                totalImages: imageUrls.length,
                imageUrls,
                customImage,
                setCustomImage
            }}
        >
            {children}
        </ConfigBackgroundContext.Provider>
    )
}

export const useConfigBackground = () => {
    const context = useContext(ConfigBackgroundContext)
    if (!context) {
        throw new Error("useConfigBackground must be used within a ConfigBackgroundProvider")
    }
    return context
}