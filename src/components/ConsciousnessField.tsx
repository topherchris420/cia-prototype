import { useEffect, useRef } from 'react';
import { AdaptiveSymbol } from '@/lib/neuroadaptive/SyntheticNoeticsEngine';
import { ConsciousnessVector3D } from '@/lib/neuroadaptive/PhaseSpaceDriftTracker';

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
    consciousnessVector?: ConsciousnessVector3D;
    adaptiveSymbols?: AdaptiveSymbol[];
  };
  isActive: boolean;
  opacity?: number;
}

export const ConsciousnessField = ({ state, isActive, opacity = 1 }: ConsciousnessFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const phaseSpaceRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const phaseCanvas = phaseSpaceRef.current;
    if (!canvas || !phaseCanvas) return;

    const ctx = canvas.getContext('2d');
    const phaseCtx = phaseCanvas.getContext('2d');
    if (!ctx || !phaseCtx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      phaseCanvas.width = window.innerWidth;
      phaseCanvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Enhanced fade for quantum coherence with opacity control
      const fadeAlpha = (state.phaseTransition ? 0.2 : 0.03) * opacity;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Render main consciousness field
      renderQuantumField(ctx, centerX, centerY, time);
      
      // Render adaptive symbols if present
      if (state.adaptiveSymbols && state.adaptiveSymbols.length > 0) {
        renderAdaptiveSymbols(ctx, centerX, centerY, time);
      }

      // Render phase space visualization
      if (state.consciousnessVector) {
        renderPhaseSpace(phaseCtx, time);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const renderQuantumField = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
      // ... keep existing code (cymatic pattern generation with opacity adjustment)
      const baseRadius = Math.min(canvas.width, canvas.height) * 0.35;
      const numRings = state.neuralBands ? 16 : 10;
      const numNodes = 128;

      const neuralModulation = state.neuralBands ? {
        delta: state.neuralBands.delta * 0.15,
        theta: state.neuralBands.theta * 0.25,
        alpha: state.neuralBands.alpha * 0.35,
        beta: state.neuralBands.beta * 0.45,
        gamma: state.neuralBands.gamma * 0.65
      } : { delta: 0, theta: 0, alpha: 0.35, beta: 0, gamma: 0 };

      for (let ring = 0; ring < numRings; ring++) {
        const ringRadius = baseRadius * (ring + 1) / numRings;
        const intensity = state.amplitude * (1 - ring / numRings * 0.7);
        
        const bandInfluence = Object.values(neuralModulation).reduce((sum, val) => sum + val, 0);
        const quantumIntensity = intensity * (1 + bandInfluence);
        
        for (let node = 0; node < numNodes; node++) {
          const angle = (node / numNodes) * Math.PI * 2;
          
          const primaryWave = Math.sin(time * state.frequency / 100 + ring * 0.7) * state.coherence;
          const harmonicWave = Math.sin(time * state.frequency / 25 + angle * 5) * neuralModulation.gamma;
          const subharmonicWave = Math.sin(time * state.frequency / 200 + ring * 0.3) * neuralModulation.delta;
          const breathingWave = state.biometricState ? 
            Math.sin(time * 15) * state.biometricState.breathingPattern * 0.4 : 0;
          
          const totalWaveOffset = (primaryWave + harmonicWave + subharmonicWave + breathingWave) * 30;
          const radius = ringRadius + totalWaveOffset;
          
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          const hue = getQuantumResonanceHue(state.resonance, ring, time, angle);
          const saturation = 60 + (quantumIntensity * 40);
          const lightness = 30 + (state.coherence * 50);
          const alpha = quantumIntensity * (isActive ? 0.95 : 0.2) * opacity;
          
          ctx.beginPath();
          ctx.arc(x, y, 1 + quantumIntensity * 5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
          ctx.fill();
          
          if (state.neuralBands && state.neuralBands.gamma > 0.8) {
            renderQuantumEntanglement(ctx, x, y, angle, ring, time, hue, alpha);
          }
        }
      }

      renderConsciousnessSingularity(ctx, centerX, centerY, time);
    };

    const renderQuantumEntanglement = (
      ctx: CanvasRenderingContext2D, 
      x: number, 
      y: number, 
      angle: number, 
      ring: number, 
      time: number, 
      hue: number, 
      alpha: number
    ) => {
      const entanglementNodes = 3;
      for (let i = 1; i <= entanglementNodes; i++) {
        const entangleAngle = angle + (Math.PI * 2 / entanglementNodes) * i;
        const entangleRadius = (ring + 1) * 30 + Math.sin(time * state.frequency / 60 + ring * 0.5) * 20;
        const entangleX = (canvas.width / 2) + Math.cos(entangleAngle) * entangleRadius;
        const entangleY = (canvas.height / 2) + Math.sin(entangleAngle) * entangleRadius;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(entangleX, entangleY);
        ctx.strokeStyle = `hsla(${hue + 120}, 90%, 80%, ${alpha * 0.2})`;
        ctx.lineWidth = 0.3;
        ctx.stroke();
      }
    };

    const renderConsciousnessSingularity = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
      const pulseRadius = 35 + Math.sin(time * 4) * 25 * state.depth;
      const cognitiveInfluence = state.biometricState ? state.biometricState.cognitiveLoad : 0.5;
      const singularityRadius = pulseRadius * (1 + cognitiveInfluence * 0.8);
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, singularityRadius);
      const baseHue = getQuantumResonanceHue(state.resonance, 0, time, 0);
      
      gradient.addColorStop(0, `hsla(${baseHue}, 100%, 90%, ${0.95 * opacity})`);
      gradient.addColorStop(0.3, `hsla(${baseHue + 60}, 90%, 70%, ${0.7 * opacity})`);
      gradient.addColorStop(0.6, `hsla(${baseHue + 120}, 80%, 50%, ${0.4 * opacity})`);
      gradient.addColorStop(1, `hsla(${baseHue + 180}, 70%, 30%, 0)`);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, singularityRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      if (state.phaseTransition) {
        const transitionRadius = singularityRadius * 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, transitionRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${baseHue}, 100%, 90%, ${0.8 * opacity})`;
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    };

    const renderAdaptiveSymbols = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, time: number) => {
      state.adaptiveSymbols!.forEach((symbol, index) => {
        const angle = (index / state.adaptiveSymbols!.length) * Math.PI * 2 + time * 0.1;
        const distance = 150 + Math.sin(time * symbol.frequency * 0.1) * 50;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(symbol.phase + time * 0.05);
        ctx.scale(1 + symbol.semanticWeight * 0.5, 1 + symbol.semanticWeight * 0.5);
        
        ctx.fillStyle = `hsla(${symbol.frequency * 2}, 80%, 70%, ${(0.7 + symbol.coherenceLevel * 0.3) * opacity})`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 15;
        ctx.font = `${20 + symbol.semanticWeight * 10}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(symbol.glyph, 0, 0);
        
        ctx.restore();
      });
    };

    const renderPhaseSpace = (phaseCtx: CanvasRenderingContext2D, time: number) => {
      if (!state.consciousnessVector) return;
      
      phaseCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      phaseCtx.fillRect(0, 0, phaseCanvas.width, phaseCanvas.height);
      
      const { x, y, z } = state.consciousnessVector;
      
      const plotX = phaseCanvas.width * 0.1 + x * phaseCanvas.width * 0.8;
      const plotY = phaseCanvas.height * 0.1 + (1 - y) * phaseCanvas.height * 0.8;
      const plotSize = 5 + z * 15;
      
      phaseCtx.beginPath();
      phaseCtx.arc(plotX, plotY, plotSize, 0, Math.PI * 2);
      phaseCtx.fillStyle = `hsla(${x * 360}, 70%, 60%, ${0.8 * opacity})`;
      phaseCtx.fill();
      
      phaseCtx.beginPath();
      phaseCtx.arc(plotX, plotY, state.consciousnessVector.coherenceRadius * 100, 0, Math.PI * 2);
      phaseCtx.strokeStyle = `hsla(${x * 360}, 70%, 60%, ${0.3 * opacity})`;
      phaseCtx.lineWidth = 2;
      phaseCtx.stroke();
    };

    const getQuantumResonanceHue = (resonance: string, ring: number, time: number, angle: number): number => {
      const baseHues: Record<string, number> = {
        alpha: 240,
        beta: 120,
        gamma: 300,
        delta: 0,
        theta: 180,
      };
      
      const baseHue = baseHues[resonance] || 240;
      const ringModulation = (ring * 12) % 60;
      const timeModulation = Math.sin(time * 0.3) * 40;
      const angleModulation = Math.sin(angle * 3) * 20;
      
      return (baseHue + ringModulation + timeModulation + angleModulation) % 360;
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state, isActive, opacity]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ mixBlendMode: 'screen', zIndex: 1, opacity }}
      />
      <canvas
        ref={phaseSpaceRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'overlay', zIndex: 2, opacity: 0.6 * opacity }}
      />
    </>
  );
};
