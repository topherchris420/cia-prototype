import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Atom, Zap, Infinity } from 'lucide-react';

interface QuantumEntanglementVisualizerProps {
  consciousnessState: any;
  isActive: boolean;
  onEntanglementChange: (strength: number) => void;
}

export const QuantumEntanglementVisualizer = ({ 
  consciousnessState, 
  isActive, 
  onEntanglementChange 
}: QuantumEntanglementVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const entanglementStrength = useRef(0.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; phase: number; entangled: number }> = [];

    // Initialize quantum particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        phase: Math.random() * Math.PI * 2,
        entangled: Math.floor(i / 2) // Pair particles for entanglement
      });
    }

    const animate = () => {
      time += 0.02;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update entanglement strength based on consciousness coherence
      entanglementStrength.current = consciousnessState.coherence * consciousnessState.amplitude;
      onEntanglementChange(entanglementStrength.current);

      particles.forEach((particle, index) => {
        // Find entangled partner
        const partner = particles.find(p => p.entangled === particle.entangled && p !== particle);
        
        if (partner && isActive) {
          // Quantum entanglement effect - correlated behavior
          const entanglementForce = entanglementStrength.current * 0.1;
          const dx = partner.x - particle.x;
          const dy = partner.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 0) {
            particle.vx += (dx / distance) * entanglementForce * Math.sin(time + particle.phase);
            particle.vy += (dy / distance) * entanglementForce * Math.cos(time + particle.phase);
          }
        }

        // Update position
        particle.x += particle.vx * consciousnessState.frequency / 400;
        particle.y += particle.vy * consciousnessState.frequency / 400;

        // Boundary wrapping
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Render particle
        const hue = (particle.entangled * 60 + time * 50) % 360;
        const alpha = isActive ? entanglementStrength.current : 0.2;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3 + Math.sin(time * 2 + particle.phase) * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
        ctx.fill();

        // Draw entanglement connections
        if (partner && isActive && entanglementStrength.current > 0.3) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(partner.x, partner.y);
          ctx.strokeStyle = `hsla(${hue}, 70%, 50%, ${alpha * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [consciousnessState, isActive, onEntanglementChange]);

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Atom className="w-4 h-4 text-purple-400" />
          <span className="text-purple-300 text-sm font-mono">QUANTUM ENTANGLEMENT</span>
        </div>
        <div className="flex items-center space-x-1">
          <Zap className="w-3 h-3 text-yellow-400" />
          <span className="text-yellow-300 text-xs font-mono">
            {Math.round(entanglementStrength.current * 100)}%
          </span>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-32 rounded border border-gray-600/20"
      />
      
      <div className="mt-2 text-xs text-gray-400 font-mono text-center">
        Quantum particles demonstrate non-local correlation effects
      </div>
    </div>
  );
};