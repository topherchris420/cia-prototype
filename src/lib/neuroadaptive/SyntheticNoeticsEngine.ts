
import { BiometricState } from './BiometricAnalyzer';
import { SemanticAnalyzer, SemanticFingerprint } from './SemanticAnalyzer';
import { AdaptiveSymbolGenerator } from './AdaptiveSymbolGenerator';
import { AdaptiveSymbol } from './SymbolLibrary';

export { SemanticFingerprint, AdaptiveSymbol };

export class SyntheticNoeticsEngine {
  private fingerprint: SemanticFingerprint | null = null;
  private semanticAnalyzer: SemanticAnalyzer;
  private symbolGenerator: AdaptiveSymbolGenerator;

  constructor() {
    this.semanticAnalyzer = new SemanticAnalyzer();
    this.symbolGenerator = new AdaptiveSymbolGenerator();
  }

  analyzeSemanticFingerprint(textInput: string): SemanticFingerprint {
    this.fingerprint = this.semanticAnalyzer.analyzeSemanticFingerprint(textInput);
    return this.fingerprint;
  }

  generateAdaptiveSymbology(
    biometricState: BiometricState,
    dominantBand: string,
    time: number
  ): AdaptiveSymbol[] {
    return this.symbolGenerator.generateAdaptiveSymbology(biometricState, dominantBand, time);
  }

  getParadoxLoop(): string {
    return this.symbolGenerator.getParadoxLoop();
  }

  generateMirrorPrompt(userInput: string): string {
    if (!this.fingerprint) return userInput;
    
    const words = userInput.split(' ');
    const mirroredWords = words.map(word => {
      if (Math.random() < this.fingerprint!.temporalCoherence) {
        return word.split('').reverse().join('');
      }
      return word;
    });
    
    return mirroredWords.join(' ');
  }
}
