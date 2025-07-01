
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ParameterControlProps {
  consciousnessState: any;
  onStateChange: (state: any) => void;
  isActive: boolean;
}

export const ParameterControl = ({ consciousnessState, onStateChange, isActive }: ParameterControlProps) => {
  const isMobile = useIsMobile();
  const [activeParameter, setActiveParameter] = useState<string | null>(null);

  const parameters = [
    {
      key: 'frequency',
      label: 'FREQ',
      unit: 'Hz',
      min: 100,
      max: 1000,
      step: 1,
      color: 'cyan'
    },
    {
      key: 'amplitude',
      label: 'AMP',
      unit: '',
      min: 0,
      max: 1,
      step: 0.01,
      color: 'violet'
    },
    {
      key: 'coherence',
      label: 'COH',
      unit: '%',
      min: 0,
      max: 1,
      step: 0.01,
      color: 'emerald'
    },
    {
      key: 'depth',
      label: 'DEPTH',
      unit: '',
      min: 0,
      max: 1,
      step: 0.01,
      color: 'orange'
    }
  ];

  const handleParameterChange = (key: string, value: number) => {
    console.log(`Parameter ${key} changed to:`, value);
    onStateChange({ [key]: value });
  };

  const getDisplayValue = (param: any) => {
    const value = consciousnessState[param.key];
    if (param.unit === '%') {
      return Math.round(value * 100);
    }
    if (param.unit === 'Hz') {
      return Math.round(value);
    }
    return value.toFixed(2);
  };

  return (
    <div className="bg-black/10 backdrop-blur-sm rounded-xl border border-gray-700/20 p-3 sm:p-4">
      <div className="text-xs text-gray-400/60 uppercase tracking-widest mb-3 text-center">
        PARAMETER MATRIX
      </div>
      
      <div className="space-y-3">
        {parameters.map((param) => {
          const isActive = activeParameter === param.key;
          const value = consciousnessState[param.key];
          
          return (
            <div key={param.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <label 
                  className={`text-xs font-medium cursor-pointer transition-colors duration-300 ${
                    isActive ? `text-${param.color}-300` : 'text-gray-400/70'
                  }`}
                  onClick={() => setActiveParameter(isActive ? null : param.key)}
                >
                  {param.label}
                </label>
                <span 
                  className={`text-xs font-mono cursor-pointer ${
                    isActive ? `text-${param.color}-200` : 'text-gray-300/80'
                  }`}
                  onClick={() => console.log(`${param.key}:`, value)}
                >
                  {getDisplayValue(param)}{param.unit}
                </span>
              </div>
              
              <div className="relative">
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={value}
                  onChange={(e) => handleParameterChange(param.key, parseFloat(e.target.value))}
                  onFocus={() => setActiveParameter(param.key)}
                  onBlur={() => setActiveParameter(null)}
                  className={`w-full h-1 rounded-lg appearance-none cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? `bg-${param.color}-500/30 shadow-lg shadow-${param.color}-500/20` 
                      : 'bg-gray-700/30'
                  }`}
                  disabled={!isActive}
                />
                
                <div 
                  className={`absolute top-0 h-1 rounded-lg transition-all duration-300 pointer-events-none ${
                    isActive ? `bg-${param.color}-400/80` : `bg-${param.color}-400/40`
                  }`}
                  style={{ 
                    width: `${((value - param.min) / (param.max - param.min)) * 100}%` 
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-700/20">
        <div className="flex justify-center space-x-2">
          {parameters.map((param) => (
            <div
              key={param.key}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                activeParameter === param.key 
                  ? `bg-${param.color}-400 shadow-lg shadow-${param.color}-400/50 animate-pulse` 
                  : `bg-${param.color}-400/30`
              }`}
              onClick={() => setActiveParameter(activeParameter === param.key ? null : param.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
