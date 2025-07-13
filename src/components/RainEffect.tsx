import { memo, useMemo } from "react";
import { useRainEffect } from "../hooks/useRainEffect";

interface RainEffectProps {
    rainEnabled: boolean;
}

const canvasStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none' as const,
    zIndex: 10,
    background: 'transparent'
};

const RainEffect = memo(({ rainEnabled }: RainEffectProps) => {
    const { canvasRef } = useRainEffect(rainEnabled, 'storm');

    const canvasElement = useMemo(() => (
        <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={canvasStyle}
        />
    ), [canvasRef]);

    return (
        <div className="fixed inset-0 pointer-events-none z-10">
            {canvasElement}
        </div>
    );
});

RainEffect.displayName = 'RainEffect';

export default RainEffect;