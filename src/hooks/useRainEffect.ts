import { useState, useEffect, useRef } from 'react';
import type { RainDrop } from '../types';

export const useRainEffect = (rainEnabled: boolean) => {
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);
  const rainIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const createRainDrop = () => {
    const newDrop: RainDrop = {
      id: Date.now() + Math.random(),
      left: Math.random() * 100,
      animationDuration: Math.random() * 2 + 1.5,
      opacity: Math.random() * 0.6 + 0.2,
      height: Math.random() * 80 + 40
    };

    setRainDrops(prev => [...prev, newDrop]);

    setTimeout(() => {
      setRainDrops(prev => prev.filter(drop => drop.id !== newDrop.id));
    }, newDrop.animationDuration * 1000);
  };

  useEffect(() => {
    if (rainEnabled) {
      rainIntervalRef.current = setInterval(() => {
        createRainDrop();
      }, 150);
    } else {
      if (rainIntervalRef.current) clearInterval(rainIntervalRef.current);
      setRainDrops([]);
    }

    return () => {
      if (rainIntervalRef.current) clearInterval(rainIntervalRef.current);
    };
  }, [rainEnabled]);

  return { rainDrops };
};