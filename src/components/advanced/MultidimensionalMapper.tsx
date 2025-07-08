import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Layers, RotateCcw, Maximize2 } from 'lucide-react';

interface MultidimensionalMapperProps {
  consciousnessState: any;
  isActive: boolean;
}

export const MultidimensionalMapper = ({ consciousnessState, isActive }: MultidimensionalMapperProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [dimension, setDimension] = useState(3);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let time = 0;

    const project3DTo2D = (x: number, y: number, z: number) => {
      // Perspective projection with consciousness-influenced viewing angle
      const distance = 300 + consciousnessState.depth * 200;
      const perspective = distance / (distance + z);
      
      return {
        x: (x * perspective) + canvas.width / 2,
        y: (y * perspective) + canvas.height / 2
      };
    };

    const rotatePoint = (x: number, y: number, z: number) => {
      // Rotate around consciousness vector
      const cos = Math.cos;
      const sin = Math.sin;
      
      // X rotation
      let newY = y * cos(rotation.x) - z * sin(rotation.x);
      let newZ = y * sin(rotation.x) + z * cos(rotation.x);
      
      // Y rotation  
      let newX = x * cos(rotation.y) + newZ * sin(rotation.y);
      newZ = -x * sin(rotation.y) + newZ * cos(rotation.y);
      
      // Z rotation
      const finalX = newX * cos(rotation.z) - newY * sin(rotation.z);
      const finalY = newX * sin(rotation.z) + newY * cos(rotation.z);
      
      return { x: finalX, y: finalY, z: newZ };
    };

    const renderHypercube = () => {
      const size = 50 + consciousnessState.amplitude * 50;
      const vertices: number[][] = [];
      
      // Generate hypercube vertices based on dimension
      for (let i = 0; i < Math.pow(2, dimension); i++) {
        const vertex = [];
        for (let d = 0; d < dimension; d++) {
          vertex.push((i & (1 << d)) ? size : -size);
        }
        // Pad with zeros for missing dimensions
        while (vertex.length < 4) vertex.push(0);
        vertices.push(vertex);
      }

      // Project and render
      vertices.forEach((vertex, index) => {
        const [x, y, z, w] = vertex;
        
        // 4D to 3D projection (if applicable)
        const proj3D = dimension > 3 ? {
          x: x + w * consciousnessState.coherence * 0.3,
          y: y + w * consciousnessState.frequency / 1000,
          z: z + w * Math.sin(time) * 0.2
        } : { x, y, z };

        const rotated = rotatePoint(proj3D.x, proj3D.y, proj3D.z);
        const projected = project3DTo2D(rotated.x, rotated.y, rotated.z);

        // Render vertex
        const hue = (index * 45 + time * 30) % 360;
        const alpha = isActive ? 0.8 : 0.3;
        
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${alpha})`;
        ctx.fill();

        // Connect to adjacent vertices
        for (let bit = 0; bit < dimension; bit++) {
          const adjacentIndex = index ^ (1 << bit);
          if (adjacentIndex > index && adjacentIndex < vertices.length) {
            const adjVertex = vertices[adjacentIndex];
            const [ax, ay, az, aw] = adjVertex;
            
            const adjProj3D = dimension > 3 ? {
              x: ax + aw * consciousnessState.coherence * 0.3,
              y: ay + aw * consciousnessState.frequency / 1000,
              z: az + aw * Math.sin(time) * 0.2
            } : { x: ax, y: ay, z: az };

            const adjRotated = rotatePoint(adjProj3D.x, adjProj3D.y, adjProj3D.z);
            const adjProjected = project3DTo2D(adjRotated.x, adjRotated.y, adjRotated.z);

            ctx.beginPath();
            ctx.moveTo(projected.x, projected.y);
            ctx.lineTo(adjProjected.x, adjProjected.y);
            ctx.strokeStyle = `hsla(${hue}, 60%, 50%, ${alpha * 0.4})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
    };

    const animate = () => {
      time += 0.02;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Auto-rotate based on consciousness parameters
      setRotation(prev => ({
        x: prev.x + consciousnessState.frequency / 10000,
        y: prev.y + consciousnessState.amplitude * 0.01,
        z: prev.z + consciousnessState.coherence * 0.005
      }));

      renderHypercube();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [consciousnessState, isActive, dimension, rotation]);

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-300 text-sm font-mono">DIMENSIONAL MAPPER</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setDimension(d => Math.max(3, Math.min(6, d - 1)))}
            variant="ghost"
            size="sm"
            className="text-cyan-300 h-6 px-2"
          >
            D-
          </Button>
          <span className="text-cyan-300 text-xs font-mono min-w-[20px] text-center">
            {dimension}D
          </span>
          <Button
            onClick={() => setDimension(d => Math.max(3, Math.min(6, d + 1)))}
            variant="ghost"
            size="sm"
            className="text-cyan-300 h-6 px-2"
          >
            D+
          </Button>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-40 rounded border border-gray-600/20"
      />
      
      <div className="mt-2 text-xs text-gray-400 font-mono text-center">
        Consciousness projected through {dimension}-dimensional hyperspace
      </div>
    </div>
  );
};