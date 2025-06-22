
import { ConsciousnessVector3D, ConsciousnessVectorUtils } from './ConsciousnessVector';

export interface AttractorBasin {
  center: ConsciousnessVector3D;
  radius: number;
  strength: number;
  type: 'stable' | 'unstable' | 'spiral' | 'chaotic';
  resonantFrequency: number;
}

export class AttractorBasinManager {
  private attractorBasins: AttractorBasin[] = [];

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

  updateAttractorBasins(trajectoryHistory: ConsciousnessVector3D[]): void {
    // Dynamically adjust attractor basins based on trajectory patterns
    if (trajectoryHistory.length < 50) return;

    const recentVectors = trajectoryHistory.slice(-50);
    
    // Find density clusters in recent trajectory
    const clusters = this.findDensityClusters(recentVectors);
    
    // Update existing basins or create new ones
    clusters.forEach(cluster => {
      const nearestBasin = this.findNearestAttractor(cluster.center);
      if (nearestBasin && ConsciousnessVectorUtils.distance3D(nearestBasin.center, cluster.center) < 0.3) {
        // Update existing basin
        nearestBasin.center = ConsciousnessVectorUtils.interpolateVectors(nearestBasin.center, cluster.center, 0.1);
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
        const center = ConsciousnessVectorUtils.calculateCentroid(cellVectors);
        const maxDistance = Math.max(...cellVectors.map(v => ConsciousnessVectorUtils.distance3D(center, v)));
        
        clusters.push({
          center,
          radius: maxDistance,
          density: cellVectors.length
        });
      }
    });

    return clusters;
  }

  findNearestAttractor(vector: ConsciousnessVector3D): AttractorBasin | null {
    let nearest: AttractorBasin | null = null;
    let minDistance = Infinity;

    this.attractorBasins.forEach(basin => {
      const distance = ConsciousnessVectorUtils.distance3D(basin.center, vector);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = basin;
      }
    });

    return nearest;
  }

  getAttractorBasins(): AttractorBasin[] {
    return [...this.attractorBasins];
  }
}
