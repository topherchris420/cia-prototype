
import { useEffect, useRef } from 'react';

interface ConsciousnessFieldProps {
  state: {
    frequency: number;
    amplitude: number;
    coherence: number;
    depth: number;
    resonance: string;
  };
  isActive: boolean;
}

export const ConsciousnessField = ({ state, isActive }: ConsciousnessFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Clear canvas with subtle fade effect
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Generate cymatic patterns based on consciousness state
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.3;
      const numRings = 8;
      const numNodes = 32;

      for (let ring = 0; ring < numRings; ring++) {
        const ringRadius = baseRadius * (ring + 1) / numRings;
        const intensity = state.amplitude * (1 - ring / numRings);
        
        for (let node = 0; node < numNodes; node++) {
          const angle = (node / numNodes) * Math.PI * 2;
          const waveOffset = Math.sin(time * state.frequency / 100 + ring * 0.5) * state.coherence;
          const radius = ringRadius + waveOffset * 20;
          
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          // Color based on resonance state
          const hue = getResonanceHue(state.resonance) + (ring * 30) % 360;
          const alpha = intensity * (isActive ? 0.8 : 0.3);
          
          ctx.beginPath();
          ctx.arc(x, y, 2 + intensity * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
          ctx.fill();
          
          // Connect nodes with flowing lines
          if (node > 0) {
            const prevAngle = ((node - 1) / numNodes) * Math.PI * 2;
            const prevRadius = ringRadius + Math.sin(time * state.frequency / 100 + ring * 0.5) * state.coherence * 20;
            const prevX = centerX + Math.cos(prevAngle) * prevRadius;
            const prevY = centerY + Math.sin(prevAngle) * prevRadius;
            
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = `hsla(${hue}, 60%, 50%, ${alpha * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Central consciousness pulse
      const pulseRadius = 20 + Math.sin(time * 2) * 10 * state.depth;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
      gradient.addColorStop(0, `hsla(${getResonanceHue(state.resonance)}, 80%, 70%, 0.8)`);
      gradient.addColorStop(1, `hsla(${getResonanceHue(state.resonance)}, 80%, 70%, 0)`);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state, isActive]);

  const getResonanceHue = (resonance: string): number => {
    const hues: Record<string, number> = {
      alpha: 240,    // Blue
      beta: 120,     // Green
      gamma: 60,     // Yellow
      delta: 300,    // Purple
      theta: 180,    // Cyan
    };
    return hues[resonance] || 240;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
