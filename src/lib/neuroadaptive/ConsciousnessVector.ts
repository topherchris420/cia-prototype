
import { BiometricState, NeuralFrequencyBand } from './BiometricAnalyzer';

export interface ConsciousnessVector3D {
  x: number; // Cognitive dimension
  y: number; // Emotional dimension  
  z: number; // Attentional dimension
  timestamp: number;
  coherenceRadius: number;
  phaseVelocity: number[];
}

export class ConsciousnessVectorUtils {
  static mapBiometricToVector3D(
    biometricState: BiometricState,
    neuralBands: NeuralFrequencyBand,
    timestamp: number,
    lastVector?: ConsciousnessVector3D
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
    if (lastVector) {
      const dt = (timestamp - lastVector.timestamp) / 1000; // Convert to seconds
      
      if (dt > 0) {
        phaseVelocity = [
          (cognitiveX - lastVector.x) / dt,
          (emotionalY - lastVector.y) / dt,
          (attentionalZ - lastVector.z) / dt
        ];
      }
    }

    return {
      x: cognitiveX,
      y: emotionalY,
      z: attentionalZ,
      timestamp,
      coherenceRadius,
      phaseVelocity
    };
  }

  static calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return variance;
  }

  static distance3D(v1: ConsciousnessVector3D, v2: ConsciousnessVector3D): number {
    return Math.sqrt(
      Math.pow(v1.x - v2.x, 2) +
      Math.pow(v1.y - v2.y, 2) +
      Math.pow(v1.z - v2.z, 2)
    );
  }

  static interpolateVectors(v1: ConsciousnessVector3D, v2: ConsciousnessVector3D, factor: number): ConsciousnessVector3D {
    return {
      x: v1.x + (v2.x - v1.x) * factor,
      y: v1.y + (v2.y - v1.y) * factor,
      z: v1.z + (v2.z - v1.z) * factor,
      timestamp: Math.max(v1.timestamp, v2.timestamp),
      coherenceRadius: v1.coherenceRadius + (v2.coherenceRadius - v1.coherenceRadius) * factor,
      phaseVelocity: [0, 0, 0]
    };
  }

  static calculateCentroid(vectors: ConsciousnessVector3D[]): ConsciousnessVector3D {
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
}
