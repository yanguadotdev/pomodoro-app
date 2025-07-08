import { useState } from "react";
import type { PomodoroSettings } from "../types";

export function useSettings() {
    const [settings, setSettings] = useState<PomodoroSettings>({
        studyHours: 1,
        breakMinutes: 10,
        intervals: 2,
        soundEnabled: true,
        autoStart: false
    })
    const [showSettings, setShowSettings] = useState(false);
    const [tempSettings, setTempSettings] = useState<PomodoroSettings>(settings);
    
    return {
        settings,
        setSettings,
        showSettings,
        setShowSettings,
        tempSettings,
        setTempSettings
    }
}