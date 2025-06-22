
import { BiometricState, NeuralFrequencyBand } from './BiometricAnalyzer';

export interface ConsciousnessVector3D {
  x: number; // Cognitive dimension
  y: number; // Emotional dimension  
  z: number; // Attentional dimension
  timestamp: number;
  coherenceRadius: number;
  phaseVelocity: number[];
}

export interface AttractorBasin {
  center: ConsciousnessVector3D;
  radius: number;
  strength: number;
  type: 'stable' | 'unstable' | 'spiral' | 'chaotic';
  resonantFrequency: number;
}

export interface CoherenceCollapse {
  onset: number;
  duration: number;
  magnitude: number;
  recoveryPattern: 'exponential' | 'oscillatory' | 'discontinuous';
  triggerState: ConsciousnessVector3D;
}

export class PhaseSpaceDriftTracker {
  private trajectoryHistory: ConsciousnessVector3D[] = [];
  private attractorBasins: AttractorBasin[] = [];
  private collapseEvents: CoherenceCollapse[] = [];
  private maxHistoryLength = 2000;
  private coherenceThreshold = 0.3;

  constructor() {
    this.initializeAttractorBasins();
  }

  private initializeAttractorBasins(): void {
    // Define archetypal consciousness attractor basins
    this.attractorBasins = [
      {
        center: { x: 0.8, y: 0.7, z: 0.9, timestamp: 0, coherenceRadius: 0.2, phaseVelocity: [0, 0, 0] },
        radius: 0.25,
        strength: 0.8,
        type: 'stable',
        resonantFrequency: 10.5 // Alpha
      },
      {
        center: { x: 0.3, y: 0.2, z: 0.1, timestamp: 0, coherenceRadius: 0.4, phaseVelocity: [0, 0, 0] },
        radius: 0.35,
        strength: 0.6,
        type: 'stable',
        resonantFrequency: 2.5 // Delta
      },
      {
        center: { x: 0.9, y: 0.8, z: 0.95, timestamp: 0, coherenceRadius: 0.1, phaseVelocity: [0, 0, 0] },
        radius: 0.15,
        strength: 0.9,
        type: 'unstable',
        resonantFrequency: 40 // Gamma
      },
      {
        center: { x: 0.5, y: 0.5, z: 0.5, timestamp: 0, coherenceRadius: 0.3, phaseVelocity: [0, 0, 0] },
        radius: 0.4,
        strength: 0.4,
        type: 'chaotic',
        resonantFrequency: 6.5 // Theta
      }
    ];
  }

  mapBiometricToVector3D(
    biometricState: BiometricState,
    neuralBands: NeuralFrequencyBand,
    timestamp: number
  ): ConsciousnessVector3D {
    // Map biometric states to 3D consciousness coordinates
    const cognitiveX = biometricState.cognitiveLoad;
    const emotionalY = biometricState.emotionalValence;
    const attentionalZ = biometricState.attentionLevel;

    // Calculate coherence radius based on neural band coherence
    const bandValues = Object.values(neuralBands);
    const bandVariance = this.calculateVariance(bandValues);
    const coherenceRadius = 1 / (1 + bandVariance * 5);

    // Calculate phase velocity (rate of change)
    let phaseVelocity = [0, 0, 0];
    if (this.trajectoryHistory.length > 0) {
      const lastVector = this.trajectoryHistory[this.trajectoryHistory.length - 1];
      const dt = (timestamp - lastVector.timestamp) / 1000; // Convert to seconds
      
      if (dt > 0) {
        phaseVelocity = [
          (cognitiveX - lastVector.x) / dt,
          (emotionalY - lastVector.y) / dt,
          (attentionalZ - lastVector.z) / dt
        ];
      }
    }

    const vector: ConsciousnessVector3D = {
      x: cognitiveX,
      y: emotionalY,
      z: attentionalZ,
      timestamp,
      coherenceRadius,
      phaseVelocity
    };

    this.trajectoryHistory.push(vector);
    
    // Maintain history size
    if (this.trajectoryHistory.length > this.maxHistoryLength) {
      this.trajectoryHistory.shift();
    }

    // Check for coherence collapse
    this.detectCoherenceCollapse(vector);

    // Update attractor basins based on current trajectory
    this.updateAttractorBasins();

    return vector;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return variance;
  }

  private detectCoherenceCollapse(currentVector: ConsciousnessVector3D): void {
    if (currentVector.coherenceRadius < this.coherenceThreshold) {
      const existingCollapse = this.collapseEvents.find(c => 
        c.onset > currentVector.timestamp - 5000 && // Within last 5 seconds
        c.duration === 0 // Still ongoing
      );

      if (!existingCollapse) {
        // New collapse event
        this.collapseEvents.push({
          onset: currentVector.timestamp,
          duration: 0,
          magnitude: this.coherenceThreshold - currentVector.coherenceRadius,
          recoveryPattern: 'exponential',
          triggerState: { ...currentVector }
        });
      }
    } else {
      // Check if any ongoing collapse is recovering
      const ongoingCollapse = this.collapseEvents.find(c => c.duration === 0);
      if (ongoingCollapse) {
        ongoingCollapse.duration = currentVector.timestamp - ongoingCollapse.onset;
        ongoingCollapse.recoveryPattern = this.determineRecoveryPattern(ongoingCollapse);
      }
    }

    // Clean up old collapse events
    this.collapseEvents = this.collapseEvents.filter(c => 
      currentVector.timestamp - c.onset < 60000 // Keep last minute
    );
  }

  private determineRecoveryPattern(collapse: CoherenceCollapse): 'exponential' | 'oscillatory' | 'discontinuous' {
    const recentVectors = this.trajectoryHistory.slice(-10);
    const coherenceValues = recentVectors.map(v => v.coherenceRadius);
    
    // Simple heuristic for recovery pattern classification
    const increasing = coherenceValues.every((val, i) => i === 0 || val >= coherenceValues[i - 1]);
    const oscillating = coherenceValues.some((val, i) => 
      i > 0 && i < coherenceValues.length - 1 &&
      ((val > coherenceValues[i - 1] && val > coherenceValues[i + 1]) ||
       (val < coherenceValues[i - 1] && val < coherenceValues[i + 1]))
    );

    if (oscillating) return 'oscillatory';
    if (increasing) return 'exponential';
    return 'discontinuous';
  }

  private updateAttractorBasins(): void {
    // Dynamically adjust attractor basins based on trajectory patterns
    if (this.trajectoryHistory.length < 50) return;

    const recentVectors = this.trajectoryHistory.slice(-50);
    
    // Find density clusters in recent trajectory
    const clusters = this.findDensityClusters(recentVectors);
    
    // Update existing basins or create new ones
    clusters.forEach(cluster => {
      const nearestBasin = this.findNearestAttractor(cluster.center);
      if (nearestBasin && this.distance3D(nearestBasin.center, cluster.center) < 0.3) {
        // Update existing basin
        nearestBasin.center = this.interpolateVectors(nearestBasin.center, cluster.center, 0.1);
        nearestBasin.strength = Math.min(nearestBasin.strength + 0.01, 1.0);
      } else if (cluster.density > 5) {
        // Create new basin
        this.attractorBasins.push({
          center: cluster.center,
          radius: cluster.radius,
          strength: Math.min(cluster.density / 20, 0.8),
          type: 'spiral',
          resonantFrequency: 8 + Math.random() * 32
        });
      }
    });

    // Limit number of basins
    if (this.attractorBasins.length > 8) {
      this.attractorBasins.sort((a, b) => b.strength - a.strength);
      this.attractorBasins = this.attractorBasins.slice(0, 8);
    }
  }

  private findDensityClusters(vectors: ConsciousnessVector3D[]): Array<{
    center: ConsciousnessVector3D;
    radius: number;
    density: number;
  }> {
    const clusters = [];
    const gridSize = 0.2;
    const grid = new Map<string, ConsciousnessVector3D[]>();

    // Group vectors into grid cells
    vectors.forEach(vector => {
      const key = `${Math.floor(vector.x / gridSize)},${Math.floor(vector.y / gridSize)},${Math.floor(vector.z / gridSize)}`;
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key)!.push(vector);
    });

    // Find dense cells
    grid.forEach((cellVectors, key) => {
      if (cellVectors.length >= 3) {
        const center = this.calculateCentroid(cellVectors);
        const maxDistance = Math.max(...cellVectors.map(v => this.distance3D(center, v)));
        
        clusters.push({
          center,
          radius: maxDistance,
          density: cellVectors.length
        });
      }
    });

    return clusters;
  }

  private calculateCentroid(vectors: ConsciousnessVector3D[]): ConsciousnessVector3D {
    const sum = vectors.reduce((acc, v) => ({
      x: acc.x + v.x,
      y: acc.y + v.y,
      z: acc.z + v.z,
      timestamp: Math.max(acc.timestamp, v.timestamp),
      coherenceRadius: acc.coherenceRadius + v.coherenceRadius,
      phaseVelocity: [0, 0, 0]
    }), { x: 0, y: 0, z: 0, timestamp: 0, coherenceRadius: 0, phaseVelocity: [0, 0, 0] });

    return {
      x: sum.x / vectors.length,
      y: sum.y / vectors.length,
      z: sum.z / vectors.length,
      timestamp: sum.timestamp,
      coherenceRadius: sum.coherenceRadius / vectors.length,
      phaseVelocity: [0, 0, 0]
    };
  }

  private findNearestAttractor(vector: ConsciousnessVector3D): AttractorBasin | null {
    let nearest: AttractorBasin | null = null;
    let minDistance = Infinity;

    this.attractorBasins.forEach(basin => {
      const distance = this.distance3D(basin.center, vector);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = basin;
      }
    });

    return nearest;
  }

  private distance3D(v1: ConsciousnessVector3D, v2: ConsciousnessVector3D): number {
    return Math.sqrt(
      Math.pow(v1.x - v2.x, 2) +
      Math.pow(v1.y - v2.y, 2) +
      Math.pow(v1.z - v2.z, 2)
    );
  }

  private interpolateVectors(v1: ConsciousnessVector3D, v2: ConsciousnessVector3D, factor: number): ConsciousnessVector3D {
    return {
      x: v1.x + (v2.x - v1.x) * factor,
      y: v1.y + (v2.y - v1.y) * factor,
      z: v1.z + (v2.z - v1.z) * factor,
      timestamp: Math.max(v1.timestamp, v2.timestamp),
      coherenceRadius: v1.coherenceRadius + (v2.coherenceRadius - v1.coherenceRadius) * factor,
      phaseVelocity: [0, 0, 0]
    };
  }

  getCurrentTrajectory(): ConsciousnessVector3D[] {
    return [...this.trajectoryHistory];
  }

  getAttractorBasins(): AttractorBasin[] {
    return [...this.attractorBasins];
  }

  getRecentCollapses(timeWindow: number = 30000): CoherenceCollapse[] {
    const cutoff = Date.now() - timeWindow;
    return this.collapseEvents.filter(c => c.onset >= cutoff);
  }

  generatePhaseSpaceField(resolution: number = 20): number[][][] {
    const field: number[][][] = [];
    const step = 1 / resolution;

    for (let x = 0; x < resolution; x++) {
      field[x] = [];
      for (let y = 0; y < resolution; y++) {
        field[x][y] = [];
        for (let z = 0; z < resolution; z++) {
          const point: ConsciousnessVector3D = {
            x: x * step,
            y: y * step,
            z: z * step,
            timestamp: Date.now(),
            coherenceRadius: 0,
            phaseVelocity: [0, 0, 0]
          };

          // Calculate field strength at this point
          let fieldStrength = 0;
          this.attractorBasins.forEach(basin => {
            const distance = this.distance3D(point, basin.center);
            if (distance < basin.radius) {
              fieldStrength += basin.strength * (1 - distance / basin.radius);
            }
          });

          field[x][y][z] = fieldStrength;
        }
      }
    }

    return field;
  }

  exportPhaseSpaceData(): string {
    return JSON.stringify({
      trajectory: this.trajectoryHistory,
      attractors: this.attractorBasins,
      collapses: this.collapseEvents,
      fieldResolution: 20,
      phaseField: this.generatePhaseSpaceField(20)
    });
  }
}
