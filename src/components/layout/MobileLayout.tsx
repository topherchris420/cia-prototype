
import { SymbolicHUD } from '@/components/operational/SymbolicHUD';
import { ToggleArray } from '@/components/operational/ToggleArray';
import { ResonanceVisualizer } from '@/components/operational/ResonanceVisualizer';
import { SemanticInputChannel } from '@/components/operational/SemanticInputChannel';
import { NoeticsConsole } from '@/components/operational/NoeticsConsole';
import { BiometricSimulator } from '@/components/operational/BiometricSimulator';
import { AudioEngine } from '@/components/operational/AudioEngine';
import { ParameterControl } from '@/components/operational/ParameterControl';

interface MobileLayoutProps {
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

export const MobileLayout = ({
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
}: MobileLayoutProps) => {
  return (
    <div className="relative z-20 min-h-screen p-3 space-y-4">
      
      {/* Top Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          <div className="h-32">
            <SymbolicHUD 
              consciousnessState={consciousnessState}
              phaseDriftIndex={consciousnessState.phaseDriftIndex}
              biometricResonanceScore={consciousnessState.biometricResonanceScore}
            />
          </div>
          {isActive && (
            <div className="h-32">
              <BiometricSimulator 
                isActive={isActive}
                onBiometricUpdate={handleBiometricUpdate}
              />
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="h-32">
            <ToggleArray 
              operationalMode={operationalMode}
              onModeChange={updateOperationalMode}
            />
          </div>
          <div className="h-16">
            <AudioEngine
              isActive={isActive}
              operationalMode={operationalMode}
              consciousnessState={consciousnessState}
            />
          </div>
          {isActive && (
            <div className="h-16">
              <ParameterControl
                consciousnessState={consciousnessState}
                onStateChange={updateConsciousnessState}
                isActive={isActive}
              />
            </div>
          )}
        </div>
      </div>

      {/* Carrier Control */}
      <div className="flex justify-center">
        <div className="bg-black/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/20 w-full max-w-xs">
          <input
            type="range"
            min="0.05"
            max="0.5"
            step="0.01"
            value={carrierDepth}
            onChange={(e) => setCarrierDepth(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700/30 rounded-lg appearance-none cursor-pointer opacity-40 hover:opacity-80 transition-opacity duration-300"
          />
          <div className="text-xs text-gray-400/60 text-center mt-1 tracking-wider">CARRIER</div>
        </div>
      </div>

      {/* Center Visualizer */}
      <div className="h-80">
        <ResonanceVisualizer 
          state={consciousnessState}
          mode={visualizerMode}
          onModeChange={setVisualizerMode}
          isActive={isActive}
        />
      </div>

      {/* Bottom Controls */}
      <div className="space-y-4">
        <div className="h-48">
          <SemanticInputChannel
            textInput={textInput}
            setTextInput={setTextInput}
            isActive={isActive}
            setIsActive={setIsActive}
            onStateChange={updateConsciousnessState}
            operationalMode={operationalMode}
          />
        </div>
        <div className="h-64">
          <NoeticsConsole 
            consciousnessState={consciousnessState}
            textInput={textInput}
            isActive={isActive}
          />
        </div>
      </div>
    </div>
  );
};
