// Procedural Audio Feedback Generator using Web Audio API

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  private init() {
    if (typeof window === "undefined" || this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.isInitialized = true;
      }
    } catch {
      // AudioContext not supported or disabled
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playHover() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // fail silently
    }
  }

  public playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // fail silently
    }
  }

  public playNodeSelect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // fail silently
    }
  }

  // ---------------------------------------------------------------------------
  // Fetch court sounds (footer playground)
  // ---------------------------------------------------------------------------

  private lastBounceAt = 0;
  private noise: AudioBuffer | null = null;

  /** Audio context ready to play, or null when muted / unsupported. */
  private ready(): AudioContext | null {
    if (this.isMuted) return null;
    this.init();
    if (!this.ctx) return null;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private noiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noise) {
      const length = Math.floor(ctx.sampleRate * 0.25);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
      this.noise = buffer;
    }
    return this.noise;
  }

  /** Soft felt thud; intensity 0..1 scales pitch and level. Rate-limited for rolling contacts. */
  public playBounce(intensity: number) {
    const k = Math.min(1, Math.max(0, intensity));
    if (k < 0.05) return;
    const ctx = this.ready();
    if (!ctx) return;
    const now = ctx.currentTime;
    if (now - this.lastBounceAt < 0.07) return;
    this.lastBounceAt = now;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(120 + 110 * k, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.09);
      gain.gain.setValueAtTime(0.012 + 0.05 * k, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);

      const tick = ctx.createBufferSource();
      tick.buffer = this.noiseBuffer(ctx);
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 1400;
      band.Q.value = 1.4;
      const tickGain = ctx.createGain();
      tickGain.gain.setValueAtTime(0.012 * k, now);
      tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      tick.connect(band);
      band.connect(tickGain);
      tickGain.connect(ctx.destination);
      tick.start(now);
      tick.stop(now + 0.04);
    } catch {
      // fail silently
    }
  }

  /** Short two-step "yip". */
  public playBark() {
    const ctx = this.ready();
    if (!ctx) return;
    const now = ctx.currentTime;

    try {
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1800;
      filter.connect(ctx.destination);

      [
        { at: 0, from: 560, to: 400, dur: 0.075 },
        { at: 0.1, from: 640, to: 450, dur: 0.065 },
      ].forEach(({ at, from, to, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(from, now + at);
        osc.frequency.exponentialRampToValueAtTime(to, now + at + dur);
        gain.gain.setValueAtTime(0.0001, now + at);
        gain.gain.exponentialRampToValueAtTime(0.025, now + at + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + at + dur);
        osc.connect(gain);
        gain.connect(filter);
        osc.start(now + at);
        osc.stop(now + at + dur + 0.02);
      });
    } catch {
      // fail silently
    }
  }

  /** Bright two-note chime for catches; `big` adds a third note (mid-air catches, milestones). */
  public playCatch(big = false) {
    const ctx = this.ready();
    if (!ctx) return;
    const now = ctx.currentTime;

    try {
      const notes = big ? [784, 1175, 1568] : [880, 1319];
      notes.forEach((freq, i) => {
        const at = now + i * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, at);
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.03, at + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(at);
        osc.stop(at + 0.3);
      });
    } catch {
      // fail silently
    }
  }

  /** Airy whoosh for throws; intensity 0..1. */
  public playThrow(intensity: number) {
    const k = Math.min(1, Math.max(0, intensity));
    const ctx = this.ready();
    if (!ctx) return;
    const now = ctx.currentTime;

    try {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer(ctx);
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.Q.value = 0.9;
      band.frequency.setValueAtTime(500, now);
      band.frequency.exponentialRampToValueAtTime(1600 + 1200 * k, now + 0.18);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.012 + 0.025 * k, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      src.connect(band);
      band.connect(gain);
      gain.connect(ctx.destination);
      src.start(now);
      src.stop(now + 0.24);
    } catch {
      // fail silently
    }
  }
}

export const soundManager = new SoundManager();
