
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Play, Pause, Eye, EyeOff, Zap, Globe } from 'lucide-react';
import { BiometricAnalyzer, BiometricState } from '@/lib/neuroadaptive/BiometricAnalyzer';
import { EntrainmentEngine } from '@/lib/neuroadaptive/EntrainmentEngine';
import { ResonanceMapper } from '@/lib/neuroadaptive/ResonanceMapper';
import { SyntheticNoeticsEngine, AdaptiveSymbol } from '@/lib/neuroadaptive/SyntheticNoeticsEngine';
import { PhaseSpaceDriftTracker, ConsciousnessVector3D } from '@/lib/neuroadaptive/PhaseSpaceDriftTracker';
import { SilentFrequencyCarrier, CarrierSignal } from '@/lib/neuroadaptive/SilentFrequencyCarrier';

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
        {adaptiveSymbols.length > 0 && (
          <div className="bg-black/30 rounded-2xl p-4 border border-purple-400/30">
            <div className="text-xs text-purple-300/70 uppercase tracking-wider mb-3">
              Dynamic Symbol Stream
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {adaptiveSymbols.map((symbol, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{
                    transform: `rotate(${symbol.phase * 57.3}deg) scale(${1 + symbol.semanticWeight * 0.5})`,
                    opacity: 0.7 + symbol.coherenceLevel * 0.3
                  }}
                >
                  <span 
                    className="text-2xl text-purple-300 animate-pulse"
                    style={{
                      textShadow: `0 0 ${symbol.frequency * 0.1}px rgba(147, 51, 234, 0.6)`,
                      filter: `hue-rotate(${symbol.frequency * 3}deg)`
                    }}
                  >
                    {symbol.glyph}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Neural Band Targeting */}
        <div className="space-y-4">
          <label className="text-purple-300/80 text-sm font-light tracking-wide">
            Consciousness Target Vector
          </label>
          <div className="grid grid-cols-5 gap-3">
            {(['delta', 'theta', 'alpha', 'beta', 'gamma'] as const).map((band) => (
              <Button
                key={band}
                onClick={() => setCurrentTarget(band)}
                variant="ghost"
                className={`${
                  currentTarget === band 
                    ? 'bg-purple-500/40 text-purple-200 border-2 border-purple-400/70 shadow-lg shadow-purple-500/20' 
                    : 'bg-black/20 text-white/60 hover:bg-purple-500/20 border border-purple-500/20'
                } transition-all duration-300 transform hover:scale-105`}
              >
                <div className="flex flex-col items-center py-2">
                  <span className="text-xs font-medium">{band.toUpperCase()}</span>
                  <div className="w-8 h-1 mt-1 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 opacity-70" />
                </div>
              </Button>
            ))}
          </div>
        </div>

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

        {/* Real-time Biometric Status */}
        {biometricState && (
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
        )}

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
    </div>
  );
};
