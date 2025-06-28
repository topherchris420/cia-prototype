
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResonanceVisualizerProps {
  state: any;
  mode: 'cymatic' | 'spectral' | 'attractor';
  onModeChange: (mode: 'cymatic' | 'spectral' | 'attractor') => void;
  isActive: boolean;
}

export const ResonanceVisualizer = ({ 
  state, 
  mode, 
  onModeChange, 
  isActive 
}: ResonanceVisualizerProps) => {
  const isMobile = useIsMobile();
  const [animationTime, setAnimationTime] = useState(0);
  const [intensity, setIntensity] = useState(0.5);
  const [clickPosition, setClickPosition] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(prev => prev + 0.08);
      
      const targetIntensity = isActive ? 
        (state.coherence * 0.6 + state.amplitude * 0.4) : 0.2;
      setIntensity(prev => prev + (targetIntensity - prev) * 0.1);
    }, 60);
    return () => clearInterval(interval);
  }, [isActive, state.coherence, state.amplitude]);

  const handleModeChange = (newMode: 'cymatic' | 'spectral' | 'attractor') => {
    console.log('Visualizer mode changed to:', newMode);
    onModeChange(newMode);
    
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const handleVisualizerClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    console.log('Visualizer clicked at:', x, y);
    setClickPosition({ x, y });
    
    setTimeout(() => setClickPosition(null), 1000);
  };

  const modes = [
    { key: 'cymatic', label: isMobile ? 'CYM' : 'CYMATIC', icon: '◯', color: 'cyan' },
    { key: 'spectral', label: isMobile ? 'SPEC' : 'SPECTRAL', icon: '◈', color: 'violet' },
    { key: 'attractor', label: isMobile ? 'ATT' : 'ATTRACTOR', icon: '◊', color: 'emerald' }
  ];

  return (
    <div className="bg-black/10 backdrop-blur-sm rounded-3xl border border-gray-700/20 p-4 sm:p-6 h-full relative overflow-hidden">
      
      <div className={`absolute inset-0 opacity-20 transition-opacity duration-1000 ${
        isActive ? 'bg-gradient-to-br from-cyan-500/10 via-violet-500/5 to-emerald-500/10' : ''
      }`} />
      
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex space-x-1 sm:space-x-2">
        {modes.map((modeOption) => (
          <button
            key={modeOption.key}
            onClick={() => handleModeChange(modeOption.key as any)}
            className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium tracking-wider transition-all duration-300 touch-manipulation hover:scale-105 cursor-pointer ${
              mode === modeOption.key
                ? `bg-${modeOption.color}-500/30 text-${modeOption.color}-200 border border-${modeOption.color}-400/50 shadow-lg shadow-${modeOption.color}-500/20`
                : 'bg-black/20 text-gray-400/70 border border-gray-600/20 hover:text-gray-300 hover:bg-gray-700/30'
            }`}
          >
            <span className="mr-1">{modeOption.icon}</span>
            {modeOption.label}
          </button>
        ))}
      </div>

      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
          isActive ? 'bg-cyan-400/90 animate-pulse shadow-lg shadow-cyan-400/50' : 'bg-gray-600/40'
        }`} onClick={() => console.log('Status indicator clicked, intensity:', intensity)} />
        <div className="text-xs text-gray-400/60 cursor-pointer" onClick={() => console.log('Intensity:', intensity)}>
          {(intensity * 100).toFixed(0)}%
        </div>
      </div>

      <div className="absolute inset-4 sm:inset-6 flex items-center justify-center cursor-pointer" onClick={handleVisualizerClick}>
        
        {mode === 'cymatic' && (
          <div className={`relative ${isMobile ? 'w-48 h-48' : 'w-64 h-64'}`}>
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="absolute inset-0 border border-cyan-400/30 rounded-full transition-all duration-300"
                style={{
                  transform: `scale(${(i + 1) * 0.08 + Math.sin(animationTime * 0.5 + i) * 0.02})`,
                  opacity: intensity * (0.8 - i * 0.05),
                  borderColor: `rgba(34, 211, 238, ${intensity * (0.6 - i * 0.03)})`
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-6 h-6 bg-cyan-400/80 rounded-full transition-all duration-300"
                style={{
                  transform: `scale(${0.8 + intensity * 0.4})`,
                  opacity: 0.6 + intensity * 0.4,
                  boxShadow: `0 0 ${20 * intensity}px rgba(34, 211, 238, ${intensity * 0.8})`
                }}
              />
            </div>
            {clickPosition && (
              <div 
                className="absolute w-4 h-4 bg-white/50 rounded-full animate-ping"
                style={{ left: `${clickPosition.x}%`, top: `${clickPosition.y}%` }}
              />
            )}
          </div>
        )}

        {mode === 'spectral' && (
          <div className={`w-full ${isMobile ? 'h-32' : 'h-40'} flex items-end justify-center space-x-1`}>
            {Array.from({ length: isMobile ? 32 : 48 }, (_, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-violet-600/60 via-violet-400/80 to-violet-200/90 rounded-t transition-all duration-150 cursor-pointer hover:opacity-80"
                style={{
                  width: isMobile ? '3px' : '4px',
                  height: `${30 + Math.sin(animationTime * 2 + i * 0.2) * (isMobile ? 40 : 60) * intensity}px`,
                  opacity: 0.3 + Math.sin(animationTime * 0.8 + i * 0.15) * 0.4 * intensity,
                  transform: `scaleY(${0.8 + intensity * 0.4})`
                }}
                onClick={() => console.log('Spectral bar clicked:', i)}
              />
            ))}
          </div>
        )}

        {mode === 'attractor' && (
          <div className={`relative ${isMobile ? 'w-48 h-48' : 'w-64 h-64'}`}>
            <div className="absolute inset-0">
              {Array.from({ length: 18 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 bg-emerald-400/70 rounded-full shadow-lg shadow-emerald-400/30 cursor-pointer hover:scale-125 transition-transform"
                  style={{
                    left: `${50 + Math.sin(animationTime * 0.3 + i * 0.4) * 35 * intensity}%`,
                    top: `${50 + Math.cos(animationTime * 0.4 + i * 0.3) * 35 * intensity}%`,
                    transform: `scale(${0.4 + Math.sin(animationTime * 0.6 + i) * 0.6 * intensity})`,
                    opacity: 0.4 + Math.sin(animationTime * 0.2 + i) * 0.5 * intensity
                  }}
                  onClick={() => console.log('Attractor point clicked:', i)}
                />
              ))}
            </div>
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {Array.from({ length: 8 }, (_, i) => {
                const size = isMobile ? 96 : 128;
                const offset = intensity * 80;
                return (
                  <path
                    key={i}
                    d={`M ${size + Math.sin(animationTime * 0.2 + i) * offset} ${size + Math.cos(animationTime * 0.2 + i) * offset * 0.8} Q ${size} ${size} ${size - Math.sin(animationTime * 0.2 + i) * offset} ${size - Math.cos(animationTime * 0.2 + i) * offset * 0.8}`}
                    stroke={`rgba(16, 185, 129, ${0.4 * intensity})`}
                    strokeWidth={1 + intensity}
                    fill="none"
                    opacity={0.3 + Math.sin(animationTime * 0.3 + i) * 0.4 * intensity}
                  />
                );
              })}
            </svg>
          </div>
        )}

      </div>

      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-gray-400/70 uppercase tracking-wider cursor-pointer" onClick={() => console.log('Coherence:', state.coherence)}>
            COHERENCE: {(state.coherence * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400/70 uppercase tracking-wider cursor-pointer" onClick={() => console.log('Frequency:', state.frequency)}>
            {state.frequency.toFixed(1)} Hz
          </div>
        </div>
        <div className="w-full bg-gray-800/30 rounded-full h-2 overflow-hidden cursor-pointer" onClick={() => console.log('Coherence bar clicked')}>
          <div 
            className="bg-gradient-to-r from-cyan-500/60 via-violet-500/60 to-emerald-500/60 h-2 rounded-full transition-all duration-1000 relative"
            style={{ width: `${state.coherence * 100}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
          </div>
        </div>
      </div>

    </div>
  );
};
