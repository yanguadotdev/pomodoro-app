import { createContext, useContext, useState } from 'react'

export type SoundType = 'rain' | 'fire' | 'water' | 'birds' | 'coffee' | 'keyboard'

export interface SoundConfig {
  id: SoundType
  name: string
  file: string
  volume: number
  isActive: boolean
}

interface AmbientSoundsContextType {
  sounds: SoundConfig[]
  toggleSound: (soundId: SoundType) => void
  setVolume: (soundId: SoundType, volume: number) => void
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
}

const AmbientSoundsContext = createContext<AmbientSoundsContextType | undefined>(undefined)

const initialSounds: SoundConfig[] = [
  { id: 'rain', name: 'Lluvia', file: '/sounds/rain.wav', volume: 0.5, isActive: false },
  { id: 'fire', name: 'Fuego', file: '/sounds/fire.mp3', volume: 0.5, isActive: false },
  { id: 'water', name: 'Agua', file: '/sounds/water.mp3', volume: 0.5, isActive: false },
  { id: 'birds', name: 'Pájaros', file: '/sounds/birds.mp3', volume: 0.5, isActive: false },
  { id: 'coffee', name: 'Café', file: '/sounds/coffee.mp3', volume: 0.5, isActive: false },
  { id: 'keyboard', name: 'Teclado', file: '/sounds/keyboard.mp3', volume: 0.5, isActive: false },
]

export function AmbientSoundsProvider({ children }: { children: React.ReactNode }) {
  const [sounds, setSounds] = useState<SoundConfig[]>(initialSounds)
  const [isModalOpen, setIsModalOpen] = useState(false)

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
        isModalOpen,
        setIsModalOpen,
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