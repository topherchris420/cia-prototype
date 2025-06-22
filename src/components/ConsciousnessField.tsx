
import { useEffect, useRef } from 'react';

interface ConsciousnessFieldProps {
  state: {
    frequency: number;
    amplitude: number;
    coherence: number;
    depth: number;
    resonance: string;
    biometricState?: any;
    neuralBands?: any;
    phaseTransition?: boolean;
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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Enhanced fade for phase transitions
      const fadeAlpha = state.phaseTransition ? 0.15 : 0.05;
      ctx.fillStyle = `rgba(15, 23, 42, ${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Generate advanced cymatic patterns based on neural bands
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.3;
      const numRings = state.neuralBands ? 12 : 8;
      const numNodes = 64; // Increased resolution for classified-grade precision

      // Neural band-specific modulation
      const neuralModulation = state.neuralBands ? {
        delta: state.neuralBands.delta * 0.1,
        theta: state.neuralBands.theta * 0.2,
        alpha: state.neuralBands.alpha * 0.3,
        beta: state.neuralBands.beta * 0.4,
        gamma: state.neuralBands.gamma * 0.5
      } : { delta: 0, theta: 0, alpha: 0.3, beta: 0, gamma: 0 };

      for (let ring = 0; ring < numRings; ring++) {
        const ringRadius = baseRadius * (ring + 1) / numRings;
        const intensity = state.amplitude * (1 - ring / numRings);
        
        // Apply neural band influence
        const bandInfluence = Object.values(neuralModulation).reduce((sum, val) => sum + val, 0);
        const modifiedIntensity = intensity * (1 + bandInfluence);
        
        for (let node = 0; node < numNodes; node++) {
          const angle = (node / numNodes) * Math.PI * 2;
          
          // Complex wave interference pattern
          const primaryWave = Math.sin(time * state.frequency / 100 + ring * 0.5) * state.coherence;
          const harmonicWave = Math.sin(time * state.frequency / 50 + angle * 3) * neuralModulation.gamma;
          const breathingWave = state.biometricState ? 
            Math.sin(time * 10) * state.biometricState.breathingPattern * 0.3 : 0;
          
          const waveOffset = (primaryWave + harmonicWave + breathingWave) * 20;
          const radius = ringRadius + waveOffset;
          
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          // Enhanced color mapping for neural states
          const hue = getAdvancedResonanceHue(state.resonance, ring, time);
          const saturation = 70 + (modifiedIntensity * 30);
          const lightness = 40 + (state.coherence * 40);
          const alpha = modifiedIntensity * (isActive ? 0.9 : 0.3);
          
          ctx.beginPath();
          ctx.arc(x, y, 1 + modifiedIntensity * 4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
          ctx.fill();
          
          // Quantum entanglement lines for gamma states
          if (state.neuralBands && state.neuralBands.gamma > 0.7) {
            const entanglementNode = (node + Math.floor(numNodes / 3)) % numNodes;
            const entangleAngle = (entanglementNode / numNodes) * Math.PI * 2;
            const entangleRadius = ringRadius + Math.sin(time * state.frequency / 80 + ring * 0.3) * state.coherence * 15;
            const entangleX = centerX + Math.cos(entangleAngle) * entangleRadius;
            const entangleY = centerY + Math.sin(entangleAngle) * entangleRadius;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(entangleX, entangleY);
            ctx.strokeStyle = `hsla(${hue + 60}, 80%, 70%, ${alpha * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Central consciousness singularity
      const pulseRadius = 25 + Math.sin(time * 3) * 15 * state.depth;
      const cognitiveInfluence = state.biometricState ? state.biometricState.cognitiveLoad : 0.5;
      const singularityRadius = pulseRadius * (1 + cognitiveInfluence);
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, singularityRadius);
      gradient.addColorStop(0, `hsla(${getAdvancedResonanceHue(state.resonance, 0, time)}, 90%, 80%, 0.9)`);
      gradient.addColorStop(0.7, `hsla(${getAdvancedResonanceHue(state.resonance, 0, time)}, 80%, 60%, 0.4)`);
      gradient.addColorStop(1, `hsla(${getAdvancedResonanceHue(state.resonance, 0, time)}, 70%, 40%, 0)`);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, singularityRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Phase transition effects
      if (state.phaseTransition) {
        const transitionRadius = baseRadius * 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, transitionRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${getAdvancedResonanceHue(state.resonance, 0, time)}, 100%, 80%, 0.6)`;
        ctx.lineWidth = 3;
        ctx.stroke();
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
  }, [state, isActive]);

  const getAdvancedResonanceHue = (resonance: string, ring: number, time: number): number => {
    const baseHues: Record<string, number> = {
      alpha: 240,    // Blue
      beta: 120,     // Green  
      gamma: 60,     // Yellow
      delta: 300,    // Purple
      theta: 180,    // Cyan
    };
    
    const baseHue = baseHues[resonance] || 240;
    const ringModulation = (ring * 15) % 60;
    const timeModulation = Math.sin(time * 0.5) * 30;
    
    return (baseHue + ringModulation + timeModulation) % 360;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
