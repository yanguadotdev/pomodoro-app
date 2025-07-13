import { useAudioManager } from '@/hooks'
import type { SoundConfig, SoundType } from '@/types'
import { createContext, useContext } from 'react'

interface AmbientSoundsContextType {
  sounds: SoundConfig[]
  toggleSound: (soundId: SoundType) => void
  setVolume: (soundId: SoundType, volume: number) => void
}

const AmbientSoundsContext = createContext<AmbientSoundsContextType | undefined>(undefined)


export default function AmbientSoundsProvider({ children }: { children: React.ReactNode }) {
  const { sounds, setSounds } = useAudioManager()

  const toggleSound = (soundId: SoundType) => {
    setSounds(prevSounds =>
      prevSounds.map(sound =>
        sound.id === soundId
          ? { ...sound, isActive: !sound.isActive }
          : sound
      )
    )
  }

  const setVolume = (soundId: SoundType, volume: number) => {
    setSounds(prevSounds =>
      prevSounds.map(sound =>
        sound.id === soundId
          ? { ...sound, volume }
          : sound
      )
    )
  }

  return (
    <AmbientSoundsContext.Provider
      value={{
        sounds,
        toggleSound,
        setVolume,
      }}
    >
      {children}
    </AmbientSoundsContext.Provider>
  )
}

export const useAmbientSounds = () => {
  const context = useContext(AmbientSoundsContext)
  if (context === undefined) {
    throw new Error('useAmbientSounds must be used within AmbientSoundsProvider')
  }
  return context
}