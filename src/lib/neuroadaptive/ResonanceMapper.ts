
import { BiometricState, NeuralFrequencyBand } from './BiometricAnalyzer';

export interface ConsciousnessVector {
  timestamp: number;
  biometricState: BiometricState;
  neuralBands: NeuralFrequencyBand;
  coherenceLevel: number;
  phaseTransition: boolean;
  dominantBand: keyof NeuralFrequencyBand;
}

export interface PhaseTransition {
  from: keyof NeuralFrequencyBand;
  to: keyof NeuralFrequencyBand;
  timestamp: number;
  confidence: number;
  duration: number;
}

export class ResonanceMapper {
  private stateHistory: ConsciousnessVector[] = [];
  private transitionHistory: PhaseTransition[] = [];
  private maxHistoryLength = 1000;
  private readonly transitionThreshold = 0.3;

  logStateVector(
    biometricState: BiometricState,
    neuralBands: NeuralFrequencyBand
  ): ConsciousnessVector {
    const coherenceLevel = this.calculateCoherence(neuralBands);
    const dominantBand = this.getDominantBand(neuralBands);
    
    const vector: ConsciousnessVector = {
      timestamp: Date.now(),
      biometricState,
      neuralBands,
      coherenceLevel,
      phaseTransition: false,
      dominantBand
    };

    // Detect phase transitions
    if (this.stateHistory.length > 0) {
      const lastVector = this.stateHistory[this.stateHistory.length - 1];
      if (lastVector.dominantBand !== dominantBand) {
        const transition = this.detectPhaseTransition(lastVector, vector);
        if (transition) {
          vector.phaseTransition = true;
          this.transitionHistory.push(transition);
        }
      }
    }

    this.stateHistory.push(vector);
    
    // Maintain history size
    if (this.stateHistory.length > this.maxHistoryLength) {
      this.stateHistory.shift();
    }

    return vector;
  }

  private calculateCoherence(bands: NeuralFrequencyBand): number {
    const values = Object.values(bands);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const coherence = 1 / (1 + variance); // Higher coherence = lower variance
    return Math.min(Math.max(coherence, 0), 1);
  }

  private getDominantBand(bands: NeuralFrequencyBand): keyof NeuralFrequencyBand {
    return Object.entries(bands).reduce((dominant, [band, value]) => 
      value > bands[dominant as keyof NeuralFrequencyBand] ? band as keyof NeuralFrequencyBand : dominant,
      'alpha' as keyof NeuralFrequencyBand
    );
  }

  private detectPhaseTransition(
    previousVector: ConsciousnessVector,
    currentVector: ConsciousnessVector
  ): PhaseTransition | null {
    const bandDifference = Math.abs(
      currentVector.neuralBands[currentVector.dominantBand] - 
      previousVector.neuralBands[previousVector.dominantBand]
    );

    if (bandDifference > this.transitionThreshold) {
      return {
        from: previousVector.dominantBand,
        to: currentVector.dominantBand,
        timestamp: currentVector.timestamp,
        confidence: Math.min(bandDifference, 1),
        duration: currentVector.timestamp - previousVector.timestamp
      };
    }

    return null;
  }

  getRecentVectors(count: number = 10): ConsciousnessVector[] {
    return this.stateHistory.slice(-count);
  }

  getTransitionHistory(): PhaseTransition[] {
    return [...this.transitionHistory];
  }

  getCoherenceTrend(windowSize: number = 20): number {
    if (this.stateHistory.length < windowSize) return 0;
    
    const recentVectors = this.stateHistory.slice(-windowSize);
    const coherenceValues = recentVectors.map(v => v.coherenceLevel);
    
    // Calculate trend (positive = increasing coherence)
    const firstHalf = coherenceValues.slice(0, windowSize / 2);
    const secondHalf = coherenceValues.slice(windowSize / 2);
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    return secondAvg - firstAvg;
  }

  getCurrentState(): ConsciousnessVector | null {
    return this.stateHistory.length > 0 ? 
      this.stateHistory[this.stateHistory.length - 1] : null;
  }

  clearHistory(): void {
    this.stateHistory = [];
    this.transitionHistory = [];
  }

  exportSessionData(): string {
    return JSON.stringify({
      vectors: this.stateHistory,
      transitions: this.transitionHistory,
      sessionDuration: this.stateHistory.length > 0 ? 
        Date.now() - this.stateHistory[0].timestamp : 0
    });
  }
}
