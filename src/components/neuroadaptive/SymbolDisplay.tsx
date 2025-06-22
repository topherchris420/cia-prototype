
import { AdaptiveSymbol } from '@/lib/neuroadaptive/SyntheticNoeticsEngine';

interface SymbolDisplayProps {
  adaptiveSymbols: AdaptiveSymbol[];
}

export const SymbolDisplay = ({ adaptiveSymbols }: SymbolDisplayProps) => {
  if (adaptiveSymbols.length === 0) return null;

  return (
    <div className="bg-black/30 rounded-2xl p-4 border border-purple-400/30">
      <div className="text-xs text-purple-300/70 uppercase tracking-wider mb-3">
        Dynamic Symbol Stream
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {adaptiveSymbols.map((symbol, index) => (
          <div
            key={index}
            className="relative"
            style={{
              transform: `rotate(${symbol.phase * 57.3}deg) scale(${1 + symbol.semanticWeight * 0.5})`,
              opacity: 0.7 + symbol.coherenceLevel * 0.3
            }}
          >
            <span 
              className="text-2xl text-purple-300 animate-pulse"
              style={{
                textShadow: `0 0 ${symbol.frequency * 0.1}px rgba(147, 51, 234, 0.6)`,
                filter: `hue-rotate(${symbol.frequency * 3}deg)`
              }}
            >
              {symbol.glyph}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
