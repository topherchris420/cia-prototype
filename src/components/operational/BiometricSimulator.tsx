
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BiometricData {
  heartRate: number;
  heartRateVariability: number;
  breathingRate: number;
  coherenceLevel: number;
  stressLevel: number;
}

interface BiometricSimulatorProps {
  isActive: boolean;
  onBiometricUpdate: (data: BiometricData) => void;
}

export const BiometricSimulator = ({ isActive, onBiometricUpdate }: BiometricSimulatorProps) => {
  const isMobile = useIsMobile();
  const [biometricData, setBiometricData] = useState<BiometricData>({
    heartRate: 72,
    heartRateVariability: 45,
    breathingRate: 16,
    coherenceLevel: 0.65,
    stressLevel: 0.3
  });

  const [simulationPhase, setSimulationPhase] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSimulationPhase(prev => prev + 0.1);
      
      // Simulate realistic biometric variations
      const heartRateBase = 72 + Math.sin(simulationPhase * 0.05) * 8;
      const breathingBase = 16 + Math.sin(simulationPhase * 0.03) * 4;
      const stressVariation = 0.3 + Math.sin(simulationPhase * 0.07) * 0.2;
      
      const newData: BiometricData = {
        heartRate: Math.max(60, Math.min(90, heartRateBase + (Math.random() - 0.5) * 5)),
        heartRateVariability: Math.max(20, Math.min(80, 45 + Math.sin(simulationPhase * 0.04) * 15)),
        breathingRate: Math.max(12, Math.min(20, breathingBase + (Math.random() - 0.5) * 2)),
        coherenceLevel: Math.max(0.2, Math.min(0.95, 0.65 + Math.sin(simulationPhase * 0.06) * 0.25)),
        stressLevel: Math.max(0.1, Math.min(0.8, stressVariation + (Math.random() - 0.5) * 0.1))
      };

      setBiometricData(newData);
      onBiometricUpdate(newData);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, simulationPhase, onBiometricUpdate]);

  if (!isActive) return null;

  return (
    <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-gray-700/20 p-3 sm:p-4">
      <div className="text-xs text-gray-400/60 uppercase tracking-widest mb-3 text-center">
        BIOMETRIC FEED
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
        <div className="space-y-1">
          <div className="text-gray-400/70">HR</div>
          <div className="text-cyan-300 font-mono flex items-center">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-2" />
            {Math.round(biometricData.heartRate)}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-gray-400/70">HRV</div>
          <div className="text-green-300 font-mono">
            {Math.round(biometricData.heartRateVariability)}ms
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-gray-400/70">BREATH</div>
          <div className="text-blue-300 font-mono flex items-center">
            <div 
              className="w-2 h-2 bg-blue-400 rounded-full mr-2"
              style={{
                transform: `scale(${0.8 + Math.sin(simulationPhase * 0.3) * 0.4})`,
                opacity: 0.6 + Math.sin(simulationPhase * 0.3) * 0.4
              }}
            />
            {Math.round(biometricData.breathingRate)}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-gray-400/70">COHERENCE</div>
          <div className="text-violet-300 font-mono">
            {(biometricData.coherenceLevel * 100).toFixed(0)}%
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-700/20">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400/70">STRESS</span>
          <span className={`text-xs font-mono ${
            biometricData.stressLevel > 0.6 ? 'text-red-300' : 
            biometricData.stressLevel > 0.4 ? 'text-yellow-300' : 'text-green-300'
          }`}>
            {(biometricData.stressLevel * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-800/30 rounded-full h-1 mt-1">
          <div 
            className={`h-1 rounded-full transition-all duration-1000 ${
              biometricData.stressLevel > 0.6 ? 'bg-red-400/70' : 
              biometricData.stressLevel > 0.4 ? 'bg-yellow-400/70' : 'bg-green-400/70'
            }`}
            style={{ width: `${biometricData.stressLevel * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
