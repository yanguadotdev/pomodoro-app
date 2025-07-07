import { useState, useEffect, useRef } from 'react';
import type { RainDrop } from '../types';

interface RainConfig {
  intensity: 'light' | 'medium' | 'heavy' | 'storm';
}

const rainConfigs = {
  light: { interval: 200, dropsPerInterval: 1, maxDrops: 50 },
  medium: { interval: 150, dropsPerInterval: 1, maxDrops: 80 },
  heavy: { interval: 100, dropsPerInterval: 2, maxDrops: 120 },
  storm: { interval: 30, dropsPerInterval: 4, maxDrops: 160 }
};

export const useRainEffect = (rainEnabled: boolean, intensity: RainConfig['intensity'] = 'medium') => {
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);
  const rainIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const config = rainConfigs[intensity];

  const createRainDrop = () => {
    const newDrop: RainDrop = {
      id: Date.now() + Math.random(),
      left: Math.random() * 100,
      animationDuration: Math.random() * 2 + 1.2,
      opacity: Math.random() * 0.6 + 0.2,        
      height: Math.random() * 100 + 60           
    };

    setRainDrops(prev => {
      const newDrops = [...prev, newDrop];
      return newDrops.length > config.maxDrops ? newDrops.slice(-config.maxDrops) : newDrops;
    });

    setTimeout(() => {
      setRainDrops(prev => prev.filter(drop => drop.id !== newDrop.id));
    }, newDrop.animationDuration * 1000);
  };

  const createMultipleDrops = () => {
    for (let i = 0; i < config.dropsPerInterval; i++) {
      setTimeout(() => createRainDrop(), i * 20);
    }
  };

  useEffect(() => {
    if (rainEnabled) {
      rainIntervalRef.current = setInterval(() => {
        createMultipleDrops();
      }, config.interval);
    } else {
      if (rainIntervalRef.current) clearInterval(rainIntervalRef.current);
      setRainDrops([]);
    }

    return () => {
      if (rainIntervalRef.current) clearInterval(rainIntervalRef.current);
    };
  }, [rainEnabled, intensity]);

  return { rainDrops, intensity };
};