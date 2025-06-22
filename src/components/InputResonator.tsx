
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, Play, Pause } from 'lucide-react';

interface InputResonatorProps {
  onStateChange: (state: any) => void;
  textInput: string;
  setTextInput: (text: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

export const InputResonator = ({ 
  onStateChange, 
  textInput, 
  setTextInput, 
  isActive, 
  setIsActive 
}: InputResonatorProps) => {
  const [isListening, setIsListening] = useState(false);

  // Analyze text input and update consciousness state
  useEffect(() => {
    if (textInput.length > 0) {
      const words = textInput.toLowerCase().split(' ');
      const emotionalWords = words.filter(word => 
        ['love', 'peace', 'joy', 'calm', 'fear', 'anger', 'sad', 'happy', 'deep', 'light', 'dark', 'bright'].includes(word)
      );
      
      const complexity = textInput.length / 100;
      const emotionalIntensity = emotionalWords.length / words.length;
      
      // Map text characteristics to consciousness parameters
      onStateChange({
        frequency: 400 + (complexity * 200),
        amplitude: Math.min(0.8, 0.3 + emotionalIntensity),
        coherence: Math.min(0.9, 0.5 + (textInput.length / 500)),
        depth: Math.min(0.8, complexity),
        resonance: getResonanceFromText(textInput)
      });
    }
  }, [textInput, onStateChange]);

  const getResonanceFromText = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('calm') || lowerText.includes('peace') || lowerText.includes('meditat')) return 'alpha';
    if (lowerText.includes('focus') || lowerText.includes('think') || lowerText.includes('work')) return 'beta';
    if (lowerText.includes('create') || lowerText.includes('inspire') || lowerText.includes('flow')) return 'gamma';
    if (lowerText.includes('dream') || lowerText.includes('sleep') || lowerText.includes('deep')) return 'delta';
    if (lowerText.includes('imagine') || lowerText.includes('memory') || lowerText.includes('feel')) return 'theta';
    return 'alpha';
  };

  const toggleSession = () => {
    setIsActive(!isActive);
  };

  const startListening = () => {
    setIsListening(true);
    // Voice recognition would be implemented here
    // For now, we'll simulate it
    setTimeout(() => {
      setIsListening(false);
      setTextInput(textInput + ' [voice resonance detected]');
    }, 3000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
      <div className="space-y-6">
        {/* Session Control */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl text-white/90 font-light">Consciousness Input</h3>
          <Button
            onClick={toggleSession}
            variant={isActive ? "destructive" : "default"}
            className={`${isActive ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300' : 'bg-green-500/20 hover:bg-green-500/30 text-green-300'} border-0`}
          >
            {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isActive ? 'Active Session' : 'Begin Session'}
          </Button>
        </div>

        {/* Text Reflection Input */}
        <div className="space-y-3">
          <label className="text-purple-300/80 text-sm font-light">
            Consciousness Reflection
          </label>
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Express your current state of consciousness... What are you feeling, thinking, experiencing in this moment?"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[120px] resize-none"
            disabled={!isActive}
          />
        </div>

        {/* Voice Resonance */}
        <div className="space-y-3">
          <label className="text-purple-300/80 text-sm font-light">
            Vocal Resonance
          </label>
          <Button
            onClick={startListening}
            disabled={!isActive || isListening}
            className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
          >
            {isListening ? (
              <>
                <div className="w-4 h-4 mr-2 bg-red-500 rounded-full animate-pulse" />
                Listening to your resonance...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Capture Vocal Frequency
              </>
            )}
          </Button>
        </div>

        {/* Breath Rhythm Detector */}
        <div className="space-y-3">
          <label className="text-purple-300/80 text-sm font-light">
            Breath Rhythm Detection
          </label>
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-white/70 text-sm">
                {isActive ? 'Detecting breath patterns...' : 'Start session to enable'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
