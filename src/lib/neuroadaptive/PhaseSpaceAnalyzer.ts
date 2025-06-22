
import { ConsciousnessVector3D, ConsciousnessVectorUtils } from './ConsciousnessVector';
import { AttractorBasin } from './AttractorBasin';

export class PhaseSpaceAnalyzer {
  static generatePhaseSpaceField(attractorBasins: AttractorBasin[], resolution: number = 20): number[][][] {
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
          attractorBasins.forEach(basin => {
            const distance = ConsciousnessVectorUtils.distance3D(point, basin.center);
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

  static exportPhaseSpaceData(
    trajectoryHistory: ConsciousnessVector3D[],
    attractorBasins: AttractorBasin[],
    collapseEvents: any[]
  ): string {
    return JSON.stringify({
      trajectory: trajectoryHistory,
      attractors: attractorBasins,
      collapses: collapseEvents,
      fieldResolution: 20,
      phaseField: this.generatePhaseSpaceField(attractorBasins, 20)
    });
  }
}
