
export interface CarrierSignal {
  type: 'binaural' | 'infrasonic' | 'isochronic';
  baseFrequency: number;
  modulationFrequency: number;
  amplitude: number;
  phase: number;
  duration: number;
}

export interface PlanetaryAlignment {
  schumann: number[];      // 7.83, 14.3, 20.8, 27.3, 33.8 Hz
  geomagnetic: number;     // 0.01-30 Hz variations
  solarCycle: number;      // 11-year cycle modulation
  lunarPhase: number;      // 29.5-day cycle
  temporalFractal: number; // Recursive time structure
}

export class SilentFrequencyCarrier {
  private audioContext: AudioContext;
  private carrierNodes: AudioNode[] = [];
  private planetaryData: PlanetaryAlignment | null = null;
  private isActive = false;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.initializePlanetaryAlignment();
  }

  private initializePlanetaryAlignment(): void {
    // Initialize with real-time planetary frequencies
    this.planetaryData = {
      schumann: [7.83, 14.3, 20.8, 27.3, 33.8],
      geomagnetic: this.calculateGeromagneticFlux(),
      solarCycle: this.calculateSolarCyclePhase(),
      lunarPhase: this.calculateLunarPhase(),
      temporalFractal: this.generateTemporalFractal()
    };
  }

  private calculateGeromagneticFlux(): number {
    // Simulate real-time geomagnetic activity
    const baseFlux = 15; // Hz
    const variation = Math.sin(Date.now() * 0.0001) * 10;
    const randomFluctuation = (Math.random() - 0.5) * 5;
    return Math.max(0.01, baseFlux + variation + randomFluctuation);
  }

  private calculateSolarCyclePhase(): number {
    // 11-year solar cycle approximation
    const cycleDuration = 11 * 365.25 * 24 * 60 * 60 * 1000; // 11 years in ms
    const cycleStart = new Date('2020-01-01').getTime(); // Approximate solar minimum
    const currentPhase = ((Date.now() - cycleStart) % cycleDuration) / cycleDuration;
    return currentPhase * 2 * Math.PI;
  }

  private calculateLunarPhase(): number {
    // 29.5-day lunar cycle
    const lunarCycle = 29.5 * 24 * 60 * 60 * 1000; // 29.5 days in ms
    const knownNewMoon = new Date('2024-01-11').getTime(); // Known new moon
    const currentPhase = ((Date.now() - knownNewMoon) % lunarCycle) / lunarCycle;
    return currentPhase * 2 * Math.PI;
  }

  private generateTemporalFractal(): number {
    // Generate recursive temporal structure
    const scales = [1, 7, 30, 365]; // day, week, month, year
    let fractalValue = 0;
    
    scales.forEach((scale, index) => {
      const cycleMs = scale * 24 * 60 * 60 * 1000;
      const phase = ((Date.now() % cycleMs) / cycleMs) * 2 * Math.PI;
      fractalValue += Math.sin(phase) * Math.pow(0.5, index);
    });
    
    return fractalValue;
  }

  generateBinauralCarrier(
    leftFreq: number,
    rightFreq: number,
    amplitude: number = 0.05,
    duration: number = 30000
  ): CarrierSignal {
    return {
      type: 'binaural',
      baseFrequency: leftFreq,
      modulationFrequency: rightFreq - leftFreq,
      amplitude,
      phase: 0,
      duration
    };
  }

  generateInfrasonicCarrier(
    frequency: number = 14, // Below conscious hearing threshold
    amplitude: number = 0.1,
    duration: number = 60000
  ): CarrierSignal {
    return {
      type: 'infrasonic',
      baseFrequency: frequency,
      modulationFrequency: 0,
      amplitude,
      phase: Math.random() * Math.PI * 2,
      duration
    };
  }

  generateIsochronicCarrier(
    frequency: number,
    pulseRate: number,
    amplitude: number = 0.08,
    duration: number = 45000
  ): CarrierSignal {
    return {
      type: 'isochronic',
      baseFrequency: frequency,
      modulationFrequency: pulseRate,
      amplitude,
      phase: 0,
      duration
    };
  }

  syncWithPlanetaryAlignment(signal: CarrierSignal): CarrierSignal {
    if (!this.planetaryData) return signal;

    const alignedSignal = { ...signal };

    switch (signal.type) {
      case 'binaural':
        // Sync with Schumann resonance
        const nearestSchumann = this.findNearestFrequency(
          signal.baseFrequency,
          this.planetaryData.schumann
        );
        alignedSignal.baseFrequency = nearestSchumann;
        alignedSignal.modulationFrequency *= (1 + Math.sin(this.planetaryData.lunarPhase) * 0.1);
        break;

      case 'infrasonic':
        // Sync with geomagnetic flux
        alignedSignal.baseFrequency = this.planetaryData.geomagnetic;
        alignedSignal.amplitude *= (1 + Math.sin(this.planetaryData.solarCycle) * 0.2);
        break;

      case 'isochronic':
        // Sync with temporal fractal
        alignedSignal.modulationFrequency *= (1 + this.planetaryData.temporalFractal * 0.15);
        break;
    }

    return alignedSignal;
  }

  private findNearestFrequency(target: number, frequencies: number[]): number {
    return frequencies.reduce((nearest, freq) => 
      Math.abs(freq - target) < Math.abs(nearest - target) ? freq : nearest
    );
  }

  startCarrierLayer(signals: CarrierSignal[], silentMode: boolean = true): void {
    this.stopCarrierLayer();
    this.isActive = true;

    signals.forEach(signal => {
      const alignedSignal = this.syncWithPlanetaryAlignment(signal);
      this.createCarrierNode(alignedSignal, silentMode);
    });
  }

  private createCarrierNode(signal: CarrierSignal, silentMode: boolean): void {
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

  stopCarrierLayer(): void {
    this.carrierNodes.forEach(node => {
      try {
        node.disconnect();
      } catch (e) {
        // Node already disconnected
      }
    });
    this.carrierNodes = [];
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
    return this.generateInfrasonicCarrier(7.83, 0.05, 120000);
  }

  generateEarthResonance(): CarrierSignal[] {
    return [
      this.generateInfrasonicCarrier(7.83, 0.04, 90000),  // Primary Schumann
      this.generateInfrasonicCarrier(14.3, 0.03, 90000), // Second harmonic
      this.generateInfrasonicCarrier(20.8, 0.02, 90000)  // Third harmonic
    ];
  }
}
