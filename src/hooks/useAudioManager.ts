import { useEffect, useRef, useState } from 'react'
import type { SoundConfig, SoundType } from '@/types'

const initialSounds: SoundConfig[] = [
    { id: 'rain', name: 'Lluvia', file: '/sounds/rain.wav', volume: 0.5, isActive: false },
    { id: 'fire', name: 'Fuego', file: '/sounds/fire.mp3', volume: 0.5, isActive: false },
    { id: 'water', name: 'Agua', file: '/sounds/water.mp3', volume: 0.5, isActive: false },
    { id: 'birds', name: 'Pájaros', file: '/sounds/birds.mp3', volume: 0.5, isActive: false },
    { id: 'coffee', name: 'Café', file: '/sounds/coffee.mp3', volume: 0.5, isActive: false },
    { id: 'keyboard', name: 'Teclado', file: '/sounds/keyboard.mp3', volume: 0.5, isActive: false },
]

export const useAudioManager = () => {
    const [sounds, setSounds] = useState(initialSounds)
    const audioRefs = useRef<{ [key in SoundType]?: HTMLAudioElement }>({})

    // Initialize audios only once
    useEffect(() => {
        initialSounds.forEach(sound => {
            const audio = new Audio(sound.file)
            audio.loop = true
            audio.preload = 'auto'
            audioRefs.current[sound.id] = audio
        })

        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                audio?.pause()
                audio.currentTime = 0
            })
        }
    }, [])

    // Volume
    useEffect(() => {
        sounds.forEach(({ id, volume }) => {
            const audio = audioRefs.current[id]
            if (audio) audio.volume = volume
        })
    }, [sounds])

    // Play/Pause
    useEffect(() => {
        sounds.forEach(({ id, isActive }) => {
            const audio = audioRefs.current[id]
            if (!audio) return

            if (isActive) {
                audio.play().catch(e => console.error(`Error playing ${id}`, e))
            } else {
                audio.pause()
            }
        })
    }, [sounds])

    const pauseAllSounds = () => {
        Object.values(audioRefs.current).forEach(audio => audio?.pause())
    }

    const resumeActiveSounds = () => {
        sounds.forEach(({ id, isActive }) => {
            if (isActive) {
                const audio = audioRefs.current[id]
                audio?.play().catch(e => console.error(`Error playing ${id}`, e))
            }
        })
    }

    return {
        sounds,
        setSounds,
        pauseAllSounds,
        resumeActiveSounds
    }
}
