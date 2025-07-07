import { useEffect, useRef, useCallback } from 'react'

interface RainDrop {
  id: number
  x: number
  y: number
  speed: number
  opacity: number
  height: number
  width: number
}

interface RainConfig {
  intensity: 'light' | 'medium' | 'heavy' | 'storm'
}

const rainConfigs = {
  light: { interval: 200, dropsPerInterval: 1, maxDrops: 50, baseSpeed: 2 },
  medium: { interval: 150, dropsPerInterval: 1, maxDrops: 80, baseSpeed: 3 },
  heavy: { interval: 100, dropsPerInterval: 2, maxDrops: 120, baseSpeed: 4 },
  storm: { interval: 30, dropsPerInterval: 4, maxDrops: 160, baseSpeed: 5 }
}

export const useRainEffect = (
  rainEnabled: boolean, 
  intensity: RainConfig['intensity'] = 'medium'
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const rainIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const rainDropsRef = useRef<RainDrop[]>([])
  const config = rainConfigs[intensity]

  const createRainDrop = useCallback((canvasWidth: number) => {
    const newDrop: RainDrop = {
      id: Date.now() + Math.random(),
      x: Math.random() * canvasWidth,
      y: -20,
      speed: 8 + Math.random() * 14,
      opacity: Math.random() * 0.6 + 0.2,
      height: Math.random() * 20 + 10,
      width: 1
    }

    rainDropsRef.current = [...rainDropsRef.current, newDrop]
    
    // Limit max number of drops
    if (rainDropsRef.current.length > config.maxDrops) {
      rainDropsRef.current = rainDropsRef.current.slice(-config.maxDrops)
    }
  }, [config])

  const createMultipleDrops = useCallback((canvasWidth: number) => {
    for (let i = 0; i < config.dropsPerInterval; i++) {
      setTimeout(() => createRainDrop(canvasWidth), i * 20)
    }
  }, [config, createRainDrop])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update drop positions
    rainDropsRef.current = rainDropsRef.current
      .map(drop => ({
        ...drop,
        y: drop.y + drop.speed
      }))
      .filter(drop => drop.y < canvas.height + 20)

    // Draw drops
    rainDropsRef.current.forEach(drop => {
      ctx.save()
      ctx.globalAlpha = drop.opacity
      ctx.fillStyle = '#f2f2f2'
      ctx.fillRect(drop.x, drop.y, drop.width, drop.height)
      ctx.restore()
    })

    if (rainEnabled) {
      animationFrameRef.current = requestAnimationFrame(animate)
    }
  }, [rainEnabled])

  // Main effect
  useEffect(() => {
    if (rainEnabled && canvasRef.current) {
      const canvas = canvasRef.current
      
      // Ensure canvas has correct size
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      
      // Create drops periodically
      rainIntervalRef.current = setInterval(() => {
        createMultipleDrops(canvas.width)
      }, config.interval)

      // Start animation
      animate()
    } else {
      // Clear when disabled
      if (rainIntervalRef.current) {
        clearInterval(rainIntervalRef.current)
        rainIntervalRef.current = null
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      rainDropsRef.current = []
    }

    return () => {
      if (rainIntervalRef.current) clearInterval(rainIntervalRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [rainEnabled, intensity, config, animate])

  // Resize canvas when window size changes
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { 
    canvasRef,
    rainDropsCount: rainDropsRef.current.length,
    intensity 
  }
}