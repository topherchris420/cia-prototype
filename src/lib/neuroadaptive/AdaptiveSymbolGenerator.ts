
import { AdaptiveSymbol, SymbolLibrary } from './SymbolLibrary';
import { BiometricState } from './BiometricAnalyzer';

export class AdaptiveSymbolGenerator {
  private symbolLibrary: SymbolLibrary;

  constructor() {
    this.symbolLibrary = new SymbolLibrary();
  }

  generateAdaptiveSymbology(
    biometricState: BiometricState,
    dominantBand: string,
    time: number
  ): AdaptiveSymbol[] {
    const symbols: AdaptiveSymbol[] = [];
    const numSymbols = Math.floor(3 + biometricState.cognitiveLoad * 5);

    // Select archetypal category based on biometric state
    let category = 'consciousness';
    if (biometricState.emotionalValence < 0.3) category = 'dissolution';
    else if (biometricState.attentionLevel > 0.7) category = 'emergence';

    const baseSymbols = this.symbolLibrary.getSymbolSet(category);
    
    for (let i = 0; i < numSymbols; i++) {
      const baseSymbol = baseSymbols[i % baseSymbols.length];
      const personalizedSymbol = this.personalizeSymbol(baseSymbol, biometricState, time);
      symbols.push(personalizedSymbol);
    }

    // Inject entropy symbols for state transitions
    if (Math.random() < biometricState.voiceStress * 0.3) {
      symbols.push(this.generateEntropySymbol(time));
    }

    return symbols;
  }

  private personalizeSymbol(
    baseSymbol: AdaptiveSymbol,
    biometricState: BiometricState,
    time: number
  ): AdaptiveSymbol {
    const personalizedFrequency = baseSymbol.frequency * (1 + biometricState.cognitiveLoad * 0.5);
    const personalizedPhase = baseSymbol.phase + (time * 0.1 * biometricState.attentionLevel);
    const personalizedWeight = baseSymbol.semanticWeight * biometricState.emotionalValence;

    return {
      ...baseSymbol,
      frequency: personalizedFrequency,
      phase: personalizedPhase,
      semanticWeight: personalizedWeight
    };
  }

  private generateEntropySymbol(time: number): AdaptiveSymbol {
    const randomGlyph = this.symbolLibrary.getRandomAsemicGlyph();
    
    return {
      glyph: randomGlyph,
      frequency: Math.random() * 100,
      phase: Math.random() * Math.PI * 2,
      semanticWeight: 0.1 + Math.random() * 0.3,
      archetypalCode: 'entropy',
      coherenceLevel: Math.random() * 0.4
    };
  }

  getParadoxLoop(): string {
    return this.symbolLibrary.getParadoxLoop();
  }
}
