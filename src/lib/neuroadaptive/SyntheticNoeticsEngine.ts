
import { BiometricState } from './BiometricAnalyzer';

export interface SemanticFingerprint {
  linguisticPatterns: number[];
  conceptualDensity: number;
  metaphorFrequency: number;
  syntacticComplexity: number;
  temporalCoherence: number;
  archetypalResonance: Map<string, number>;
}

export interface AdaptiveSymbol {
  glyph: string;
  frequency: number;
  phase: number;
  semanticWeight: number;
  archetypalCode: string;
  coherenceLevel: number;
}

export class SyntheticNoeticsEngine {
  private fingerprint: SemanticFingerprint | null = null;
  private symbolLibrary: Map<string, AdaptiveSymbol[]> = new Map();
  private paradoxLoops: string[] = [];
  private asemicGlyphs: string[] = [];

  constructor() {
    this.initializeArchetypalLibrary();
    this.generateAsemicGlyphs();
    this.createParadoxLoops();
  }

  private initializeArchetypalLibrary(): void {
    const archetypalSets = {
      'consciousness': [
        { glyph: '◊', frequency: 7.83, phase: 0, semanticWeight: 0.9, archetypalCode: 'awareness', coherenceLevel: 0.8 },
        { glyph: '⧬', frequency: 40, phase: Math.PI/4, semanticWeight: 0.95, archetypalCode: 'integration', coherenceLevel: 0.9 },
        { glyph: '◈', frequency: 10.5, phase: Math.PI/2, semanticWeight: 0.7, archetypalCode: 'transition', coherenceLevel: 0.6 }
      ],
      'emergence': [
        { glyph: '⟐', frequency: 6.5, phase: 0, semanticWeight: 0.8, archetypalCode: 'genesis', coherenceLevel: 0.7 },
        { glyph: '◯', frequency: 14.2, phase: Math.PI/3, semanticWeight: 0.85, archetypalCode: 'unity', coherenceLevel: 0.85 },
        { glyph: '⬢', frequency: 21.3, phase: Math.PI, semanticWeight: 0.75, archetypalCode: 'structure', coherenceLevel: 0.6 }
      ],
      'dissolution': [
        { glyph: '⟡', frequency: 3.2, phase: Math.PI/6, semanticWeight: 0.9, archetypalCode: 'release', coherenceLevel: 0.4 },
        { glyph: '◌', frequency: 0.8, phase: Math.PI*1.5, semanticWeight: 0.95, archetypalCode: 'void', coherenceLevel: 0.2 },
        { glyph: '⬡', frequency: 32.1, phase: Math.PI/8, semanticWeight: 0.65, archetypalCode: 'chaos', coherenceLevel: 0.3 }
      ]
    };

    Object.entries(archetypalSets).forEach(([key, symbols]) => {
      this.symbolLibrary.set(key, symbols);
    });
  }

  private generateAsemicGlyphs(): void {
    this.asemicGlyphs = [
      '⧨', '⟐', '◈', '⬢', '⟡', '◌', '⬡', '⧬', '◊', '◯',
      '⟒', '⟓', '⟔', '⟕', '⟖', '⟗', '⟘', '⟙', '⟚', '⟛'
    ];
  }

  private createParadoxLoops(): void {
    this.paradoxLoops = [
      "The observer changes by observing the unchanging",
      "Consciousness awakens to its own sleeping",
      "The path dissolves as you walk it",
      "Knowing empties itself to become knowledge",
      "The center exists only at the periphery"
    ];
  }

  analyzeSemanticFingerprint(textInput: string): SemanticFingerprint {
    const words = textInput.toLowerCase().split(/\s+/);
    const sentences = textInput.split(/[.!?]+/).filter(s => s.trim());
    
    // Linguistic pattern analysis
    const patternFreqs = this.extractLinguisticPatterns(words);
    
    // Conceptual density calculation
    const conceptualDensity = this.calculateConceptualDensity(words);
    
    // Metaphor frequency detection
    const metaphorFrequency = this.detectMetaphorFrequency(textInput);
    
    // Syntactic complexity measurement
    const syntacticComplexity = this.calculateSyntacticComplexity(sentences);
    
    // Temporal coherence assessment
    const temporalCoherence = this.assessTemporalCoherence(sentences);
    
    // Archetypal resonance mapping
    const archetypalResonance = this.mapArchetypalResonance(words);
    
    this.fingerprint = {
      linguisticPatterns: patternFreqs,
      conceptualDensity,
      metaphorFrequency,
      syntacticComplexity,
      temporalCoherence,
      archetypalResonance
    };
    
    return this.fingerprint;
  }

  private extractLinguisticPatterns(words: string[]): number[] {
    const patterns = new Array(10).fill(0);
    words.forEach(word => {
      patterns[word.length % 10] += 1;
    });
    return patterns.map(p => p / words.length);
  }

  private calculateConceptualDensity(words: string[]): number {
    const abstractWords = words.filter(w => 
      ['consciousness', 'awareness', 'being', 'existence', 'reality', 'perception'].includes(w)
    );
    return abstractWords.length / Math.max(words.length, 1);
  }

  private detectMetaphorFrequency(text: string): number {
    const metaphorIndicators = ['like', 'as', 'resembles', 'flows', 'emerges', 'dissolves', 'transforms'];
    const matches = metaphorIndicators.filter(indicator => text.includes(indicator));
    return matches.length / text.split(' ').length;
  }

  private calculateSyntacticComplexity(sentences: string[]): number {
    if (sentences.length === 0) return 0;
    const avgLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
    return Math.min(avgLength / 20, 1);
  }

  private assessTemporalCoherence(sentences: string[]): number {
    const temporalWords = ['now', 'then', 'before', 'after', 'during', 'while', 'when'];
    const coherenceScore = sentences.reduce((score, sentence) => {
      const temporalCount = temporalWords.filter(word => sentence.toLowerCase().includes(word)).length;
      return score + (temporalCount / sentence.split(' ').length);
    }, 0);
    return coherenceScore / Math.max(sentences.length, 1);
  }

  private mapArchetypalResonance(words: string[]): Map<string, number> {
    const archetypalMap = new Map<string, number>();
    const archetypes = {
      'consciousness': ['aware', 'mind', 'thought', 'perception', 'experience'],
      'emergence': ['new', 'birth', 'creation', 'beginning', 'arise'],
      'dissolution': ['end', 'death', 'dissolve', 'fade', 'release']
    };

    Object.entries(archetypes).forEach(([archetype, keywords]) => {
      const matches = words.filter(word => keywords.some(keyword => word.includes(keyword))).length;
      archetypalMap.set(archetype, matches / Math.max(words.length, 1));
    });

    return archetypalMap;
  }

  generateAdaptiveSymbology(
    biometricState: BiometricState,
    dominantBand: string,
    time: number
  ): AdaptiveSymbol[] {
    if (!this.fingerprint) return [];

    const symbols: AdaptiveSymbol[] = [];
    const numSymbols = Math.floor(3 + biometricState.cognitiveLoad * 5);

    // Select archetypal category based on biometric state
    let category = 'consciousness';
    if (biometricState.emotionalValence < 0.3) category = 'dissolution';
    else if (biometricState.attentionLevel > 0.7) category = 'emergence';

    const baseSymbols = this.symbolLibrary.get(category) || [];
    
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
    const randomGlyph = this.asemicGlyphs[Math.floor(Math.random() * this.asemicGlyphs.length)];
    
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
    return this.paradoxLoops[Math.floor(Math.random() * this.paradoxLoops.length)];
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
