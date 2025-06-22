
import { PlanetaryAlignmentCalculator, PlanetaryAlignment } from './PlanetaryAlignmentCalculator';
import { CarrierSignalGenerator, CarrierSignal } from './CarrierSignalGenerator';
import { AudioNodeManager } from './AudioNodeManager';

export type { CarrierSignal, PlanetaryAlignment };

export class SilentFrequencyCarrier {
  private audioContext: AudioContext;
  private planetaryCalculator: PlanetaryAlignmentCalculator;
  private signalGenerator: CarrierSignalGenerator;
  private audioManager: AudioNodeManager;
  private planetaryData: PlanetaryAlignment | null = null;
  private isActive = false;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.planetaryCalculator = new PlanetaryAlignmentCalculator();
    this.signalGenerator = new CarrierSignalGenerator();
    this.audioManager = new AudioNodeManager(this.audioContext);
    this.initializePlanetaryAlignment();
  }

  private initializePlanetaryAlignment(): void {
    this.planetaryData = this.planetaryCalculator.generatePlanetaryAlignment();
  }

  generateBinauralCarrier(
    leftFreq: number,
    rightFreq: number,
    amplitude: number = 0.05,
    duration: number = 30000
  ): CarrierSignal {
    return this.signalGenerator.generateBinauralCarrier(leftFreq, rightFreq, amplitude, duration);
  }

  generateInfrasonicCarrier(
    frequency: number = 14,
    amplitude: number = 0.1,
    duration: number = 60000
  ): CarrierSignal {
    return this.signalGenerator.generateInfrasonicCarrier(frequency, amplitude, duration);
  }

  generateIsochronicCarrier(
    frequency: number,
    pulseRate: number,
    amplitude: number = 0.08,
    duration: number = 45000
  ): CarrierSignal {
    return this.signalGenerator.generateIsochronicCarrier(frequency, pulseRate, amplitude, duration);
  }

  syncWithPlanetaryAlignment(signal: CarrierSignal): CarrierSignal {
    if (!this.planetaryData) return signal;
    return this.signalGenerator.syncWithPlanetaryAlignment(signal, this.planetaryData);
  }

  startCarrierLayer(signals: CarrierSignal[], silentMode: boolean = true): void {
    this.stopCarrierLayer();
    this.isActive = true;

    signals.forEach(signal => {
      const alignedSignal = this.syncWithPlanetaryAlignment(signal);
      this.audioManager.createCarrierNode(alignedSignal, silentMode);
    });
  }

  modulateCarrierIntensity(newIntensity: number, fadeTime: number = 2): void {
    this.audioManager.modulateCarrierIntensity(newIntensity, fadeTime);
  }

  stopCarrierLayer(): void {
    this.audioManager.stopAllCarriers();
    this.isActive = false;
  }

  updatePlanetaryAlignment(): void {
    this.initializePlanetaryAlignment();
  }

  getCurrentPlanetaryData(): PlanetaryAlignment | null {
    return this.planetaryData;
  }

  isCarrierActive(): boolean {
    return this.isActive;
  }

  generateSchumann7_83(): CarrierSignal {
    return this.signalGenerator.generateSchumann7_83();
  }

  generateEarthResonance(): CarrierSignal[] {
    return this.signalGenerator.generateEarthResonance();
  }
}
