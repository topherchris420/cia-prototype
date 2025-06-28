
interface OperationalMode {
  silentOps: boolean;
  entropyPulse: boolean;
  phaseLock: boolean;
}

interface ToggleArrayProps {
  operationalMode: OperationalMode;
  onModeChange: (mode: Partial<OperationalMode>) => void;
}

export const ToggleArray = ({ operationalMode, onModeChange }: ToggleArrayProps) => {
  const toggles = [
    {
      key: 'silentOps' as keyof OperationalMode,
      label: 'SILENT OPS',
      icon: '◐',
      color: 'cyan',
      description: 'Subliminal carrier suppression',
      frequency: 0.8
    },
    {
      key: 'entropyPulse' as keyof OperationalMode,
      label: 'ENTROPY PULSE',
      icon: '◈',
      color: 'violet',
      description: 'Paradox injection control',
      frequency: 1.2
    },
    {
      key: 'phaseLock' as keyof OperationalMode,
      label: 'PHASE LOCK',
      icon: '◊',
      color: 'emerald',
      description: 'Coherence state override',
      frequency: 0.6
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      cyan: {
        bg: isActive ? 'bg-cyan-500/30' : 'bg-gray-800/10',
        border: isActive ? 'border-cyan-400/70' : 'border-gray-600/20',
        text: isActive ? 'text-cyan-200' : 'text-gray-400',
        glow: isActive ? 'shadow-lg shadow-cyan-500/30' : 'shadow-none',
        indicator: 'bg-cyan-400'
      },
      violet: {
        bg: isActive ? 'bg-violet-500/30' : 'bg-gray-800/10',
        border: isActive ? 'border-violet-400/70' : 'border-gray-600/20',
        text: isActive ? 'text-violet-200' : 'text-gray-400',
        glow: isActive ? 'shadow-lg shadow-violet-500/30' : 'shadow-none',
        indicator: 'bg-violet-400'
      },
      emerald: {
        bg: isActive ? 'bg-emerald-500/30' : 'bg-gray-800/10',
        border: isActive ? 'border-emerald-400/70' : 'border-gray-600/20',
        text: isActive ? 'text-emerald-200' : 'text-gray-400',
        glow: isActive ? 'shadow-lg shadow-emerald-500/30' : 'shadow-none',
        indicator: 'bg-emerald-400'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-gray-700/20 p-4 sm:p-6 h-full">
      <div className="space-y-3 sm:space-y-4">
        
        <div className="text-xs text-gray-400/60 uppercase tracking-widest text-center mb-4 sm:mb-6">
          OPERATIONAL ARRAY
        </div>

        {toggles.map((toggle) => {
          const isActive = operationalMode[toggle.key];
          const colorClasses = getColorClasses(toggle.color, isActive);
          
          return (
            <button
              key={toggle.key}
              onClick={() => onModeChange({ [toggle.key]: !isActive })}
              className={`w-full p-3 sm:p-4 rounded-xl border transition-all duration-500 group relative overflow-hidden ${colorClasses.bg} ${colorClasses.border} ${colorClasses.glow} hover:scale-[1.02] active:scale-[0.98] touch-manipulation`}
            >
              {/* Animated background overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${colorClasses.bg}`} />
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className={`text-xl sm:text-2xl ${colorClasses.text} transition-all duration-500 ${isActive ? 'animate-pulse' : ''}`}>
                  {toggle.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className={`text-xs sm:text-sm font-medium ${colorClasses.text} tracking-wide transition-colors duration-300`}>
                    {toggle.label}
                  </div>
                  <div className="text-xs text-gray-500/80 mt-1 transition-colors duration-300 group-hover:text-gray-400/90">
                    {toggle.description}
                  </div>
                </div>
                <div className={`w-3 h-6 sm:h-8 rounded-full transition-all duration-500 ${isActive ? colorClasses.indicator : 'bg-gray-600/30'} ${isActive ? 'animate-pulse' : ''}`} />
              </div>
            </button>
          );
        })}

        {/* Enhanced Status Indicator */}
        <div className="pt-3 sm:pt-4 border-t border-gray-700/20">
          <div className="flex justify-center space-x-3">
            {Object.entries(operationalMode).map(([key, active], index) => (
              <div
                key={key}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  active ? 'bg-cyan-400/90 animate-pulse' : 'bg-gray-600/30'
                } hover:scale-125`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-500/60 text-center mt-2">
            {Object.values(operationalMode).filter(Boolean).length}/3 ACTIVE
          </div>
        </div>

      </div>
    </div>
  );
};
