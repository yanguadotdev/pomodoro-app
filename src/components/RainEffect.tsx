import { useRainEffect } from "../hooks/useRainEffect"

export default function RainEffect({ rainEnabled }: { rainEnabled: boolean }) {
    const { rainDrops } = useRainEffect(rainEnabled, 'storm')

    return (
        <div className="absolute inset-0 pointer-events-none z-10">
            {rainDrops.map(drop => (
                <div
                    key={drop.id}
                    className="absolute w-[.5px] bg-gradient-to-b from-transparent via-blue-200/60 to-transparent"
                    style={{
                        left: `${drop.left}%`,
                        height: `${drop.height}px`,
                        opacity: drop.opacity,
                        animation: `rainFall ${drop.animationDuration}s linear`,
                        filter: 'blur(0.5px)'
                    }}
                />
            ))}
        </div>
    )
}