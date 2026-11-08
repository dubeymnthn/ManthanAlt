import gsap from "gsap";
import confetti from "canvas-confetti";
import type { BubbleKind } from "./types";

/**
 * Court effects: pooled dust puffs and the call ping (GSAP), the speech bubble that follows the
 * dog's head, and canvas-confetti bursts confined to the court's own canvas.
 */

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

const CONFETTI_VARS = ["--pg-confetti-1", "--pg-confetti-2", "--pg-confetti-3", "--pg-confetti-4"];

export interface EffectsElements {
  dust: HTMLElement[];
  ping: HTMLElement;
  bubble: HTMLElement;
  bubbleInner: HTMLElement;
  bubbleText: HTMLElement;
  confettiCanvas: HTMLCanvasElement;
  /** Element whose computed custom properties provide the confetti palette. */
  themeSource: HTMLElement;
}

export class CourtEffects {
  private nextDust = 0;
  private bubbleVisible = false;
  private bubbleHideAt = 0;
  private bubbleTransform = "";
  private readonly fire: confetti.CreateTypes;
  private readonly probe: CanvasRenderingContext2D | null;
  private width = 1;
  private height = 1;
  private dpr = 1;

  constructor(private readonly el: EffectsElements) {
    gsap.set(el.dust, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(el.ping, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    gsap.set(el.bubbleInner, { xPercent: -50, autoAlpha: 0, scale: 0.4, transformOrigin: "50% 100%" });
    this.fire = confetti.create(el.confettiCanvas, {
      resize: false,
      useWorker: false,
      disableForReducedMotion: true,
    });
    this.probe = document.createElement("canvas").getContext("2d");
  }

  resize(width: number, height: number) {
    this.width = Math.max(1, width);
    this.height = Math.max(1, height);
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.el.confettiCanvas.width = Math.round(this.width * this.dpr);
    this.el.confettiCanvas.height = Math.round(this.height * this.dpr);
  }

  /** A few puffs of dust at a contact point; dir biases the drift (-1, 0, 1). */
  dust(x: number, y: number, dir: number, amount: number, scale: number) {
    const els = this.el.dust;
    if (els.length === 0) return;
    const count = amount > 0.65 ? 4 : amount > 0.3 ? 3 : 2;
    for (let i = 0; i < count; i++) {
      const el = els[this.nextDust];
      this.nextDust = (this.nextDust + 1) % els.length;
      const spread = (i - (count - 1) / 2) * 7 * scale;
      const drift = dir === 0 ? spread * 0.9 : dir * rand(8, 22) * scale;
      gsap.fromTo(
        el,
        { x: x + spread, y: y - 2 * scale, scale: 0.35 + amount * 0.25, autoAlpha: 0.65 },
        {
          x: x + spread + drift,
          y: y - rand(5, 13) * scale,
          scale: 1 + amount * 0.9,
          autoAlpha: 0,
          duration: rand(0.45, 0.7),
          ease: "power2.out",
          overwrite: true,
        }
      );
    }
  }

  /** Ripple where the visitor called the dog. */
  ping(x: number, y: number) {
    gsap.fromTo(
      this.el.ping,
      { x, y, scale: 0.25, autoAlpha: 0.9 },
      { scale: 1.7, autoAlpha: 0, duration: 0.65, ease: "power2.out", overwrite: true }
    );
  }

  showBubble(text: string, kind: BubbleKind, seconds: number, now: number) {
    const { bubble, bubbleInner, bubbleText } = this.el;
    bubbleText.textContent = text;
    bubble.dataset.kind = kind;
    this.bubbleHideAt = now + seconds * 1000;
    if (!this.bubbleVisible) {
      this.bubbleVisible = true;
      gsap.fromTo(
        bubbleInner,
        { autoAlpha: 0, scale: 0.35, y: 6 },
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.34, ease: "back.out(2.6)", overwrite: true }
      );
    } else {
      gsap.fromTo(bubbleInner, { scale: 0.82 }, { scale: 1, duration: 0.26, ease: "back.out(3)", overwrite: "auto" });
    }
  }

  hideBubble() {
    if (!this.bubbleVisible) return;
    this.bubbleVisible = false;
    gsap.to(this.el.bubbleInner, { autoAlpha: 0, scale: 0.6, y: 4, duration: 0.18, ease: "power2.in", overwrite: true });
  }

  /** Follow the dog's head; hides the bubble when its time is up. */
  updateBubble(x: number, y: number, now: number) {
    const t = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    if (t !== this.bubbleTransform) {
      this.bubbleTransform = t;
      this.el.bubble.style.transform = t;
    }
    if (this.bubbleVisible && now >= this.bubbleHideAt) this.hideBubble();
  }

  /** Read the accent palette from CSS custom properties so confetti follows the theme. */
  private colors(): string[] | undefined {
    const probe = this.probe;
    if (!probe) return undefined;
    const style = getComputedStyle(this.el.themeSource);
    const out: string[] = [];
    for (const name of CONFETTI_VARS) {
      const raw = style.getPropertyValue(name).trim();
      if (!raw) continue;
      probe.fillStyle = "#000000";
      probe.fillStyle = raw;
      const normalized = String(probe.fillStyle);
      if (normalized.startsWith("#")) out.push(normalized);
    }
    return out.length > 0 ? out : undefined;
  }

  confetti(x: number, y: number, big: boolean) {
    const d = this.dpr;
    void this.fire({
      particleCount: big ? 90 : 40,
      spread: big ? 110 : 72,
      angle: 90,
      startVelocity: (big ? 30 : 21) * d,
      gravity: 0.85 * d,
      decay: 0.9,
      ticks: big ? 170 : 120,
      scalar: 0.72 * d,
      drift: 0,
      origin: { x: x / this.width, y: y / this.height },
      colors: this.colors(),
      shapes: ["square", "circle"],
      disableForReducedMotion: true,
    });
  }

  destroy() {
    this.fire.reset();
    gsap.killTweensOf([...this.el.dust, this.el.ping, this.el.bubbleInner]);
  }
}
