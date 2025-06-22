
import { useState, useEffect, useRef } from 'react';
import { ConsciousnessField } from '@/components/ConsciousnessField';
import { InputResonator } from '@/components/InputResonator';
import { StateMapper } from '@/components/StateMapper';
import { AmbientController } from '@/components/AmbientController';

const Index = () => {
  const [consciousnessState, setConsciousnessState] = useState({
    frequency: 432,
    amplitude: 0.5,
    coherence: 0.7,
    depth: 0.3,
    resonance: 'alpha'
  });

  const [textInput, setTextInput] = useState('');
  const [isActive, setIsActive] = useState(false);

  const updateConsciousnessState = (newState: Partial<typeof consciousnessState>) => {
    setConsciousnessState(prev => ({ ...prev, ...newState }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Ambient Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
      
      {/* Main Consciousness Field */}
      <ConsciousnessField 
        state={consciousnessState}
        isActive={isActive}
      />

      {/* Floating Interface Elements */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Header */}
        <div className="p-6 text-center">
          <h1 className="text-4xl md:text-6xl font-light text-white/90 tracking-wider mb-2">
            Vers5Dynamics
          </h1>
          <p className="text-purple-300/70 text-sm tracking-wide">
            consciousness • resonance • exploration
          </p>
        </div>

        {/* Main Interface */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Resonator */}
            <div className="lg:col-span-2">
              <InputResonator
                onStateChange={updateConsciousnessState}
                textInput={textInput}
                setTextInput={setTextInput}
                isActive={isActive}
                setIsActive={setIsActive}
              />
            </div>

            {/* State Mapper */}
            <div>
              <StateMapper state={consciousnessState} />
            </div>
          </div>
        </div>

        {/* Ambient Controls */}
        <div className="p-6">
          <AmbientController 
            state={consciousnessState}
            onStateChange={updateConsciousnessState}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
