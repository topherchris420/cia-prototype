
import { BiometricState } from '@/lib/neuroadaptive/BiometricAnalyzer';
import { ConsciousnessVector3D } from '@/lib/neuroadaptive/PhaseSpaceDriftTracker';

interface BiometricDisplayProps {
  biometricState: BiometricState;
  consciousnessVector: ConsciousnessVector3D | null;
}

export const BiometricDisplay = ({ biometricState, consciousnessVector }: BiometricDisplayProps) => {
  return (
    <div className="space-y-4">
      {/* Real-time Biometric Status */}
      <div className="space-y-3 p-4 bg-black/30 rounded-xl border border-cyan-500/20">
        <div className="text-xs text-cyan-300/70 uppercase tracking-wider mb-3">
          Live Consciousness Metrics
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="text-center">
            <span className="text-white/50 block">Cognitive Load</span>
            <span className="text-cyan-300 text-lg font-light">{Math.round(biometricState.cognitiveLoad * 100)}%</span>
          </div>
          <div className="text-center">
            <span className="text-white/50 block">Attention Vector</span>
            <span className="text-green-300 text-lg font-light">{Math.round(biometricState.attentionLevel * 100)}%</span>
          </div>
          <div className="text-center">
            <span className="text-white/50 block">Emotional Field</span>
            <span className="text-purple-300 text-lg font-light">{Math.round(biometricState.emotionalValence * 100)}%</span>
          </div>
          <div className="text-center">
            <span className="text-white/50 block">Voice Resonance</span>
            <span className="text-yellow-300 text-lg font-light">{Math.round(biometricState.voiceStress * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Phase Space Coordinates */}
      {consciousnessVector && (
        <div className="p-3 bg-black/40 rounded-lg border border-indigo-500/20">
          <div className="text-xs text-indigo-300/70 uppercase tracking-wider mb-2">
            Phase Space Coordinates
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs text-center">
            <div>
              <span className="text-white/50 block">Cognitive X</span>
              <span className="text-indigo-300">{consciousnessVector.x.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-white/50 block">Emotional Y</span>
              <span className="text-indigo-300">{consciousnessVector.y.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-white/50 block">Attentional Z</span>
              <span className="text-indigo-300">{consciousnessVector.z.toFixed(3)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
