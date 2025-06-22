
import { ConsciousnessVector3D } from './ConsciousnessVector';

export interface CoherenceCollapse {
  onset: number;
  duration: number;
  magnitude: number;
  recoveryPattern: 'exponential' | 'oscillatory' | 'discontinuous';
  triggerState: ConsciousnessVector3D;
}

export class CoherenceCollapseDetector {
  private collapseEvents: CoherenceCollapse[] = [];
  private coherenceThreshold = 0.3;

  detectCoherenceCollapse(currentVector: ConsciousnessVector3D, trajectoryHistory: ConsciousnessVector3D[]): void {
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
        ongoingCollapse.recoveryPattern = this.determineRecoveryPattern(ongoingCollapse, trajectoryHistory);
      }
    }

    // Clean up old collapse events
    this.collapseEvents = this.collapseEvents.filter(c => 
      currentVector.timestamp - c.onset < 60000 // Keep last minute
    );
  }

  private determineRecoveryPattern(collapse: CoherenceCollapse, trajectoryHistory: ConsciousnessVector3D[]): 'exponential' | 'oscillatory' | 'discontinuous' {
    const recentVectors = trajectoryHistory.slice(-10);
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

  getRecentCollapses(timeWindow: number = 30000): CoherenceCollapse[] {
    const cutoff = Date.now() - timeWindow;
    return this.collapseEvents.filter(c => c.onset >= cutoff);
  }

  getCollapseEvents(): CoherenceCollapse[] {
    return [...this.collapseEvents];
  }
}
