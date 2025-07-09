import { useEffect, useRef } from 'react'
import { useAmbientSounds, type SoundType } from '@/context/ambientSoundContext'

export const useAudioManager = () => {
    const { sounds } = useAmbientSounds()
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
    }
}