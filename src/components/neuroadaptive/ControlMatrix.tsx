
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Globe, Zap } from 'lucide-react';
import { BiometricState } from '@/lib/neuroadaptive/BiometricAnalyzer';

interface ControlMatrixProps {
  isListening: boolean;
  isActive: boolean;
  planetarySync: boolean;
  entropyMode: boolean;
  biometricState: BiometricState | null;
  currentTarget: string;
  startEntrainment: () => void;
  stopEntrainment: () => void;
  togglePlanetarySync: () => void;
  injectEntropy: () => void;
}

export const ControlMatrix = ({
  isListening,
  isActive,
  planetarySync,
  entropyMode,
  biometricState,
  currentTarget,
  startEntrainment,
  stopEntrainment,
  togglePlanetarySync,
  injectEntropy
}: ControlMatrixProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Neural Entrainment */}
      <div className="space-y-3">
        <label className="text-purple-300/80 text-xs font-light tracking-wider uppercase">
          Binaural Matrix
        </label>
        <div className="flex gap-2">
          <Button
            onClick={startEntrainment}
            disabled={!isActive || !biometricState}
            className="flex-1 bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 transition-all duration-300"
          >
            {isListening ? (
              <>
                <div className="w-3 h-3 mr-2 bg-green-400 rounded-full animate-pulse" />
                Entraining {currentTarget.toUpperCase()}
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Neural Sync
              </>
            )}
          </Button>
          {isListening && (
            <Button
              onClick={stopEntrainment}
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <MicOff className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Planetary Synchronization */}
      <div className="space-y-3">
        <label className="text-purple-300/80 text-xs font-light tracking-wider uppercase">
          Planetary Alignment
        </label>
        <Button
          onClick={togglePlanetarySync}
          className={`w-full ${
            planetarySync 
              ? 'bg-green-500/30 text-green-300 border border-green-400/50' 
              : 'bg-black/20 text-white/70 border border-purple-500/20'
          } transition-all duration-300`}
        >
          <Globe className="w-4 h-4 mr-2" />
          {planetarySync ? 'Schumann Sync' : 'Local Field'}
        </Button>
      </div>

      {/* Entropy Injection */}
      <div className="space-y-3">
        <label className="text-purple-300/80 text-xs font-light tracking-wider uppercase">
          State Transition
        </label>
        <Button
          onClick={injectEntropy}
          disabled={!isActive}
          className={`w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 transition-all duration-300 ${
            entropyMode ? 'animate-pulse' : ''
          }`}
        >
          <Zap className="w-4 h-4 mr-2" />
          Paradox Loop
        </Button>
      </div>
    </div>
  );
};
