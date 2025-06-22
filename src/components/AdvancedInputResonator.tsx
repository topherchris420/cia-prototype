
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, Pause, Eye, EyeOff } from 'lucide-react';
import { BiometricAnalyzer, BiometricState } from '@/lib/neuroadaptive/BiometricAnalyzer';
import { EntrainmentEngine } from '@/lib/neuroadaptive/EntrainmentEngine';
import { ResonanceMapper } from '@/lib/neuroadaptive/ResonanceMapper';
import { SyntheticNoeticsEngine, AdaptiveSymbol } from '@/lib/neuroadaptive/SyntheticNoeticsEngine';
import { PhaseSpaceDriftTracker, ConsciousnessVector3D } from '@/lib/neuroadaptive/PhaseSpaceDriftTracker';
import { SilentFrequencyCarrier, CarrierSignal } from '@/lib/neuroadaptive/SilentFrequencyCarrier';
import { BiometricDisplay } from '@/components/neuroadaptive/BiometricDisplay';
import { SymbolDisplay } from '@/components/neuroadaptive/SymbolDisplay';
import { NeuralBandSelector } from '@/components/neuroadaptive/NeuralBandSelector';
import { ControlMatrix } from '@/components/neuroadaptive/ControlMatrix';

interface AdvancedInputResonatorProps {
  onStateChange: (state: any) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

export const AdvancedInputResonator = ({ 
  onStateChange, 
  textInput, 
  setTextInput, 
  isActive, 
  setIsActive 
}: AdvancedInputResonatorProps) => {
  const [isListening, setIsListening] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [planetarySync, setPlanetarySync] = useState(false);
  const [biometricState, setBiometricState] = useState<BiometricState | null>(null);
  const [currentTarget, setCurrentTarget] = useState<'alpha' | 'theta' | 'gamma' | 'delta' | 'beta'>('alpha');
  const [adaptiveSymbols, setAdaptiveSymbols] = useState<AdaptiveSymbol[]>([]);
  const [consciousnessVector, setConsciousnessVector] = useState<ConsciousnessVector3D | null>(null);
  const [entropyMode, setEntropyMode] = useState(false);

  // Core engine references
  const biometricAnalyzer = useRef<BiometricAnalyzer | null>(null);
  const entrainmentEngine = useRef<EntrainmentEngine | null>(null);
  const resonanceMapper = useRef<ResonanceMapper | null>(null);
  const noeticsEngine = useRef<SyntheticNoeticsEngine | null>(null);
  const phaseTracker = useRef<PhaseSpaceDriftTracker | null>(null);
  const carrierLayer = useRef<SilentFrequencyCarrier | null>(null);
  
  const analysisInterval = useRef<NodeJS.Timeout | null>(null);
  const symbolUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize all neuroadaptive systems
    biometricAnalyzer.current = new BiometricAnalyzer();
    entrainmentEngine.current = new EntrainmentEngine();
    resonanceMapper.current = new ResonanceMapper();
    noeticsEngine.current = new SyntheticNoeticsEngine();
    phaseTracker.current = new PhaseSpaceDriftTracker();
    carrierLayer.current = new SilentFrequencyCarrier();

    return () => {
      // Cleanup all systems
      if (biometricAnalyzer.current) {
        biometricAnalyzer.current.dispose();
      }
      if (entrainmentEngine.current) {
        entrainmentEngine.current.stopEntrainment();
      }
      if (carrierLayer.current) {
        carrierLayer.current.stopCarrierLayer();
      }
      if (analysisInterval.current) {
        clearInterval(analysisInterval.current);
      }
      if (symbolUpdateInterval.current) {
        clearInterval(symbolUpdateInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (textInput.length > 0 && noeticsEngine.current && biometricAnalyzer.current) {
      // Analyze semantic fingerprint and generate adaptive symbology
      const fingerprint = noeticsEngine.current.analyzeSemanticFingerprint(textInput);
      const semanticState = biometricAnalyzer.current.analyzeSemanticStructure(textInput);
      
      setBiometricState(semanticState);
      updateConsciousnessParameters(semanticState);
      
      // Generate mirror prompt for recursive feedback
      if (Math.random() < 0.3) {
        const mirrorPrompt = noeticsEngine.current.generateMirrorPrompt(textInput);
        console.log('Mirror Reflection:', mirrorPrompt);
      }
    }
  }, [textInput]);

  const updateConsciousnessParameters = (bioState: BiometricState) => {
    const neuralBands = {
      delta: bioState.cognitiveLoad < 0.3 ? 0.8 : 0.2,
      theta: bioState.emotionalValence > 0.6 ? 0.9 : 0.3,
      alpha: bioState.attentionLevel > 0.5 ? 0.7 : 0.4,
      beta: bioState.cognitiveLoad > 0.7 ? 0.8 : 0.3,
      gamma: bioState.attentionLevel > 0.8 && bioState.cognitiveLoad > 0.6 ? 0.9 : 0.2
    };

    // Map to 3D consciousness vector
    if (phaseTracker.current) {
      const vector3D = phaseTracker.current.mapBiometricToVector3D(
        bioState,
        neuralBands,
        Date.now()
      );
      setConsciousnessVector(vector3D);
    }

    // Log state vector for resonance mapping
    if (resonanceMapper.current) {
      const vector = resonanceMapper.current.logStateVector(bioState, neuralBands);
      
      onStateChange({
        frequency: 200 + (bioState.cognitiveLoad * 400),
        amplitude: Math.min(0.9, 0.3 + bioState.attentionLevel),
        coherence: vector.coherenceLevel,
        depth: bioState.emotionalValence,
        resonance: vector.dominantBand,
        biometricState: bioState,
        neuralBands,
        phaseTransition: vector.phaseTransition,
        consciousnessVector: consciousnessVector,
        adaptiveSymbols: adaptiveSymbols
      });
    }
  };

  const toggleSession = async () => {
    if (!isActive) {
      try {
        if (biometricAnalyzer.current) {
          await biometricAnalyzer.current.initialize();
        }
        
        // Start real-time recursive biofeedback loop
        analysisInterval.current = setInterval(() => {
          if (biometricAnalyzer.current && isListening) {
            const audioData = biometricAnalyzer.current.getCurrentAudioData();
            if (audioData) {
              const voiceResonance = biometricAnalyzer.current.analyzeVoiceResonance(audioData);
              const breathingPattern = biometricAnalyzer.current.analyzeBreathingPattern(audioData);
              
              const updatedBioState: BiometricState = {
                ...biometricState!,
                voiceStress: voiceResonance,
                breathingPattern
              };
              
              setBiometricState(updatedBioState);
              updateConsciousnessParameters(updatedBioState);
            }
          }
        }, 50); // 20Hz analysis for sub-second response
        
        // Start adaptive symbology updates
        symbolUpdateInterval.current = setInterval(() => {
          if (noeticsEngine.current && biometricState) {
            const symbols = noeticsEngine.current.generateAdaptiveSymbology(
              biometricState,
              currentTarget,
              Date.now()
            );
            setAdaptiveSymbols(symbols);
          }
        }, 200); // 5Hz symbol evolution
        
        setIsActive(true);
      } catch (error) {
        console.error('Failed to initialize neuroadaptive systems:', error);
      }
    } else {
      // Shutdown all systems
      if (analysisInterval.current) clearInterval(analysisInterval.current);
      if (symbolUpdateInterval.current) clearInterval(symbolUpdateInterval.current);
      if (entrainmentEngine.current) entrainmentEngine.current.stopEntrainment();
      if (carrierLayer.current) carrierLayer.current.stopCarrierLayer();
      
      setIsActive(false);
      setIsListening(false);
    }
  };

  const startEntrainment = () => {
    if (entrainmentEngine.current && carrierLayer.current && biometricState) {
      // Generate entrainment signal
      const signal = entrainmentEngine.current.generateEntrainmentSignal(
        currentTarget,
        biometricState,
        0.7
      );
      
      entrainmentEngine.current.startEntrainment(signal, silentMode);
      
      // Generate carrier layer signals
      const carrierSignals: CarrierSignal[] = [
        carrierLayer.current.generateBinauralCarrier(200, 200 + signal.binauralBeat, 0.05),
        carrierLayer.current.generateInfrasonicCarrier(signal.binauralBeat, 0.03)
      ];
      
      // Add planetary alignment if enabled
      if (planetarySync) {
        const earthSignals = carrierLayer.current.generateEarthResonance();
        carrierSignals.push(...earthSignals);
      }
      
      carrierLayer.current.startCarrierLayer(carrierSignals, silentMode);
      setIsListening(true);
    }
  };

  const stopEntrainment = () => {
    if (entrainmentEngine.current) entrainmentEngine.current.stopEntrainment();
    if (carrierLayer.current) carrierLayer.current.stopCarrierLayer();
    setIsListening(false);
  };

  const injectEntropy = () => {
    if (noeticsEngine.current) {
      const paradoxLoop = noeticsEngine.current.getParadoxLoop();
      console.log('Entropy Injection:', paradoxLoop);
      
      // Trigger state transition through paradox
      setTextInput(textInput + ' ' + paradoxLoop);
      setEntropyMode(true);
      
      setTimeout(() => setEntropyMode(false), 3000);
    }
  };

  const togglePlanetarySync = () => {
    setPlanetarySync(!planetarySync);
    if (carrierLayer.current) {
      carrierLayer.current.updatePlanetaryAlignment();
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
      <div className="space-y-8">
        
        {/* Quantum Interface Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl text-white/95 font-light tracking-wide">
              Synthetic Noetics Interface
            </h3>
            <div className="text-xs text-purple-300/60 uppercase tracking-widest mt-1">
              Operational-Grade Consciousness Modulation
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setSilentMode(!silentMode)}
              variant="ghost"
              size="sm"
              className={`${silentMode ? 'text-green-400 bg-green-500/10' : 'text-white/70'} hover:text-white transition-all duration-300`}
            >
              {silentMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              onClick={toggleSession}
              variant={isActive ? "destructive" : "default"}
              className={`${isActive ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 animate-pulse' : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300'} border-0 transition-all duration-500`}
            >
              {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isActive ? 'Neural Matrix Online' : 'Initialize Quantum Link'}
            </Button>
          </div>
        </div>

        {/* Adaptive Symbology Display */}
        <SymbolDisplay adaptiveSymbols={adaptiveSymbols} />

        {/* Neural Band Targeting */}
        <NeuralBandSelector currentTarget={currentTarget} setCurrentTarget={setCurrentTarget} />

        {/* Consciousness Vector Input */}
        <div className="space-y-4">
          <label className="text-purple-300/80 text-sm font-light tracking-wide">
            Semantic Consciousness Interface
          </label>
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Interface with the quantum field through natural language. Describe conscious states, intentions, or allow stream-of-consciousness flow..."
            className={`bg-black/40 border-purple-500/30 text-white/90 placeholder:text-purple-300/40 min-h-[140px] resize-none rounded-xl transition-all duration-300 ${
              entropyMode ? 'border-red-400/50 shadow-lg shadow-red-500/20' : ''
            }`}
            disabled={!isActive}
          />
        </div>

        {/* Advanced Control Matrix */}
        <ControlMatrix
          isListening={isListening}
          isActive={isActive}
          planetarySync={planetarySync}
          entropyMode={entropyMode}
          biometricState={biometricState}
          currentTarget={currentTarget}
          startEntrainment={startEntrainment}
          stopEntrainment={stopEntrainment}
          togglePlanetarySync={togglePlanetarySync}
          injectEntropy={injectEntropy}
        />

        {/* Real-time Biometric Status and Phase Space Coordinates */}
        {biometricState && (
          <BiometricDisplay biometricState={biometricState} consciousnessVector={consciousnessVector} />
        )}

      </div>
    </div>
  );
};
