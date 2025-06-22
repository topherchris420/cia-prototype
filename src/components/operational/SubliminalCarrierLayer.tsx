
import { useEffect, useRef } from 'react';

interface SubliminalCarrierLayerProps {
  depth: number;
  isActive: boolean;
}

export const SubliminalCarrierLayer = ({ depth, isActive }: SubliminalCarrierLayerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;

    const animate = () => {
      time += 0.005;
      
      // Ultra-subtle fade for carrier waves
      ctx.fillStyle = `rgba(0, 0, 0, ${0.95 - depth * 0.1})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isActive && depth > 0.05) {
        // Subliminal geometric patterns
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Carrier wave interference patterns
        for (let i = 0; i < 3; i++) {
          const radius = 100 + i * 150;
          const opacity = depth * 0.02 * (1 - i * 0.3);
          
          ctx.beginPath();
          ctx.arc(
            centerX + Math.sin(time * 0.3 + i) * 50,
            centerY + Math.cos(time * 0.2 + i) * 30,
            radius + Math.sin(time * 0.5 + i) * 20,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = `rgba(100, 150, 200, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Subliminal grid overlay
        ctx.strokeStyle = `rgba(80, 120, 160, ${depth * 0.015})`;
        ctx.lineWidth = 0.3;
        
        const gridSize = 100;
        for (let x = 0; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x + Math.sin(time * 0.1) * 10, 0);
          ctx.lineTo(x + Math.sin(time * 0.1) * 10, canvas.height);
          ctx.stroke();
        }
        
        for (let y = 0; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y + Math.cos(time * 0.1) * 10);
          ctx.lineTo(canvas.width, y + Math.cos(time * 0.1) * 10);
          ctx.stroke();
        }

        // Near-threshold perception particles
        const particleCount = Math.floor(depth * 20);
        for (let i = 0; i < particleCount; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          const size = 0.5 + Math.random() * 1;
          const opacity = depth * 0.1 * Math.random();
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(120, 180, 255, ${opacity})`;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [depth, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 1,
        mixBlendMode: 'soft-light',
        opacity: depth * 2
      }}
    />
  );
};
