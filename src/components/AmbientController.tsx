
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

interface AmbientControllerProps {
  state: {
    frequency: number;
    amplitude: number;
    coherence: number;
    depth: number;
    resonance: string;
  };
  onStateChange: (state: any) => void;
}

export const AmbientController = ({ state, onStateChange }: AmbientControllerProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(50);

  const resonanceModes = [
    { key: 'alpha', name: 'Alpha', desc: 'Relaxed Awareness', color: 'bg-blue-500' },
    { key: 'beta', name: 'Beta', desc: 'Active Focus', color: 'bg-green-500' },
    { key: 'gamma', name: 'Gamma', desc: 'Peak Insight', color: 'bg-yellow-500' },
    { key: 'delta', name: 'Delta', desc: 'Deep Integration', color: 'bg-purple-500' },
    { key: 'theta', name: 'Theta', desc: 'Creative Flow', color: 'bg-cyan-500' }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="flex flex-col space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg text-white/90 font-light">Ambient Field Control</h3>
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Resonance Mode Selection */}
        <div className="space-y-3">
          <label className="text-purple-300/80 text-sm font-light">
            Resonance Mode
          </label>
          <div className="grid grid-cols-5 gap-2">
            {resonanceModes.map((mode) => (
              <Button
                key={mode.key}
                onClick={() => onStateChange({ resonance: mode.key })}
                variant="ghost"
                className={`flex flex-col p-3 h-auto ${
                  state.resonance === mode.key 
                    ? 'bg-white/20 text-white border border-white/30' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${mode.color} mb-1`} />
                <span className="text-xs">{mode.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Fine Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Resonance Intensity */}
          <div className="space-y-2">
            <label className="text-white/70 text-sm">Resonance Intensity</label>
            <Slider
              value={[state.amplitude * 100]}
              onValueChange={(value) => onStateChange({ amplitude: value[0] / 100 })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* Field Coherence */}
          <div className="space-y-2">
            <label className="text-white/70 text-sm">Field Coherence</label>
            <Slider
              value={[state.coherence * 100]}
              onValueChange={(value) => onStateChange({ coherence: value[0] / 100 })}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="text-center">
              <div className="text-white/50">Field Frequency</div>
              <div className="text-white/80">{Math.round(state.frequency)} Hz</div>
            </div>
            <div className="text-center">
              <div className="text-white/50">Depth Factor</div>
              <div className="text-white/80">{Math.round(state.depth * 100)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
