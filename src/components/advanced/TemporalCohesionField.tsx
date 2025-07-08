import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Rewind, FastForward, Pause, Play } from 'lucide-react';

interface TemporalCohesionFieldProps {
  consciousnessState: any;
  isActive: boolean;
  onTemporalShift: (timeIndex: number) => void;
}

export const TemporalCohesionField = ({ 
  consciousnessState, 
  isActive, 
  onTemporalShift 
}: TemporalCohesionFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [timeFlow, setTimeFlow] = useState(1.0);
  const [temporalLocked, setTemporalLocked] = useState(false);
  const timeIndex = useRef(0);
  const stateHistory = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Store consciousness state in temporal buffer
    stateHistory.current.push({ ...consciousnessState, timestamp: Date.now() });
    if (stateHistory.current.length > 100) {
      stateHistory.current.shift();
    }

    let time = 0;

    const renderTemporalField = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;

      // Create temporal distortion field
      for (let ring = 0; ring < 8; ring++) {
        const radius = (ring + 1) * (maxRadius / 8);
        const points = 32;
        
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * Math.PI * 2;
          
          // Temporal warping based on consciousness coherence
          const timeWarp = Math.sin(time * timeFlow + ring * 0.5) * consciousnessState.coherence * 0.3;
          const warpedRadius = radius + timeWarp * 20;
          
          const x = centerX + Math.cos(angle + time * 0.1) * warpedRadius;
          const y = centerY + Math.sin(angle + time * 0.1) * warpedRadius;
          
          // Color represents temporal position
          const temporalHue = (ring * 45 + timeIndex.current * 2) % 360;
          const intensity = consciousnessState.amplitude * (isActive ? 1 : 0.3);
          
          ctx.beginPath();
          ctx.arc(x, y, 2 + Math.sin(time * 2 + ring) * 1, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${temporalHue}, 80%, 60%, ${intensity})`;
          ctx.fill();
          
          // Draw temporal connections
          if (ring > 0 && i % 4 === 0) {
            const prevRadius = ring * (maxRadius / 8);
            const prevX = centerX + Math.cos(angle + time * 0.1) * prevRadius;
            const prevY = centerY + Math.sin(angle + time * 0.1) * prevRadius;
            
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = `hsla(${temporalHue}, 60%, 40%, ${intensity * 0.4})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Render temporal timeline
      const timelineY = canvas.height - 30;
      const timelineWidth = canvas.width - 40;
      
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, timelineY);
      ctx.lineTo(20 + timelineWidth, timelineY);
      ctx.stroke();

      // Timeline markers
      for (let i = 0; i < 10; i++) {
        const x = 20 + (i / 9) * timelineWidth;
        const historyIndex = Math.floor(i / 9 * (stateHistory.current.length - 1));
        const state = stateHistory.current[historyIndex];
        
        if (state) {
          const markerHeight = 5 + state.amplitude * 10;
          ctx.fillStyle = `hsla(${state.frequency / 2}, 70%, 60%, 0.8)`;
          ctx.fillRect(x - 1, timelineY - markerHeight, 2, markerHeight);
        }
      }

      // Current time indicator
      const currentX = 20 + (timeIndex.current / 100) * timelineWidth;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(currentX - 2, timelineY - 15, 4, 15);
    };

    const animate = () => {
      if (!temporalLocked) {
        time += 0.02 * timeFlow;
        timeIndex.current = (timeIndex.current + timeFlow * 0.5) % 100;
        onTemporalShift(timeIndex.current);
      }
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      renderTemporalField();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [consciousnessState, isActive, timeFlow, temporalLocked, onTemporalShift]);

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-blue-300 text-sm font-mono">TEMPORAL COHESION</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            onClick={() => setTimeFlow(f => Math.max(0.1, f - 0.2))}
            variant="ghost"
            size="sm"
            className="text-blue-300 h-6 px-2"
          >
            <Rewind className="w-3 h-3" />
          </Button>
          <Button
            onClick={() => setTemporalLocked(!temporalLocked)}
            variant="ghost"
            size="sm"
            className="text-blue-300 h-6 px-2"
          >
            {temporalLocked ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </Button>
          <Button
            onClick={() => setTimeFlow(f => Math.min(3.0, f + 0.2))}
            variant="ghost"
            size="sm"
            className="text-blue-300 h-6 px-2"
          >
            <FastForward className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-32 rounded border border-gray-600/20"
      />
      
      <div className="mt-2 flex justify-between items-center">
        <span className="text-xs text-gray-400 font-mono">
          Flow Rate: {timeFlow.toFixed(1)}x
        </span>
        <span className="text-xs text-blue-300 font-mono">
          T-Index: {Math.round(timeIndex.current)}
        </span>
      </div>
    </div>
  );
};