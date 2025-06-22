
import { CarrierSignal } from './CarrierSignalGenerator';

export class AudioNodeManager {
  private audioContext: AudioContext;
  private carrierNodes: AudioNode[] = [];

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  createCarrierNode(signal: CarrierSignal, silentMode: boolean): void {
    const masterGain = this.audioContext.createGain();
    masterGain.gain.setValueAtTime(silentMode ? 0.01 : signal.amplitude, this.audioContext.currentTime);

    switch (signal.type) {
      case 'binaural':
        this.createBinauralNode(signal, masterGain);
        break;
      case 'infrasonic':
        this.createInfrasonicNode(signal, masterGain);
        break;
      case 'isochronic':
        this.createIsochronicNode(signal, masterGain);
        break;
    }

    masterGain.connect(this.audioContext.destination);
    this.carrierNodes.push(masterGain);

    // Auto-stop after duration
    setTimeout(() => {
      if (this.carrierNodes.includes(masterGain)) {
        masterGain.disconnect();
        const index = this.carrierNodes.indexOf(masterGain);
        this.carrierNodes.splice(index, 1);
      }
    }, signal.duration);
  }

  private createBinauralNode(signal: CarrierSignal, output: GainNode): void {
    // Left channel
    const leftOsc = this.audioContext.createOscillator();
    const leftGain = this.audioContext.createGain();
    leftOsc.frequency.setValueAtTime(signal.baseFrequency, this.audioContext.currentTime);
    leftGain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    leftOsc.connect(leftGain);

    // Right channel
    const rightOsc = this.audioContext.createOscillator();
    const rightGain = this.audioContext.createGain();
    rightOsc.frequency.setValueAtTime(
      signal.baseFrequency + signal.modulationFrequency,
      this.audioContext.currentTime
    );
    rightGain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    rightOsc.connect(rightGain);

    // Stereo merger
    const merger = this.audioContext.createChannelMerger(2);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(output);

    leftOsc.start();
    rightOsc.start();
  }

  private createInfrasonicNode(signal: CarrierSignal, output: GainNode): void {
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(signal.baseFrequency, this.audioContext.currentTime);
    
    // Add subtle amplitude modulation for infrasonic penetration
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.setValueAtTime(0.1, this.audioContext.currentTime); // Very slow modulation
    lfoGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);
    
    oscillator.connect(output);
    lfo.start();
    oscillator.start();
  }

  private createIsochronicNode(signal: CarrierSignal, output: GainNode): void {
    const oscillator = this.audioContext.createOscillator();
    const pulseGain = this.audioContext.createGain();
    
    oscillator.frequency.setValueAtTime(signal.baseFrequency, this.audioContext.currentTime);
    oscillator.connect(pulseGain);
    
    // Create isochronic pulses
    const pulseRate = signal.modulationFrequency;
    const pulseDuration = 1 / pulseRate;
    let currentTime = this.audioContext.currentTime;
    
    for (let i = 0; i < signal.duration / 1000; i += pulseDuration) {
      pulseGain.gain.setValueAtTime(0, currentTime + i);
      pulseGain.gain.linearRampToValueAtTime(1, currentTime + i + pulseDuration * 0.1);
      pulseGain.gain.setValueAtTime(1, currentTime + i + pulseDuration * 0.4);
      pulseGain.gain.linearRampToValueAtTime(0, currentTime + i + pulseDuration * 0.5);
    }
    
    pulseGain.connect(output);
    oscillator.start();
  }

  modulateCarrierIntensity(newIntensity: number, fadeTime: number = 2): void {
    this.carrierNodes.forEach(node => {
      if (node instanceof GainNode) {
        node.gain.exponentialRampToValueAtTime(
          Math.max(0.001, newIntensity),
          this.audioContext.currentTime + fadeTime
        );
      }
    });
  }

  stopAllCarriers(): void {
    this.carrierNodes.forEach(node => {
      try {
        node.disconnect();
      } catch (e) {
        // Node already disconnected
      }
    });
    this.carrierNodes = [];
  }

  getCarrierNodes(): AudioNode[] {
    return [...this.carrierNodes];
  }
}
