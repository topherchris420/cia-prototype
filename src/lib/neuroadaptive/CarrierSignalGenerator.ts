
import { PlanetaryAlignment } from './PlanetaryAlignmentCalculator';

export interface CarrierSignal {
  type: 'binaural' | 'infrasonic' | 'isochronic';
  baseFrequency: number;
  modulationFrequency: number;
  amplitude: number;
  phase: number;
  duration: number;
}

export class CarrierSignalGenerator {
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

  syncWithPlanetaryAlignment(signal: CarrierSignal, planetaryData: PlanetaryAlignment): CarrierSignal {
    const alignedSignal = { ...signal };

    switch (signal.type) {
      case 'binaural':
        // Sync with Schumann resonance
        const nearestSchumann = this.findNearestFrequency(
          signal.baseFrequency,
          planetaryData.schumann
        );
        alignedSignal.baseFrequency = nearestSchumann;
        alignedSignal.modulationFrequency *= (1 + Math.sin(planetaryData.lunarPhase) * 0.1);
        break;

      case 'infrasonic':
        // Sync with geomagnetic flux
        alignedSignal.baseFrequency = planetaryData.geomagnetic;
        alignedSignal.amplitude *= (1 + Math.sin(planetaryData.solarCycle) * 0.2);
        break;

      case 'isochronic':
        // Sync with temporal fractal
        alignedSignal.modulationFrequency *= (1 + planetaryData.temporalFractal * 0.15);
        break;
    }

    return alignedSignal;
  }

  private findNearestFrequency(target: number, frequencies: number[]): number {
    return frequencies.reduce((nearest, freq) => 
      Math.abs(freq - target) < Math.abs(nearest - target) ? freq : nearest
    );
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
