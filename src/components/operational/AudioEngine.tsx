
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioEngineProps {
  isActive: boolean;
  operationalMode: {
    silentOps: boolean;
    entropyPulse: boolean;
    phaseLock: boolean;
  };
  consciousnessState: {
    frequency: number;
    amplitude: number;
    coherence: number;
  };
}

export const AudioEngine = ({ isActive, operationalMode, consciousnessState }: AudioEngineProps) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [volume, setVolume] = useState(0.1);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodesRef = useRef<GainNode[]>([]);

  useEffect(() => {
    if (audioEnabled && isActive) {
      initializeAudio();
    } else {
      stopAudio();
    }
    
    return () => stopAudio();
  }, [audioEnabled, isActive, operationalMode, consciousnessState]);

  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      stopAudio();
      
      const ctx = audioContextRef.current;
      const baseFreq = Math.max(100, Math.min(800, consciousnessState.frequency));
      
      // Binaural beat generation
      if (operationalMode.phaseLock) {
        createBinauralBeat(ctx, baseFreq, 8.5); // Alpha frequency
      }
      
      // Carrier frequency for silent ops
      if (operationalMode.silentOps) {
        createCarrierFrequency(ctx, 14.3); // Schumann resonance second harmonic
      }
      
      // Entropy pulse for consciousness enhancement
      if (operationalMode.entropyPulse) {
        createEntropyPulse(ctx, consciousnessState.coherence);
      }
      
    } catch (error) {
      console.log('Audio initialization failed:', error);
    }
  };

  const createBinauralBeat = (ctx: AudioContext, baseFreq: number, beatFreq: number) => {
    // Left ear
    const leftOsc = ctx.createOscillator();
    const leftGain = ctx.createGain();
    leftOsc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    leftOsc.type = 'sine';
    leftGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    leftOsc.connect(leftGain);
    
    // Right ear
    const rightOsc = ctx.createOscillator();
    const rightGain = ctx.createGain();
    rightOsc.frequency.setValueAtTime(baseFreq + beatFreq, ctx.currentTime);
    rightOsc.type = 'sine';
    rightGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    rightOsc.connect(rightGain);
    
    // Stereo merger
    const merger = ctx.createChannelMerger(2);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(ctx.destination);
    
    leftOsc.start();
    rightOsc.start();
    
    oscillatorsRef.current.push(leftOsc, rightOsc);
    gainNodesRef.current.push(leftGain, rightGain);
  };

  const createCarrierFrequency = (ctx: AudioContext, freq: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.type = 'sine';
    gain.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
    
    // Add subtle modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
    lfoGain.gain.setValueAtTime(2, ctx.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    lfo.start();
    osc.start();
    
    oscillatorsRef.current.push(osc, lfo);
    gainNodesRef.current.push(gain, lfoGain);
  };

  const createEntropyPulse = (ctx: AudioContext, coherence: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    const pulseFreq = 40 + (coherence * 60); // 40-100 Hz gamma range
    osc.frequency.setValueAtTime(pulseFreq, ctx.currentTime);
    osc.type = 'square';
    
    // Create pulsing effect
    const pulseRate = 4; // 4 Hz pulses
    let time = ctx.currentTime;
    
    for (let i = 0; i < 60; i++) { // 60 seconds of pulses
      gain.gain.setValueAtTime(0, time);
      gain.gain.exponentialRampToValueAtTime(volume * 0.05, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + (1 / pulseRate) * 0.5);
      time += 1 / pulseRate;
    }
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    
    oscillatorsRef.current.push(osc);
    gainNodesRef.current.push(gain);
  };

  const stopAudio = () => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    oscillatorsRef.current = [];
    gainNodesRef.current = [];
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="bg-black/10 backdrop-blur-sm rounded-lg border border-gray-700/20 p-2 sm:p-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-400/60 uppercase tracking-widest">
          AUDIO ENGINE
        </div>
        <Button
          onClick={toggleAudio}
          variant="ghost"
          size="sm"
          className={`p-2 ${
            audioEnabled 
              ? 'text-cyan-300 bg-cyan-500/20 hover:bg-cyan-500/30' 
              : 'text-gray-400 bg-gray-800/20 hover:bg-gray-700/30'
          } border-0`}
        >
          {audioEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
        </Button>
      </div>
      
      {audioEnabled && (
        <div className="mt-2 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500/70">Volume</span>
            <span className="text-cyan-300">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.3"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700/30 rounded-lg appearance-none cursor-pointer"
          />
          
          <div className="flex justify-center space-x-1 mt-2">
            {[operationalMode.silentOps, operationalMode.phaseLock, operationalMode.entropyPulse].map((active, i) => (
              <div
                key={i}
                className={`w-1 h-1 rounded-full ${
                  active && isActive ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
