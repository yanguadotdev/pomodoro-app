import { createContext, useContext, useEffect, useState } from "react"

interface ConfigBackgroundContextValue {
    imageUrl: string
    selectedIndex: number
    setSelectedIndex: (index: number) => void
    totalImages: number
    imageUrls: string[]
}

// Importa automáticamente todas las imágenes
const imageModules = import.meta.glob('/src/assets/backgrounds/*.webp', {
    eager: true,
    as: 'url'
})
const imageUrls = Object.values(imageModules) as string[]

const loadIndex = () => {
    const storedIndex = localStorage.getItem("backgroundImageIndex")
    if (storedIndex !== null) {
        return parseInt(storedIndex)
    }
    return 0
}

const ConfigBackgroundContext = createContext<ConfigBackgroundContextValue | null>(null)

export const ConfigBackgroundProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedIndex, setSelectedIndex] = useState(() => loadIndex())

    useEffect(() => {
        localStorage.setItem("backgroundImageIndex", selectedIndex.toString())
    }, [selectedIndex])

    const imageUrl = imageUrls[selectedIndex]

    return (
        <ConfigBackgroundContext.Provider
            value={{
                imageUrl,
                selectedIndex,
                setSelectedIndex,
                totalImages: imageUrls.length,
                imageUrls
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
