
import { useEffect, useState } from 'react';

interface SymbolicHUDProps {
  consciousnessState: any;
  phaseDriftIndex: number;
  biometricResonanceScore: number;
}

export const SymbolicHUD = ({ 
  consciousnessState, 
  phaseDriftIndex, 
  biometricResonanceScore 
}: SymbolicHUDProps) => {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 0.1) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getStateSymbol = () => {
    if (consciousnessState.coherence > 0.8) return '◉';
    if (consciousnessState.coherence > 0.6) return '◎';
    if (consciousnessState.coherence > 0.4) return '○';
    return '◌';
  };

  const getResonanceColor = () => {
    const colors = {
      alpha: 'text-blue-400',
      beta: 'text-green-400',
      gamma: 'text-purple-400',
      theta: 'text-cyan-400',
      delta: 'text-red-400'
    };
    return colors[consciousnessState.resonance] || 'text-gray-400';
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-gray-700/20 p-6 h-full">
      <div className="space-y-6">
        
        {/* Primary State Indicator */}
        <div className="text-center">
          <div 
            className={`text-4xl ${getResonanceColor()} transition-all duration-300`}
            style={{ 
              opacity: 0.6 + Math.sin(pulsePhase) * 0.4,
              filter: `drop-shadow(0 0 ${4 + Math.sin(pulsePhase) * 2}px currentColor)`
            }}
          >
            {getStateSymbol()}
          </div>
          <div className="text-xs text-gray-400/80 uppercase tracking-widest mt-2">
            {consciousnessState.resonance}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="space-y-4">
          
          {/* Coherence Level */}
          <div className="border-l-2 border-cyan-500/30 pl-3">
            <div className="text-xs text-gray-400/60 uppercase tracking-wider">COHERENCE</div>
            <div className="text-lg font-mono text-cyan-300/90">
              {(consciousnessState.coherence * 100).toFixed(1)}%
            </div>
            <div className="w-full bg-gray-800/30 rounded-full h-1 mt-1">
              <div 
                className="bg-gradient-to-r from-cyan-500/50 to-cyan-300/70 h-1 rounded-full transition-all duration-500"
                style={{ width: `${consciousnessState.coherence * 100}%` }}
              />
            </div>
          </div>

          {/* Phase Drift Index */}
          <div className="border-l-2 border-violet-500/30 pl-3">
            <div className="text-xs text-gray-400/60 uppercase tracking-wider">PHASE DRIFT</div>
            <div className="text-lg font-mono text-violet-300/90">
              {phaseDriftIndex.toFixed(3)}
            </div>
            <div className="flex space-x-1 mt-1">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-1 rounded-full transition-all duration-300 ${
                    i < phaseDriftIndex * 10 
                      ? 'bg-violet-400/70' 
                      : 'bg-gray-700/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Biometric Resonance */}
          <div className="border-l-2 border-emerald-500/30 pl-3">
            <div className="text-xs text-gray-400/60 uppercase tracking-wider">BIO RESONANCE</div>
            <div className="text-lg font-mono text-emerald-300/90">
              {(biometricResonanceScore * 100).toFixed(0)}
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gray-800/20 rounded-full"></div>
              <div 
                className="bg-gradient-to-r from-emerald-500/40 to-emerald-300/60 h-1 rounded-full transition-all duration-700"
                style={{ width: `${biometricResonanceScore * 100}%` }}
              />
            </div>
          </div>

        </div>

        {/* Frequency Display */}
        <div className="pt-4 border-t border-gray-700/20">
          <div className="text-xs text-gray-400/60 uppercase tracking-wider text-center">CARRIER</div>
          <div className="text-sm font-mono text-gray-300/80 text-center">
            {consciousnessState.frequency.toFixed(1)} Hz
          </div>
        </div>

      </div>
    </div>
  );
};
