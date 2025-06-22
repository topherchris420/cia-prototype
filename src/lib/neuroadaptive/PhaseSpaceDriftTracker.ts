
import { BiometricState, NeuralFrequencyBand } from './BiometricAnalyzer';
import { ConsciousnessVector3D, ConsciousnessVectorUtils } from './ConsciousnessVector';
import { AttractorBasin, AttractorBasinManager } from './AttractorBasin';
import { CoherenceCollapse, CoherenceCollapseDetector } from './CoherenceCollapse';
import { PhaseSpaceAnalyzer } from './PhaseSpaceAnalyzer';

export type { ConsciousnessVector3D, AttractorBasin, CoherenceCollapse };

export class PhaseSpaceDriftTracker {
  private trajectoryHistory: ConsciousnessVector3D[] = [];
  private maxHistoryLength = 2000;
  private attractorBasinManager: AttractorBasinManager;
  private coherenceCollapseDetector: CoherenceCollapseDetector;

  constructor() {
    this.attractorBasinManager = new AttractorBasinManager();
    this.coherenceCollapseDetector = new CoherenceCollapseDetector();
  }

  mapBiometricToVector3D(
    biometricState: BiometricState,
    neuralBands: NeuralFrequencyBand,
    timestamp: number
  ): ConsciousnessVector3D {
    const lastVector = this.trajectoryHistory.length > 0 ? 
      this.trajectoryHistory[this.trajectoryHistory.length - 1] : undefined;

    const vector = ConsciousnessVectorUtils.mapBiometricToVector3D(
      biometricState,
      neuralBands,
      timestamp,
      lastVector
    );

    this.trajectoryHistory.push(vector);
    
    // Maintain history size
    if (this.trajectoryHistory.length > this.maxHistoryLength) {
      this.trajectoryHistory.shift();
    }

    // Check for coherence collapse
    this.coherenceCollapseDetector.detectCoherenceCollapse(vector, this.trajectoryHistory);

    // Update attractor basins based on current trajectory
    this.attractorBasinManager.updateAttractorBasins(this.trajectoryHistory);

    return vector;
  }

  getCurrentTrajectory(): ConsciousnessVector3D[] {
    return [...this.trajectoryHistory];
  }

  getAttractorBasins(): AttractorBasin[] {
    return this.attractorBasinManager.getAttractorBasins();
  }

  getRecentCollapses(timeWindow: number = 30000): CoherenceCollapse[] {
    return this.coherenceCollapseDetector.getRecentCollapses(timeWindow);
  }

  generatePhaseSpaceField(resolution: number = 20): number[][][] {
    return PhaseSpaceAnalyzer.generatePhaseSpaceField(this.getAttractorBasins(), resolution);
  }

  exportPhaseSpaceData(): string {
    return PhaseSpaceAnalyzer.exportPhaseSpaceData(
      this.trajectoryHistory,
      this.getAttractorBasins(),
      this.coherenceCollapseDetector.getCollapseEvents()
    );
  }
}
