
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

interface SemanticInputChannelProps {
  textInput: string;
  setTextInput: (text: string) => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  onStateChange: (state: any) => void;
  operationalMode: any;
}

export const SemanticInputChannel = ({
  textInput,
  setTextInput,
  isActive,
  setIsActive,
  onStateChange,
  operationalMode
}: SemanticInputChannelProps) => {
  const isMobile = useIsMobile();
  const [voiceWaveform, setVoiceWaveform] = useState<number[]>([]);
  const [breathPattern, setBreathPattern] = useState(0);
  const [inputFocus, setInputFocus] = useState(false);
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'complete'>('idle');

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        const waveformLength = isMobile ? 8 : 12;
        const intensity = textInput.length > 0 ? 1.5 : 1;
        const newWaveform = Array.from({ length: waveformLength }, (_, i) => 
          4 + Math.random() * 12 * intensity + Math.sin(Date.now() * 0.01 + i) * 3
        );
        setVoiceWaveform(newWaveform);
        
        setBreathPattern(prev => (prev + 0.1) % (Math.PI * 2));
      } else {
        setVoiceWaveform(Array.from({ length: isMobile ? 8 : 12 }, () => 4));
      }
    }, 80);

    return () => clearInterval(interval);
  }, [isActive, isMobile, textInput.length]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    console.log('Text input changed:', newText.length, 'characters');
    setTextInput(newText);
    
    if (newText.length > 0) {
      setProcessingState('processing');
      
      setTimeout(() => {
        const words = newText.toLowerCase().split(' ');
        const emotionalWords = words.filter(word => 
          ['love', 'peace', 'joy', 'calm', 'fear', 'anger', 'sad', 'happy', 'deep', 'light', 'dark', 'bright', 'flow', 'energy', 'consciousness'].includes(word)
        );
        
        const complexity = Math.min(1, newText.length / 200);
        const emotionalIntensity = Math.min(1, emotionalWords.length / Math.max(1, words.length));
        const wordDensity = words.length / Math.max(1, newText.length / 10);
        
        const newState = {
          frequency: 400 + (complexity * 300) + (emotionalIntensity * 100),
          amplitude: Math.min(0.9, 0.2 + emotionalIntensity * 0.5 + complexity * 0.3),
          coherence: Math.min(0.95, 0.4 + complexity * 0.4 + wordDensity * 0.1),
          depth: Math.min(0.85, complexity * 0.6 + emotionalIntensity * 0.25)
        };
        
        console.log('State update:', newState);
        onStateChange(newState);
        
        setProcessingState('complete');
        setTimeout(() => setProcessingState('idle'), 1000);
      }, 200);
    }
  };

  const handleActiveToggle = () => {
    const newActive = !isActive;
    console.log('Channel active state:', newActive);
    setIsActive(newActive);
    
    if (navigator.vibrate) {
      navigator.vibrate(newActive ? [100, 50, 100] : [200]);
    }
  };

  return (
    <div className="bg-black/10 backdrop-blur-xl rounded-2xl border border-gray-700/20 p-4 sm:p-6 h-full">
      
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-xs text-gray-400/60 uppercase tracking-widest">
          SEMANTIC CHANNEL
        </div>
        <Button
          onClick={handleActiveToggle}
          variant="ghost"
          size={isMobile ? "default" : "sm"}
          className={`text-xs px-3 py-2 sm:py-1 transition-all duration-300 cursor-pointer ${
            isActive 
              ? 'text-cyan-300 bg-cyan-500/20 border-cyan-400/40 shadow-lg shadow-cyan-500/20' 
              : 'text-gray-400 bg-gray-800/20 border-gray-600/20 hover:bg-gray-700/30'
          } border rounded-lg hover:scale-105 touch-manipulation`}
        >
          {isActive ? '◉ ACTIVE' : '◌ STANDBY'}
        </Button>
      </div>

      <div className="relative mb-3 sm:mb-4 flex-1">
        <Textarea
          value={textInput}
          onChange={handleTextChange}
          onFocus={() => {
            console.log('Input focused');
            setInputFocus(true);
          }}
          onBlur={() => {
            console.log('Input blurred');
            setInputFocus(false);
          }}
          placeholder="Interface with quantum consciousness field through natural semantic input..."
          className={`bg-black/20 border-gray-700/30 text-gray-200/90 placeholder:text-gray-500/50 ${
            isMobile ? 'min-h-[80px]' : 'min-h-[100px]'
          } resize-none rounded-xl transition-all duration-300 focus:border-cyan-400/50 focus:bg-black/30 text-sm ${
            inputFocus ? 'shadow-lg shadow-cyan-500/20' : ''
          }`}
          disabled={!isActive}
        />
        
        {processingState !== 'idle' && (
          <div className="absolute top-2 right-2 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              processingState === 'processing' ? 'bg-yellow-400/80 animate-pulse' : 'bg-green-400/80'
            }`} />
          </div>
        )}
        
        <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
          {operationalMode.silentOps && (
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse" />
          )}
          {operationalMode.entropyPulse && textInput.length > 20 && (
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-violet-400/10 rounded-full animate-ping" />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex space-x-3 sm:space-x-4">
          
          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-500/70">VOICE:</div>
            <div className="flex space-x-px items-end">
              {voiceWaveform.map((height, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-green-600/60 to-green-400/80 rounded-full transition-all duration-100"
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-500/70">BREATH:</div>
            <div className="flex space-x-1">
              {['◐', '◑', '◒', '◓'].map((glyph, i) => (
                <span
                  key={i}
                  className="text-xs text-blue-400/60 transition-all duration-300 hover:text-blue-300/80 cursor-pointer"
                  style={{
                    opacity: isActive ? 0.4 + Math.sin(breathPattern + i * 0.5) * 0.4 : 0.2,
                    transform: `scale(${0.8 + Math.sin(breathPattern + i * 0.3) * 0.2})`
                  }}
                  onClick={() => console.log('Breath pattern clicked:', glyph)}
                >
                  {glyph}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={`text-xs transition-colors duration-300 cursor-pointer ${
          textInput.length > 1800 ? 'text-orange-400/80' : 
          textInput.length > 1000 ? 'text-yellow-400/80' : 'text-gray-500/60'
        }`} onClick={() => console.log('Character count:', textInput.length)}>
          {textInput.length}/2048
        </div>
      </div>

    </div>
  );
};
