
import { useState, useEffect } from 'react';
import { ConsciousnessField } from '@/components/ConsciousnessField';
import { SymbolicHUD } from '@/components/operational/SymbolicHUD';
import { ToggleArray } from '@/components/operational/ToggleArray';
import { ResonanceVisualizer } from '@/components/operational/ResonanceVisualizer';
import { SemanticInputChannel } from '@/components/operational/SemanticInputChannel';
import { NoeticsConsole } from '@/components/operational/NoeticsConsole';
import { SubliminalCarrierLayer } from '@/components/operational/SubliminalCarrierLayer';
import { BiometricSimulator } from '@/components/operational/BiometricSimulator';
import { AudioEngine } from '@/components/operational/AudioEngine';
import { ParameterControl } from '@/components/operational/ParameterControl';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  const [consciousnessState, setConsciousnessState] = useState({
    frequency: 432,
    amplitude: 0.5,
    coherence: 0.7,
    depth: 0.3,
    resonance: 'alpha',
    biometricState: null,
    neuralBands: null,
    phaseTransition: false,
    phaseDriftIndex: 0.23,
    biometricResonanceScore: 0.76
  });

  const [operationalMode, setOperationalMode] = useState({
    silentOps: false,
    entropyPulse: false,
    phaseLock: false
  });

  const [visualizerMode, setVisualizerMode] = useState<'cymatic' | 'spectral' | 'attractor'>('cymatic');
  const [carrierDepth, setCarrierDepth] = useState(0.15);
  const [textInput, setTextInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [biometricData, setBiometricData] = useState(null);

  const updateConsciousnessState = (newState: Partial<typeof consciousnessState>) => {
    setConsciousnessState(prev => ({ ...prev, ...newState }));
  };

  const updateOperationalMode = (mode: Partial<typeof operationalMode>) => {
    setOperationalMode(prev => ({ ...prev, ...mode }));
  };

  const handleBiometricUpdate = (data: any) => {
    setBiometricData(data);
    // Integrate biometric data into consciousness state
    updateConsciousnessState({
      amplitude: Math.min(0.9, consciousnessState.amplitude + (data.coherenceLevel * 0.1)),
      coherence: Math.max(0.1, data.coherenceLevel),
      biometricResonanceScore: data.coherenceLevel
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-gray-950 overflow-hidden relative">
      
      {/* Subliminal Carrier Layer */}
      <SubliminalCarrierLayer depth={carrierDepth} isActive={isActive} />
      
      {/* Background Consciousness Field */}
      <ConsciousnessField 
        state={consciousnessState}
        isActive={isActive}
        opacity={0.3}
      />

      {/* Mobile Layout */}
      {isMobile ? (
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
      ) : (
        /* Desktop Layout */
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
          <div className="col-span-5 row-span-3 row-start-10">
            <SemanticInputChannel
              textInput={textInput}
              setTextInput={setTextInput}
              isActive={isActive}
              setIsActive={setIsActive}
              onStateChange={updateConsciousnessState}
              operationalMode={operationalMode}
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
      )}
    </div>
  );
};

export default Index;
