
export interface AdaptiveSymbol {
  glyph: string;
  frequency: number;
  phase: number;
  semanticWeight: number;
  archetypalCode: string;
  coherenceLevel: number;
}

export class SymbolLibrary {
  private symbolLibrary: Map<string, AdaptiveSymbol[]> = new Map();
  private asemicGlyphs: string[] = [];
  private paradoxLoops: string[] = [];

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

  getSymbolSet(category: string): AdaptiveSymbol[] {
    return this.symbolLibrary.get(category) || [];
  }

  getRandomAsemicGlyph(): string {
    return this.asemicGlyphs[Math.floor(Math.random() * this.asemicGlyphs.length)];
  }

  getParadoxLoop(): string {
    return this.paradoxLoops[Math.floor(Math.random() * this.paradoxLoops.length)];
  }

  getAllCategories(): string[] {
    return Array.from(this.symbolLibrary.keys());
  }
}
