import { createContext, useContext, useEffect, useState } from "react"

interface ConfigBackgroundContextValue {
    imageUrl: string
    selectedIndex: number
    setSelectedIndex: (index: number) => void
    totalImages: number
}

const TOTAL_IMAGES = 3
const ConfigBackgroundContext = createContext<ConfigBackgroundContextValue | null>(null)

const loadIndex = () => {
    const storedIndex = localStorage.getItem("backgroundImageIndex")
    if (storedIndex !== null) {
        return parseInt(storedIndex)
    }
    return 1
}

export const ConfigBackgroundProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedIndex, setSelectedIndex] = useState(() => loadIndex())

    useEffect(() => {
        localStorage.setItem("backgroundImageIndex", selectedIndex.toString())
    }, [selectedIndex])

    const imageUrl = `/backgrounds/image-${selectedIndex.toString().padStart(2, '0')}.webp`

    return (
        <ConfigBackgroundContext.Provider value={
            {
                imageUrl,
                selectedIndex,
                setSelectedIndex,
                totalImages: TOTAL_IMAGES
            }}>
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
