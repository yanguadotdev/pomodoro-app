import { useSettings } from "@/hooks"
import type { PomodoroSettings } from "@/types"
import { createContext } from "react"

export interface ContextValueProps {
    settings: PomodoroSettings
    setSettings: React.Dispatch<React.SetStateAction<PomodoroSettings>>
    tempSettings: PomodoroSettings
    setTempSettings: React.Dispatch<React.SetStateAction<PomodoroSettings>>
}

export const ConfigContext = createContext<ContextValueProps | null>(null)


export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
    const { settings, setSettings, tempSettings, setTempSettings } = useSettings()
    return (
        <ConfigContext.Provider value={{ settings, setSettings, tempSettings, setTempSettings }}>
            {children}
        </ConfigContext.Provider>
    )
}