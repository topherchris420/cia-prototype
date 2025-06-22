
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        // Generate voice waveform data
        const waveformLength = isMobile ? 6 : 8;
        const newWaveform = Array.from({ length: waveformLength }, () => 
          4 + Math.random() * 8
        );
        setVoiceWaveform(newWaveform);
        
        // Update breath pattern
        setBreathPattern(prev => (prev + 0.1) % (Math.PI * 2));
      } else {
        setVoiceWaveform(Array.from({ length: isMobile ? 6 : 8 }, () => 4));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, isMobile]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setTextInput(newText);
    
    // Update consciousness state based on text input
    if (newText.length > 0) {
      onStateChange({
        frequency: 432 + (newText.length % 100),
        amplitude: Math.min(0.9, 0.3 + newText.length / 500),
        coherence: Math.min(0.95, 0.4 + newText.length / 200),
        depth: Math.min(0.8, newText.split(' ').length / 50)
      });
    }
  };

  return (
    <div className="bg-black/10 backdrop-blur-xl rounded-2xl border border-gray-700/20 p-4 sm:p-6 h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="text-xs text-gray-400/60 uppercase tracking-widest">
          SEMANTIC CHANNEL
        </div>
        <Button
          onClick={() => setIsActive(!isActive)}
          variant="ghost"
          size={isMobile ? "default" : "sm"}
          className={`text-xs px-3 py-2 sm:py-1 transition-all duration-300 ${
            isActive 
              ? 'text-cyan-300 bg-cyan-500/10 border-cyan-400/30' 
              : 'text-gray-400 bg-gray-800/20 border-gray-600/20'
          } border rounded-lg hover:scale-105 touch-manipulation`}
        >
          {isActive ? '◉ ACTIVE' : '◌ STANDBY'}
        </Button>
      </div>

      {/* Input Area */}
      <div className="relative mb-3 sm:mb-4 flex-1">
        <Textarea
          value={textInput}
          onChange={handleTextChange}
          placeholder="Interface with quantum consciousness field through natural semantic input..."
          className={`bg-black/20 border-gray-700/30 text-gray-200/90 placeholder:text-gray-500/50 ${
            isMobile ? 'min-h-[80px]' : 'min-h-[100px]'
          } resize-none rounded-xl transition-all duration-300 focus:border-cyan-400/40 focus:bg-black/30 text-sm`}
          disabled={!isActive}
        />
        
        {/* Translucent overlay effects */}
        <div className="absolute inset-0 pointer-events-none">
          {operationalMode.silentOps && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400/60 rounded-full animate-pulse" />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex space-x-3 sm:space-x-4">
          
          {/* Voice Waveform Display */}
          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-500/70">VOICE:</div>
            <div className="flex space-x-px">
              {voiceWaveform.map((height, i) => (
                <div
                  key={i}
                  className="w-1 bg-green-400/40 rounded-full transition-all duration-100"
                  style={{ height: `${height}px` }}
                />
              ))}
            </div>
          </div>

          {/* Breath Pattern Glyphs */}
          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-500/70">BREATH:</div>
            <div className="flex space-x-1">
              {['◐', '◑', '◒', '◓'].map((glyph, i) => (
                <span
                  key={i}
                  className="text-xs text-blue-400/50 transition-all duration-300"
                  style={{
                    opacity: isActive ? 0.3 + Math.sin(breathPattern + i) * 0.3 : 0.2
                  }}
                >
                  {glyph}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Character Count */}
        <div className="text-xs text-gray-500/60">
          {textInput.length}/2048
        </div>
      </div>

    </div>
  );
};
