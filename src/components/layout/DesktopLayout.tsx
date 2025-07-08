
import { SymbolicHUD } from '@/components/operational/SymbolicHUD';
import { ToggleArray } from '@/components/operational/ToggleArray';
import { ResonanceVisualizer } from '@/components/operational/ResonanceVisualizer';
import { SemanticInputChannel } from '@/components/operational/SemanticInputChannel';
import { NoeticsConsole } from '@/components/operational/NoeticsConsole';
import { BiometricSimulator } from '@/components/operational/BiometricSimulator';
import { AudioEngine } from '@/components/operational/AudioEngine';
import { ParameterControl } from '@/components/operational/ParameterControl';
import { QuantumEntanglementVisualizer } from '@/components/advanced/QuantumEntanglementVisualizer';
import { MultidimensionalMapper } from '@/components/advanced/MultidimensionalMapper';
import { TemporalCohesionField } from '@/components/advanced/TemporalCohesionField';

interface DesktopLayoutProps {
  consciousnessState: any;
  operationalMode: any;
  visualizerMode: 'cymatic' | 'spectral' | 'attractor';
  carrierDepth: number;
  textInput: string;
  isActive: boolean;
  updateConsciousnessState: (newState: any) => void;
  updateOperationalMode: (mode: any) => void;
  setVisualizerMode: (mode: 'cymatic' | 'spectral' | 'attractor') => void;
  setCarrierDepth: (depth: number) => void;
  setTextInput: (text: string) => void;
  setIsActive: (active: boolean) => void;
  handleBiometricUpdate: (data: any) => void;
}

export const DesktopLayout = ({
  consciousnessState,
  operationalMode,
  visualizerMode,
  carrierDepth,
  textInput,
  isActive,
  updateConsciousnessState,
  updateOperationalMode,
  setVisualizerMode,
  setCarrierDepth,
  setTextInput,
  setIsActive,
  handleBiometricUpdate
}: DesktopLayoutProps) => {
  return (
    <div className="relative z-20 min-h-screen p-6 grid grid-cols-12 grid-rows-12 gap-4">
      
      {/* Top Left - Symbolic HUD */}
      <div className="col-span-3 row-span-3">
        <SymbolicHUD 
          consciousnessState={consciousnessState}
          phaseDriftIndex={consciousnessState.phaseDriftIndex}
          biometricResonanceScore={consciousnessState.biometricResonanceScore}
        />
      </div>

      {/* Top Right - Toggle Array */}
      <div className="col-span-3 col-start-10 row-span-3">
        <ToggleArray 
          operationalMode={operationalMode}
          onModeChange={updateOperationalMode}
        />
      </div>

      {/* Top Center - Biometric Simulator */}
      {isActive && (
        <div className="col-span-3 col-start-5 row-span-2">
          <BiometricSimulator 
            isActive={isActive}
            onBiometricUpdate={handleBiometricUpdate}
          />
        </div>
      )}

      {/* Audio Engine */}
      <div className="col-span-2 row-span-1 row-start-3 col-start-5">
        <AudioEngine
          isActive={isActive}
          operationalMode={operationalMode}
          consciousnessState={consciousnessState}
        />
      </div>

      {/* Parameter Control */}
      {isActive && (
        <div className="col-span-2 row-span-2 row-start-3 col-start-7">
          <ParameterControl
            consciousnessState={consciousnessState}
            onStateChange={updateConsciousnessState}
            isActive={isActive}
          />
        </div>
      )}

      {/* Center - Dynamic Resonance Visualizer */}
      <div className="col-span-6 col-start-4 row-span-6 row-start-4">
        <ResonanceVisualizer 
          state={consciousnessState}
          mode={visualizerMode}
          onModeChange={setVisualizerMode}
          isActive={isActive}
        />
      </div>

      {/* Bottom Left - Semantic Input Channel */}
      <div className="col-span-3 row-span-3 row-start-10">
        <SemanticInputChannel
          textInput={textInput}
          setTextInput={setTextInput}
          isActive={isActive}
          setIsActive={setIsActive}
          onStateChange={updateConsciousnessState}
          operationalMode={operationalMode}
        />
      </div>

      {/* Quantum Systems Panel */}
      <div className="col-span-2 row-span-3 row-start-10 col-start-4 space-y-2">
        <QuantumEntanglementVisualizer
          consciousnessState={consciousnessState}
          isActive={isActive}
          onEntanglementChange={(strength) => 
            updateConsciousnessState({ entanglementStrength: strength })
          }
        />
      </div>

      <div className="col-span-3 row-span-3 row-start-10 col-start-6 grid grid-cols-1 gap-2">
        <MultidimensionalMapper
          consciousnessState={consciousnessState}
          isActive={isActive}
        />
        <TemporalCohesionField
          consciousnessState={consciousnessState}
          isActive={isActive}
          onTemporalShift={(timeIndex) => 
            updateConsciousnessState({ temporalIndex: timeIndex })
          }
        />
      </div>

      {/* Bottom Right - Noetics Console */}
      <div className="col-span-4 col-start-9 row-span-3 row-start-10">
        <NoeticsConsole 
          consciousnessState={consciousnessState}
          textInput={textInput}
          isActive={isActive}
        />
      </div>

      {/* Carrier Depth Control - Desktop */}
      <div className="col-span-2 row-span-1 row-start-1 col-start-6 flex items-center justify-center">
        <div className="bg-black/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-gray-700/20">
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.01"
            value={carrierDepth}
            onChange={(e) => setCarrierDepth(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700/30 rounded-lg appearance-none cursor-pointer opacity-40 hover:opacity-80 transition-opacity duration-300"
          />
          <div className="text-xs text-gray-400/60 text-center mt-1 tracking-wider">CARRIER</div>
        </div>
      </div>
    </div>
  );
};
