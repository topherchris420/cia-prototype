
import { NeuralFrequencyBand, BiometricState } from './BiometricAnalyzer';

export interface EntrainmentSignal {
  audioFrequency: number;
  binauralBeat: number;
  visualFlicker: number;
  amplitude: number;
  phase: number;
}

export class EntrainmentEngine {
  private audioContext: AudioContext;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private isActive = false;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  generateEntrainmentSignal(
    targetBand: keyof NeuralFrequencyBand,
    biometricState: BiometricState,
    intensity: number = 0.5
  ): EntrainmentSignal {
    const frequencyMap = {
      delta: { base: 2, range: 3.5 },
      theta: { base: 6, range: 2 },
      alpha: { base: 10.5, range: 4.5 },
      beta: { base: 21.5, range: 16.5 },
      gamma: { base: 65, range: 35 }
    };

    const target = frequencyMap[targetBand];
    const baseFreq = 200; // Carrier frequency
    
    // Adapt frequency based on biometric state
    const stateModulation = (biometricState.cognitiveLoad * 0.3) + 
                           (biometricState.attentionLevel * 0.4) + 
                           (biometricState.emotionalValence * 0.3);
    
    const entrainmentFreq = target.base + (stateModulation * target.range);
    const binauralBeat = entrainmentFreq;
    const visualFlicker = entrainmentFreq * 2; // Visual flicker at 2x for enhanced effect
    
    return {
      audioFrequency: baseFreq,
      binauralBeat,
      visualFlicker,
      amplitude: intensity * (0.5 + biometricState.attentionLevel * 0.5),
      phase: Date.now() * 0.001
    };
  }

  startEntrainment(signal: EntrainmentSignal, silentMode: boolean = false): void {
    this.stopEntrainment();
    this.isActive = true;

    if (!silentMode) {
      // Left ear - carrier frequency
      const leftOsc = this.audioContext.createOscillator();
      const leftGain = this.audioContext.createGain();
      
      leftOsc.frequency.setValueAtTime(signal.audioFrequency, this.audioContext.currentTime);
      leftGain.gain.setValueAtTime(signal.amplitude * 0.1, this.audioContext.currentTime);
      
      leftOsc.connect(leftGain);
      
      // Right ear - carrier + binaural beat
      const rightOsc = this.audioContext.createOscillator();
      const rightGain = this.audioContext.createGain();
      
      rightOsc.frequency.setValueAtTime(
        signal.audioFrequency + signal.binauralBeat, 
        this.audioContext.currentTime
      );
      rightGain.gain.setValueAtTime(signal.amplitude * 0.1, this.audioContext.currentTime);
      
      rightOsc.connect(rightGain);
      
      // Create stereo merger
      const merger = this.audioContext.createChannelMerger(2);
      leftGain.connect(merger, 0, 0);
      rightGain.connect(merger, 0, 1);
      merger.connect(this.audioContext.destination);
      
      leftOsc.start();
      rightOsc.start();
      
      this.oscillators.push(leftOsc, rightOsc);
      this.gainNodes.push(leftGain, rightGain);
    }
  }

  stopEntrainment(): void {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator already stopped
      }
    });
    
    this.oscillators = [];
    this.gainNodes = [];
    this.isActive = false;
  }

  modulateIntensity(newIntensity: number): void {
    this.gainNodes.forEach(gain => {
      gain.gain.exponentialRampToValueAtTime(
        newIntensity * 0.1,
        this.audioContext.currentTime + 0.1
      );
    });
  }

  generateCymaticPattern(frequency: number, amplitude: number): number[] {
    const points = 64;
    const pattern: number[] = [];
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const harmonics = Math.sin(angle * frequency) * amplitude +
                       Math.sin(angle * frequency * 2) * (amplitude * 0.5) +
                       Math.sin(angle * frequency * 3) * (amplitude * 0.25);
      pattern.push(harmonics);
    }
    
    return pattern;
  }

  isEntraining(): boolean {
    return this.isActive;
  }
}
