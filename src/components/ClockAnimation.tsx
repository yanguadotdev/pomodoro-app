import { useEffect, useRef } from "react";


interface ClockAnimationProps {
    isActive: boolean;
    mode: string;
    progress: number;
}

export default function ClockAnimation({ isActive, mode, progress }: ClockAnimationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Simulación de animación Rive con canvas nativo
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(centerX, centerY) - 20;

            // Colores según el modo
            const modeColors = {
                focus: { primary: '#ff6b35', secondary: '#f7931e' },
                shortBreak: { primary: '#4ecdc4', secondary: '#44a08d' },
                longBreak: { primary: '#667eea', secondary: '#764ba2' }
            };

            const colors = modeColors[mode as keyof typeof modeColors] || modeColors.focus;

            // Fondo del círculo
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Progreso del timer
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius - 10, -Math.PI / 2, (-Math.PI / 2) + (progress * Math.PI * 2));
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Crear gradiente para el progreso
            const gradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
            gradient.addColorStop(0, colors.primary);
            gradient.addColorStop(1, colors.secondary);

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius - 10, -Math.PI / 2, (-Math.PI / 2) + (progress * Math.PI * 2));
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 6;
            ctx.stroke();

            // Círculo central animado
            const pulseRadius = isActive ? 15 + Math.sin(Date.now() * 0.005) * 3 : 12;
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
            ctx.fillStyle = isActive ? colors.primary : 'rgba(255, 255, 255, 0.3)';
            ctx.fill();

            // Partículas flotantes (efecto mágico)
            if (isActive) {
                for (let i = 0; i < 8; i++) {
                    const angle = (Date.now() * 0.001 + i * Math.PI / 4) % (Math.PI * 2);
                    const particleRadius = radius - 30;
                    const x = centerX + Math.cos(angle) * particleRadius;
                    const y = centerY + Math.sin(angle) * particleRadius;
                    const size = 2 + Math.sin(Date.now() * 0.01 + i) * 1;

                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fillStyle = `${colors.primary}80`;
                    ctx.fill();
                }
            }

            // Números del reloj
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '14px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            for (let i = 0; i < 12; i++) {
                const angle = (i * Math.PI) / 6 - Math.PI / 2;
                const x = centerX + Math.cos(angle) * (radius - 30);
                const y = centerY + Math.sin(angle) * (radius - 30);
                ctx.fillText((i === 0 ? 12 : i).toString(), x, y);
            }

            requestAnimationFrame(animate);
        };

        animate();
    }, [isActive, mode, progress]);

    return (
        <canvas
            ref={canvasRef}
            width={200}
            height={200}
            className="mx-auto mb-2"
            style={{ filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3))' }}
        />
    );
};
