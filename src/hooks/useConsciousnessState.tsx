
import { useState } from 'react';

export const useConsciousnessState = () => {
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

  return {
    consciousnessState,
    operationalMode,
    visualizerMode,
    carrierDepth,
    textInput,
    isActive,
    biometricData,
    updateConsciousnessState,
    updateOperationalMode,
    setVisualizerMode,
    setCarrierDepth,
    setTextInput,
    setIsActive,
    setBiometricData,
    handleBiometricUpdate
  };
};
