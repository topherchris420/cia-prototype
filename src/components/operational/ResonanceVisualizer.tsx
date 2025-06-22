
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResonanceVisualizerProps {
  state: any;
  mode: 'cymatic' | 'spectral' | 'attractor';
  onModeChange: (mode: 'cymatic' | 'spectral' | 'attractor') => void;
  isActive: boolean;
}

export const ResonanceVisualizer = ({ 
  state, 
  mode, 
  onModeChange, 
  isActive 
}: ResonanceVisualizerProps) => {
  const isMobile = useIsMobile();
  const modes = [
    { key: 'cymatic', label: isMobile ? 'CYM' : 'CYMATIC', icon: '◯' },
    { key: 'spectral', label: isMobile ? 'SPEC' : 'SPECTRAL', icon: '◈' },
    { key: 'attractor', label: isMobile ? 'ATT' : 'ATTRACTOR', icon: '◊' }
  ];

  return (
    <div className="bg-black/10 backdrop-blur-sm rounded-3xl border border-gray-700/20 p-4 sm:p-6 h-full relative overflow-hidden">
      
      {/* Mode Selector */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex space-x-1 sm:space-x-2">
        {modes.map((modeOption) => (
          <button
            key={modeOption.key}
            onClick={() => onModeChange(modeOption.key as any)}
            className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium tracking-wider transition-all duration-300 touch-manipulation ${
              mode === modeOption.key
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                : 'bg-black/20 text-gray-400/70 border border-gray-600/20 hover:text-gray-300'
            }`}
          >
            <span className="mr-1">{modeOption.icon}</span>
            {modeOption.label}
          </button>
        ))}
      </div>

      {/* Status Indicator */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isActive ? 'bg-cyan-400/80 animate-pulse' : 'bg-gray-600/40'
        }`} />
      </div>

      {/* Central Visualizer Area */}
      <div className="absolute inset-4 sm:inset-6 flex items-center justify-center">
        
        {mode === 'cymatic' && (
          <div className={`relative ${isMobile ? 'w-48 h-48' : 'w-64 h-64'}`}>
            {/* Cymatic pattern rings */}
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute inset-0 border border-cyan-400/20 rounded-full animate-pulse"
                style={{
                  transform: `scale(${(i + 1) * 0.125})`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${2 + i * 0.3}s`
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-cyan-400/60 rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {mode === 'spectral' && (
          <div className={`w-full ${isMobile ? 'h-24' : 'h-32'} flex items-end justify-center space-x-1`}>
            {/* Spectral bars */}
            {Array.from({ length: isMobile ? 24 : 32 }, (_, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-violet-500/60 to-violet-300/80 rounded-t transition-all duration-100"
                style={{
                  width: isMobile ? '4px' : '6px',
                  height: `${20 + Math.sin(Date.now() * 0.01 + i * 0.3) * (isMobile ? 30 : 40)}px`,
                  opacity: 0.4 + Math.sin(Date.now() * 0.005 + i * 0.2) * 0.3
                }}
              />
            ))}
          </div>
        )}

        {mode === 'attractor' && (
          <div className={`relative ${isMobile ? 'w-48 h-48' : 'w-64 h-64'}`}>
            {/* 3D attractor visualization */}
            <div className="absolute inset-0">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-emerald-400/60 rounded-full"
                  style={{
                    left: `${50 + Math.sin(Date.now() * 0.002 + i) * 40}%`,
                    top: `${50 + Math.cos(Date.now() * 0.003 + i) * 40}%`,
                    transform: `scale(${0.3 + Math.sin(Date.now() * 0.004 + i) * 0.7})`,
                    opacity: 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.4
                  }}
                />
              ))}
            </div>
            
            {/* Attractor field lines */}
            <svg className="absolute inset-0 w-full h-full">
              {Array.from({ length: 6 }, (_, i) => {
                const size = isMobile ? 96 : 128;
                return (
                  <path
                    key={i}
                    d={`M ${size + Math.sin(Date.now() * 0.001 + i) * 60} ${size + Math.cos(Date.now() * 0.001 + i) * 45} Q ${size} ${size} ${size - Math.sin(Date.now() * 0.001 + i) * 60} ${size - Math.cos(Date.now() * 0.001 + i) * 45}`}
                    stroke="rgba(16, 185, 129, 0.3)"
                    strokeWidth="1"
                    fill="none"
                    opacity={0.2 + Math.sin(Date.now() * 0.002 + i) * 0.3}
                  />
                );
              })}
            </svg>
          </div>
        )}

      </div>

      {/* Coherence Metrics */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400/60 uppercase tracking-wider">
            COHERENCE: {(state.coherence * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400/60 uppercase tracking-wider">
            {state.frequency.toFixed(1)} Hz
          </div>
        </div>
        <div className="w-full bg-gray-800/20 rounded-full h-1 mt-2">
          <div 
            className="bg-gradient-to-r from-cyan-500/40 to-violet-500/40 h-1 rounded-full transition-all duration-500"
            style={{ width: `${state.coherence * 100}%` }}
          />
        </div>
      </div>

    </div>
  );
};
