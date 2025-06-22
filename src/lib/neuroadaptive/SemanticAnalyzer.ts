
export interface SemanticFingerprint {
  linguisticPatterns: number[];
  conceptualDensity: number;
  metaphorFrequency: number;
  syntacticComplexity: number;
  temporalCoherence: number;
  archetypalResonance: Map<string, number>;
}

export class SemanticAnalyzer {
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
    
    return {
      linguisticPatterns: patternFreqs,
      conceptualDensity,
      metaphorFrequency,
      syntacticComplexity,
      temporalCoherence,
      archetypalResonance
    };
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
}
