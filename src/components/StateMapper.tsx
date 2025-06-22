
interface StateMapperProps {
  state: {
    frequency: number;
    amplitude: number;
    coherence: number;
    depth: number;
    resonance: string;
  };
}

export const StateMapper = ({ state }: StateMapperProps) => {
  const getResonanceDescription = (resonance: string): string => {
    const descriptions: Record<string, string> = {
      alpha: 'Relaxed Awareness',
      beta: 'Active Focus',
      gamma: 'Peak Insight',
      delta: 'Deep Integration',
      theta: 'Creative Flow'
    };
    return descriptions[resonance] || 'Neutral State';
  };

  const getResonanceColor = (resonance: string): string => {
    const colors: Record<string, string> = {
      alpha: 'text-blue-300',
      beta: 'text-green-300',
      gamma: 'text-yellow-300',
      delta: 'text-purple-300',
      theta: 'text-cyan-300'
    };
    return colors[resonance] || 'text-white';
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-6">
      <h3 className="text-xl text-white/90 font-light">Consciousness Map</h3>
      
      {/* Current Resonance State */}
      <div className="text-center space-y-2">
        <div className={`text-2xl font-light ${getResonanceColor(state.resonance)}`}>
          {state.resonance.toUpperCase()}
        </div>
        <div className="text-sm text-white/60">
          {getResonanceDescription(state.resonance)}
        </div>
      </div>

      {/* State Indicators */}
      <div className="space-y-4">
        {/* Frequency */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Frequency</span>
            <span className="text-white/90">{Math.round(state.frequency)} Hz</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(state.frequency / 800) * 100}%` }}
            />
          </div>
        </div>

        {/* Amplitude */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Amplitude</span>
            <span className="text-white/90">{Math.round(state.amplitude * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.amplitude * 100}%` }}
            />
          </div>
        </div>

        {/* Coherence */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Coherence</span>
            <span className="text-white/90">{Math.round(state.coherence * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.coherence * 100}%` }}
            />
          </div>
        </div>

        {/* Depth */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Depth</span>
            <span className="text-white/90">{Math.round(state.depth * 100)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.depth * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Symbolic Representation */}
      <div className="text-center space-y-2">
        <div className="text-xs text-white/50 uppercase tracking-wider">Symbolic State</div>
        <div className="text-2xl">
          {state.coherence > 0.7 ? '⧬' : state.amplitude > 0.6 ? '◊' : state.depth > 0.5 ? '▲' : '○'}
        </div>
      </div>
    </div>
  );
};
