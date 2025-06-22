
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Play, Pause, Eye, EyeOff } from 'lucide-react';
import { BiometricAnalyzer, BiometricState } from '@/lib/neuroadaptive/BiometricAnalyzer';
import { EntrainmentEngine } from '@/lib/neuroadaptive/EntrainmentEngine';
import { ResonanceMapper } from '@/lib/neuroadaptive/ResonanceMapper';

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
  const [biometricState, setBiometricState] = useState<BiometricState | null>(null);
  const [currentTarget, setCurrentTarget] = useState<'alpha' | 'theta' | 'gamma' | 'delta' | 'beta'>('alpha');

  const biometricAnalyzer = useRef<BiometricAnalyzer | null>(null);
  const entrainmentEngine = useRef<EntrainmentEngine | null>(null);
  const resonanceMapper = useRef<ResonanceMapper | null>(null);
  const analysisInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize neuroadaptive systems
    biometricAnalyzer.current = new BiometricAnalyzer();
    entrainmentEngine.current = new EntrainmentEngine();
    resonanceMapper.current = new ResonanceMapper();

    return () => {
      if (biometricAnalyzer.current) {
        biometricAnalyzer.current.dispose();
      }
      if (entrainmentEngine.current) {
        entrainmentEngine.current.stopEntrainment();
      }
      if (analysisInterval.current) {
        clearInterval(analysisInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (textInput.length > 0 && biometricAnalyzer.current) {
      const semanticState = biometricAnalyzer.current.analyzeSemanticStructure(textInput);
      setBiometricState(semanticState);
      updateConsciousnessParameters(semanticState);
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
        phaseTransition: vector.phaseTransition
      });
    }
  };

  const toggleSession = async () => {
    if (!isActive) {
      try {
        if (biometricAnalyzer.current) {
          await biometricAnalyzer.current.initialize();
        }
        
        // Start real-time analysis
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
        }, 100); // 10Hz analysis rate for real-time response
        
        setIsActive(true);
      } catch (error) {
        console.error('Failed to initialize biometric analysis:', error);
      }
    } else {
      if (analysisInterval.current) {
        clearInterval(analysisInterval.current);
      }
      if (entrainmentEngine.current) {
        entrainmentEngine.current.stopEntrainment();
      }
      setIsActive(false);
      setIsListening(false);
    }
  };

  const startEntrainment = () => {
    if (entrainmentEngine.current && biometricState) {
      const signal = entrainmentEngine.current.generateEntrainmentSignal(
        currentTarget,
        biometricState,
        0.7
      );
      
      entrainmentEngine.current.startEntrainment(signal, silentMode);
      setIsListening(true);
    }
  };

  const stopEntrainment = () => {
    if (entrainmentEngine.current) {
      entrainmentEngine.current.stopEntrainment();
    }
    setIsListening(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="space-y-6">
        {/* Session Control */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl text-white/90 font-light">Neuroadaptive Interface</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setSilentMode(!silentMode)}
              variant="ghost"
              size="sm"
              className={`${silentMode ? 'text-green-400' : 'text-white/70'} hover:text-white`}
            >
              {silentMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button
              onClick={toggleSession}
              variant={isActive ? "destructive" : "default"}
              className={`${isActive ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300' : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'} border-0`}
            >
              {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isActive ? 'Neural Link Active' : 'Initialize Neural Link'}
            </Button>
          </div>
        </div>

        {/* Target Band Selection */}
        <div className="space-y-3">
          <label className="text-purple-300/80 text-sm font-light">
            Target Neural Band
          </label>
          <div className="grid grid-cols-5 gap-2">
            {(['delta', 'theta', 'alpha', 'beta', 'gamma'] as const).map((band) => (
              <Button
                key={band}
                onClick={() => setCurrentTarget(band)}
                variant="ghost"
                className={`${
                  currentTarget === band 
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {band.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>

        {/* Consciousness Reflection Input */}
        <div className="space-y-3">
          <label className="text-purple-300/80 text-sm font-light">
            Consciousness Vector Input
          </label>
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Describe your current cognitive state, emotional resonance, or conscious experience..."
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[120px] resize-none"
            disabled={!isActive}
          />
        </div>

        {/* Neural Entrainment Control */}
        <div className="space-y-3">
          <label className="text-purple-300/80 text-sm font-light">
            Binaural Entrainment
          </label>
          <div className="flex gap-2">
            <Button
              onClick={startEntrainment}
              disabled={!isActive || !biometricState}
              className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
            >
              {isListening ? (
                <>
                  <div className="w-4 h-4 mr-2 bg-green-400 rounded-full animate-pulse" />
                  Entraining {currentTarget.toUpperCase()}
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Begin Entrainment
                </>
              )}
            </Button>
            {isListening && (
              <Button
                onClick={stopEntrainment}
                variant="ghost"
                className="text-red-400 hover:text-red-300"
              >
                <MicOff className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Biometric Status */}
        {biometricState && (
          <div className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="text-xs text-white/50 uppercase tracking-wider mb-2">
              Biometric Analysis
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-white/60">Cognitive Load: </span>
                <span className="text-cyan-300">{Math.round(biometricState.cognitiveLoad * 100)}%</span>
              </div>
              <div>
                <span className="text-white/60">Attention: </span>
                <span className="text-green-300">{Math.round(biometricState.attentionLevel * 100)}%</span>
              </div>
              <div>
                <span className="text-white/60">Emotional State: </span>
                <span className="text-purple-300">{Math.round(biometricState.emotionalValence * 100)}%</span>
              </div>
              <div>
                <span className="text-white/60">Voice Stress: </span>
                <span className="text-yellow-300">{Math.round(biometricState.voiceStress * 100)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
