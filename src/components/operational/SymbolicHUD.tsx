
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
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 0.08) % (Math.PI * 2));
      
      // Trigger glitch effect occasionally
      if (Math.random() < 0.02 && consciousnessState.coherence > 0.7) {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 150);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [consciousnessState.coherence]);

  const getStateSymbol = () => {
    if (consciousnessState.coherence > 0.9) return '◉';
    if (consciousnessState.coherence > 0.7) return '◎';
    if (consciousnessState.coherence > 0.5) return '○';
    if (consciousnessState.coherence > 0.3) return '◌';
    return '◯';
  };

  const getResonanceColor = (opacity = 1) => {
    const colors = {
      alpha: `rgba(96, 165, 250, ${opacity})`,
      beta: `rgba(34, 197, 94, ${opacity})`,
      gamma: `rgba(168, 85, 247, ${opacity})`,
      theta: `rgba(34, 211, 238, ${opacity})`,
      delta: `rgba(248, 113, 113, ${opacity})`
    };
    return colors[consciousnessState.resonance] || `rgba(156, 163, 175, ${opacity})`;
  };

  const getResonanceClass = () => {
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
    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-gray-700/20 p-6 h-full relative overflow-hidden">
      
      {/* Background pulse effect */}
      <div 
        className="absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${getResonanceColor(0.05)} 0%, transparent 70%)`,
          opacity: 0.3 + Math.sin(pulsePhase) * 0.2
        }}
      />
      
      <div className="space-y-6 relative z-10">
        
        {/* Enhanced Primary State Indicator */}
        <div className="text-center">
          <div 
            className={`text-5xl ${getResonanceClass()} transition-all duration-300 ${glitchEffect ? 'animate-bounce' : ''}`}
            style={{ 
              opacity: 0.7 + Math.sin(pulsePhase) * 0.3,
              filter: `drop-shadow(0 0 ${8 + Math.sin(pulsePhase) * 4}px ${getResonanceColor(0.8)})`,
              transform: `scale(${1 + Math.sin(pulsePhase * 2) * 0.05})`
            }}
          >
            {getStateSymbol()}
          </div>
          <div className="text-xs text-gray-400/80 uppercase tracking-widest mt-2">
            {consciousnessState.resonance}
          </div>
          <div className="text-xs text-gray-500/60 mt-1">
            {consciousnessState.resonance === 'alpha' && 'Relaxed Awareness'}
            {consciousnessState.resonance === 'beta' && 'Active Focus'}
            {consciousnessState.resonance === 'gamma' && 'Peak Performance'}
            {consciousnessState.resonance === 'theta' && 'Deep Meditation'}
            {consciousnessState.resonance === 'delta' && 'Unconscious State'}
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="space-y-4">
          
          {/* Coherence Level */}
          <div className="border-l-2 border-cyan-500/40 pl-3 hover:border-cyan-400/60 transition-colors duration-300">
            <div className="text-xs text-gray-400/60 uppercase tracking-wider">COHERENCE</div>
            <div className="text-lg font-mono text-cyan-300/90 transition-colors duration-300">
              {(consciousnessState.coherence * 100).toFixed(1)}%
            </div>
            <div className="w-full bg-gray-800/40 rounded-full h-2 mt-1 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-600/60 to-cyan-400/80 h-2 rounded-full transition-all duration-1000 relative"
                style={{ width: `${consciousnessState.coherence * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              </div>
            </div>
          </div>

          {/* Phase Drift Index */}
          <div className="border-l-2 border-violet-500/40 pl-3 hover:border-violet-400/60 transition-colors duration-300">
            <div className="text-xs text-gray-400/60 uppercase tracking-wider">PHASE DRIFT</div>
            <div className="text-lg font-mono text-violet-300/90 transition-colors duration-300">
              {phaseDriftIndex.toFixed(3)}
            </div>
            <div className="flex space-x-1 mt-1">
              {Array.from({ length: 10 }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${
                    i < phaseDriftIndex * 10 
                      ? 'bg-violet-400/80 shadow-sm shadow-violet-400/50' 
                      : 'bg-gray-700/40'
                  }`}
                  style={{
                    transform: i < phaseDriftIndex * 10 ? `scale(${1 + Math.sin(pulsePhase + i) * 0.2})` : 'scale(1)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Biometric Resonance */}
          <div className="border-l-2 border-emerald-500/40 pl-3 hover:border-emerald-400/60 transition-colors duration-300">
            <div className="text-xs text-gray-400/60 uppercase tracking-wider">BIO RESONANCE</div>
            <div className="text-lg font-mono text-emerald-300/90 transition-colors duration-300">
              {(biometricResonanceScore * 100).toFixed(0)}
            </div>
            <div className="relative mt-1">
              <div className="absolute inset-0 bg-gray-800/30 rounded-full"></div>
              <div 
                className="bg-gradient-to-r from-emerald-600/50 to-emerald-400/70 h-2 rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${biometricResonanceScore * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
          </div>

        </div>

        {/* Enhanced Frequency Display */}
        <div className="pt-4 border-t border-gray-700/30">
          <div className="text-xs text-gray-400/60 uppercase tracking-wider text-center">CARRIER FREQUENCY</div>
          <div className="text-lg font-mono text-gray-300/90 text-center mt-1">
            {consciousnessState.frequency.toFixed(1)} Hz
          </div>
          <div className="flex justify-center mt-2">
            <div 
              className="w-16 h-1 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent rounded-full"
              style={{
                opacity: 0.5 + Math.sin(pulsePhase * 3) * 0.3,
                transform: `scaleX(${0.8 + Math.sin(pulsePhase * 2) * 0.2})`
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
