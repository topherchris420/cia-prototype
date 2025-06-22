
import { useState, useEffect, useCallback } from 'react';

interface NoeticsConsoleProps {
  consciousnessState: any;
  textInput: string;
  isActive: boolean;
}

export const NoeticsConsole = ({ 
  consciousnessState, 
  textInput, 
  isActive 
}: NoeticsConsoleProps) => {
  const [symbolChain, setSymbolChain] = useState<string[]>([]);
  const [phaseInsights, setPhaseInsights] = useState<string[]>([]);
  const [recursiveArtifacts, setRecursiveArtifacts] = useState<string[]>([]);

  const generateSymbolChain = useCallback(() => {
    const symbols = ['◊', '◈', '◉', '◎', '○', '◌', '◐', '◑', '◒', '◓'];
    return Array.from({ length: 6 }, () => 
      symbols[Math.floor(Math.random() * symbols.length)]
    );
  }, []);

  const generatePhaseInsight = useCallback(() => {
    const insights = [
      'coherence drift detected',
      'semantic resonance peak',
      'biometric synchronization',
      'phase transition imminent',
      'consciousness vector stable',
      'entropy pulse generated'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  }, []);

  const generateRecursiveArtifact = useCallback((input: string) => {
    if (input.length < 10) return null;
    const words = input.split(' ').filter(word => word.length > 3);
    if (words.length === 0) return null;
    const artifact = words[Math.floor(Math.random() * words.length)];
    return `${artifact}→${artifact.split('').reverse().join('')}`;
  }, []);

  // Simulate noetics engine outputs
  useEffect(() => {
    if (!isActive) {
      setSymbolChain([]);
      setPhaseInsights([]);
      setRecursiveArtifacts([]);
      return;
    }

    const interval = setInterval(() => {
      // Generate symbol chains
      setSymbolChain(generateSymbolChain());

      // Generate phase insights
      if (Math.random() < 0.3) {
        setPhaseInsights(prev => [
          generatePhaseInsight(),
          ...prev.slice(0, 3)
        ]);
      }

      // Generate recursive artifacts
      if (textInput.length > 10 && Math.random() < 0.2) {
        const artifact = generateRecursiveArtifact(textInput);
        if (artifact) {
          setRecursiveArtifacts(prev => [
            artifact,
            ...prev.slice(0, 2)
          ]);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, textInput, generateSymbolChain, generatePhaseInsight, generateRecursiveArtifact]);

  return (
    <div className="bg-black/10 backdrop-blur-xl rounded-2xl border border-gray-700/20 p-4 sm:p-6 h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="text-xs text-gray-400/60 uppercase tracking-widest">
          NOETICS CONSOLE
        </div>
        <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isActive ? 'bg-violet-400/80 animate-pulse' : 'bg-gray-600/40'
        }`} />
      </div>

      <div className="space-y-4 sm:space-y-6 h-full overflow-hidden">
        
        {/* Symbol Chains */}
        <div className="border-l-2 border-violet-500/30 pl-3 sm:pl-4">
          <div className="text-xs text-gray-400/60 uppercase tracking-wider mb-2">
            SYMBOL CHAIN
          </div>
          <div className="flex space-x-2 text-lg sm:text-xl text-violet-300/80">
            {symbolChain.map((symbol, i) => (
              <span
                key={i}
                className="transition-all duration-300"
                style={{
                  opacity: 0.4 + Math.sin(Date.now() * 0.003 + i) * 0.4,
                  transform: `scale(${0.8 + Math.sin(Date.now() * 0.002 + i) * 0.2})`
                }}
              >
                {symbol}
              </span>
            ))}
          </div>
        </div>

        {/* Phase Transition Insights */}
        <div className="border-l-2 border-cyan-500/30 pl-3 sm:pl-4">
          <div className="text-xs text-gray-400/60 uppercase tracking-wider mb-2">
            PHASE INSIGHTS
          </div>
          <div className="space-y-1 max-h-16 overflow-hidden">
            {phaseInsights.map((insight, i) => (
              <div
                key={`${insight}-${i}`}
                className="text-xs text-cyan-300/70 font-mono transition-all duration-500"
                style={{ opacity: 1 - i * 0.3 }}
              >
                {insight}
              </div>
            ))}
          </div>
        </div>

        {/* Recursive Prompt Artifacts */}
        <div className="border-l-2 border-emerald-500/30 pl-3 sm:pl-4">
          <div className="text-xs text-gray-400/60 uppercase tracking-wider mb-2">
            RECURSIVE ARTIFACTS
          </div>
          <div className="space-y-1 max-h-12 overflow-hidden">
            {recursiveArtifacts.map((artifact, i) => (
              <div
                key={`${artifact}-${i}`}
                className="text-xs text-emerald-300/70 font-mono transition-all duration-500"
                style={{ opacity: 1 - i * 0.4 }}
              >
                {artifact}
              </div>
            ))}
          </div>
        </div>

        {/* Consciousness Metrics */}
        <div className="pt-3 sm:pt-4 border-t border-gray-700/20 mt-auto">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-gray-500/60 uppercase tracking-wider">DEPTH</div>
              <div className="text-gray-300/80 font-mono">
                {(consciousnessState.depth * 100).toFixed(0)}%
              </div>
            </div>
            <div>
              <div className="text-gray-500/60 uppercase tracking-wider">AMP</div>
              <div className="text-gray-300/80 font-mono">
                {(consciousnessState.amplitude * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
