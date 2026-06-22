class AudioService {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  constructor() {
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
    } catch (e) {
      console.error("AudioContext not supported");
    }
  }

  private ensureContext() {
    if (this.context && this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  public playFlap() {
    this.ensureContext();
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.context.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.3, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }

  public playScore() {
    this.ensureContext();
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.context.currentTime);
    osc.frequency.setValueAtTime(1200, this.context.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.2, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.context.currentTime + 0.3);
  }

  public playCollision() {
    this.ensureContext();
    if (!this.context || !this.masterGain) return;

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.4, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.context.currentTime + 0.3);
  }
}

export const audioService = new AudioService();