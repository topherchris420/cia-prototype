
import { useState, useEffect } from 'react';
import { ConsciousnessField } from '@/components/ConsciousnessField';
import { SymbolicHUD } from '@/components/operational/SymbolicHUD';
import { ToggleArray } from '@/components/operational/ToggleArray';
import { ResonanceVisualizer } from '@/components/operational/ResonanceVisualizer';
import { SemanticInputChannel } from '@/components/operational/SemanticInputChannel';
import { NoeticsConsole } from '@/components/operational/NoeticsConsole';
import { SubliminalCarrierLayer } from '@/components/operational/SubliminalCarrierLayer';

const Index = () => {
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

  const updateConsciousnessState = (newState: Partial<typeof consciousnessState>) => {
    setConsciousnessState(prev => ({ ...prev, ...newState }));
  };

  const updateOperationalMode = (mode: Partial<typeof operationalMode>) => {
    setOperationalMode(prev => ({ ...prev, ...mode }));
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

      {/* Operational Interface Grid */}
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

        {/* Carrier Depth Control - Minimal overlay */}
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
    </div>
  );
};

export default Index;
