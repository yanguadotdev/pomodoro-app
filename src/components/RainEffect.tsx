import { useRainEffect } from "../hooks/useRainEffect";

interface RainEffectProps {
    rainEnabled: boolean;
}

export default function RainEffect({ rainEnabled }: RainEffectProps) {
    const { canvasRef } = useRainEffect(rainEnabled, 'storm');

    return (
        <div className="fixed inset-0 pointer-events-none z-10">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    pointerEvents: 'none',
                    zIndex: 10,
                    background: 'transparent'
                }}
            />
        </div>
    );
}