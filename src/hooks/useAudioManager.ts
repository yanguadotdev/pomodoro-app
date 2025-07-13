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
    const [sounds, setSounds] = useState<SoundConfig[]>(initialSounds)

    const audioRefs = useRef<{ [key in SoundType]?: HTMLAudioElement }>({})

    useEffect(() => {
        sounds.forEach(sound => {
            if (!audioRefs.current[sound.id]) {
                const audio = new Audio(sound.file)
                audio.loop = true
                audio.preload = 'auto'
                audioRefs.current[sound.id] = audio
            }
        })
        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                if (audio) {
                    audio.pause()
                    audio.currentTime = 0
                }
            })
        }
    }, [sounds])

    useEffect(() => {
        sounds.forEach(sound => {
            const audio = audioRefs.current[sound.id]
            if (!audio) return
            audio.volume = sound.volume

            if (sound.isActive) {
                audio.play().catch(error => {
                    console.error(`Error playing ${sound.id}:`, error)
                })
            } else {
                audio.pause()
            }
        })
    }, [sounds])

    const pauseAllSounds = () => {
        Object.values(audioRefs.current).forEach(audio => {
            if (audio) {
                audio.pause()
            }
        })
    }

    const resumeActiveSounds = () => {
        sounds.forEach(sound => {
            if (sound.isActive) {
                const audio = audioRefs.current[sound.id]
                if (audio) {
                    audio.play().catch(error => {
                        console.error(`Error resuming ${sound.id}:`, error)
                    })
                }
            }
        })
    }

    return {
        pauseAllSounds,
        resumeActiveSounds,
        sounds,
        setSounds
    }
}