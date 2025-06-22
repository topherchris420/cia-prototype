
import { Button } from '@/components/ui/button';

interface NeuralBandSelectorProps {
  currentTarget: 'alpha' | 'theta' | 'gamma' | 'delta' | 'beta';
  setCurrentTarget: (target: 'alpha' | 'theta' | 'gamma' | 'delta' | 'beta') => void;
}

export const NeuralBandSelector = ({ currentTarget, setCurrentTarget }: NeuralBandSelectorProps) => {
  return (
    <div className="space-y-4">
      <label className="text-purple-300/80 text-sm font-light tracking-wide">
        Consciousness Target Vector
      </label>
      <div className="grid grid-cols-5 gap-3">
        {(['delta', 'theta', 'alpha', 'beta', 'gamma'] as const).map((band) => (
          <Button
            key={band}
            onClick={() => setCurrentTarget(band)}
            variant="ghost"
            className={`${
              currentTarget === band 
                ? 'bg-purple-500/40 text-purple-200 border-2 border-purple-400/70 shadow-lg shadow-purple-500/20' 
                : 'bg-black/20 text-white/60 hover:bg-purple-500/20 border border-purple-500/20'
            } transition-all duration-300 transform hover:scale-105`}
          >
            <div className="flex flex-col items-center py-2">
              <span className="text-xs font-medium">{band.toUpperCase()}</span>
              <div className="w-8 h-1 mt-1 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 opacity-70" />
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
