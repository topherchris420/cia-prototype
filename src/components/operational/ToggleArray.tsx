
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
      description: 'Subliminal carrier suppression'
    },
    {
      key: 'entropyPulse' as keyof OperationalMode,
      label: 'ENTROPY PULSE',
      icon: '◈',
      color: 'violet',
      description: 'Paradox injection control'
    },
    {
      key: 'phaseLock' as keyof OperationalMode,
      label: 'PHASE LOCK',
      icon: '◊',
      color: 'emerald',
      description: 'Coherence state override'
    }
  ];

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      cyan: {
        bg: isActive ? 'bg-cyan-500/20' : 'bg-gray-800/20',
        border: isActive ? 'border-cyan-400/60' : 'border-gray-600/30',
        text: isActive ? 'text-cyan-300' : 'text-gray-400',
        glow: isActive ? 'shadow-cyan-500/20' : 'shadow-none'
      },
      violet: {
        bg: isActive ? 'bg-violet-500/20' : 'bg-gray-800/20',
        border: isActive ? 'border-violet-400/60' : 'border-gray-600/30',
        text: isActive ? 'text-violet-300' : 'text-gray-400',
        glow: isActive ? 'shadow-violet-500/20' : 'shadow-none'
      },
      emerald: {
        bg: isActive ? 'bg-emerald-500/20' : 'bg-gray-800/20',
        border: isActive ? 'border-emerald-400/60' : 'border-gray-600/30',
        text: isActive ? 'text-emerald-300' : 'text-gray-400',
        glow: isActive ? 'shadow-emerald-500/20' : 'shadow-none'
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-gray-700/20 p-6 h-full">
      <div className="space-y-4">
        
        <div className="text-xs text-gray-400/60 uppercase tracking-widest text-center mb-6">
          OPERATIONAL ARRAY
        </div>

        {toggles.map((toggle) => {
          const isActive = operationalMode[toggle.key];
          const colorClasses = getColorClasses(toggle.color, isActive);
          
          return (
            <button
              key={toggle.key}
              onClick={() => onModeChange({ [toggle.key]: !isActive })}
              className={`w-full p-4 rounded-xl border transition-all duration-300 group ${colorClasses.bg} ${colorClasses.border} ${colorClasses.glow} hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-2xl ${colorClasses.text} transition-all duration-300 ${isActive ? 'animate-pulse' : ''}`}>
                  {toggle.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className={`text-sm font-medium ${colorClasses.text} tracking-wide`}>
                    {toggle.label}
                  </div>
                  <div className="text-xs text-gray-500/80 mt-1">
                    {toggle.description}
                  </div>
                </div>
                <div className={`w-2 h-8 rounded-full transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-b from-${toggle.color}-400/80 to-${toggle.color}-600/60` 
                    : 'bg-gray-600/30'
                }`} />
              </div>
            </button>
          );
        })}

        {/* Status Indicator */}
        <div className="pt-4 border-t border-gray-700/20">
          <div className="flex justify-center space-x-2">
            {Object.values(operationalMode).map((active, index) => (
              <div
                key={index}
                className={`w-1 h-1 rounded-full transition-all duration-300 ${
                  active ? 'bg-cyan-400/80' : 'bg-gray-600/40'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
