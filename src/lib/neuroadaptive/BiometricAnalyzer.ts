
export interface BiometricState {
  heartRateVariability: number;
  breathingPattern: number;
  voiceStress: number;
  cognitiveLoad: number;
  attentionLevel: number;
  emotionalValence: number;
}

export interface NeuralFrequencyBand {
  delta: number; // 0.5-4 Hz
  theta: number; // 4-8 Hz
  alpha: number; // 8-13 Hz
  beta: number;  // 13-30 Hz
  gamma: number; // 30-100 Hz
}

export class BiometricAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyzer: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  
  async initialize(): Promise<void> {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
      audio: { 
        sampleRate: 44100, 
        channelCount: 1,
        echoCancellation: false,
        noiseSuppression: false
      } 
    });
    
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = 2048;
    this.analyzer.smoothingTimeConstant = 0.8;
    source.connect(this.analyzer);
  }

  analyzeVoiceResonance(audioData: Uint8Array): number {
    const nyquist = 22050;
    const binSize = nyquist / (audioData.length / 2);
    
    // Focus on fundamental frequency range (80-300 Hz)
    const fundamentalStart = Math.floor(80 / binSize);
    const fundamentalEnd = Math.floor(300 / binSize);
    
    let maxAmplitude = 0;
    let fundamentalFreq = 0;
    
    for (let i = fundamentalStart; i < fundamentalEnd; i++) {
      if (audioData[i] > maxAmplitude) {
        maxAmplitude = audioData[i];
        fundamentalFreq = i * binSize;
      }
    }
    
    return fundamentalFreq / 300; // Normalize
  }

  analyzeBreathingPattern(audioData: Uint8Array): number {
    // Analyze low-frequency variations (0.1-0.5 Hz breathing range)
    const breathingBins = audioData.slice(0, 10);
    const variance = this.calculateVariance(Array.from(breathingBins));
    return Math.min(variance / 100, 1);
  }

  analyzeSemanticStructure(text: string): BiometricState {
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    
    // Cognitive load indicators
    const complexWords = words.filter(w => w.length > 6).length;
    const cognitiveLoad = totalWords > 0 ? complexWords / totalWords : 0;
    
    // Emotional valence analysis
    const positiveWords = ['calm', 'peace', 'joy', 'love', 'light', 'clear', 'focused'];
    const negativeWords = ['stress', 'anxiety', 'dark', 'confused', 'tired', 'overwhelmed'];
    
    const positiveCount = words.filter(w => positiveWords.includes(w)).length;
    const negativeCount = words.filter(w => negativeWords.includes(w)).length;
    
    const emotionalValence = totalWords > 0 ? 
      (positiveCount - negativeCount) / totalWords + 0.5 : 0.5;
    
    // Attention level based on sentence structure
    const sentences = text.split(/[.!?]+/).length;
    const avgWordsPerSentence = sentences > 0 ? totalWords / sentences : 0;
    const attentionLevel = Math.min(avgWordsPerSentence / 15, 1);
    
    return {
      heartRateVariability: 0.5, // Placeholder for HRV sensor
      breathingPattern: 0.5,     // Will be updated with audio analysis
      voiceStress: 0.5,          // Will be updated with audio analysis
      cognitiveLoad,
      attentionLevel,
      emotionalValence
    };
  }

  private calculateVariance(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    return variance;
  }

  getCurrentAudioData(): Uint8Array | null {
    if (!this.analyzer) return null;
    
    const bufferLength = this.analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyzer.getByteFrequencyData(dataArray);
    return dataArray;
  }

  dispose(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
