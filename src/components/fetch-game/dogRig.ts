import gsap from "gsap";
import {
  ART,
  RAD2DEG,
  RIG_PARTS,
  clamp,
  composeDog,
  createPose,
  lerp,
  type RigFrame,
  type RigPart,
  type RigPose,
} from "./rigMath";
import type { DogMood, DogPoseName, DogRigApi } from "./types";

/**
 * The procedural rig that brings the SVG dog to life.
 *
 * GSAP tweens the discrete things (pose blends, blinks, barks, yawns, the facing flip, landing
 * squash) and smooths the head's look-at with gsap.quickTo; the per-frame update adds the
 * continuous layer (gait phase driven by real ground speed, breathing, wagging, panting) and
 * damped springs for secondary motion (ears, tail lag, collar tag). The result is composed by
 * rigMath into one matrix per SVG group and written only when it changes.
 */

export interface RigFrameInput {
  /** World position of the ground point under the torso centre (interpolated). */
  x: number;
  bottom: number;
  /** Dog velocity in px/step. */
  vx: number;
  vy: number;
  grounded: boolean;
  scale: number;
  /** Real frame time in seconds (clamped). */
  dt: number;
}

/** Damped harmonic oscillator integrated with small fixed substeps. */
class Spring {
  value = 0;
  velocity = 0;

  constructor(
    private readonly stiffness: number,
    private readonly damping: number
  ) {}

  step(target: number, dt: number, force = 0) {
    const n = Math.max(1, Math.ceil(dt / (1 / 120)));
    const h = dt / n;
    for (let i = 0; i < n; i++) {
      const a = -this.stiffness * (this.value - target) - this.damping * this.velocity + force;
      this.velocity += a * h;
      this.value += this.velocity * h;
    }
    return this.value;
  }

  kick(v: number) {
    this.velocity += v;
  }
}

const TAU = Math.PI * 2;

/** Exponential approach, frame-rate independent. */
const follow = (v: number, target: number, rate: number, dt: number) =>
  v + (target - v) * (1 - Math.exp(-rate * dt));

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

interface MoodSpec {
  tail: number;
  wagAmp: number;
  wagHz: number;
  ear: number;
  pant: boolean;
  head: number;
}

const MOODS: Record<DogMood, MoodSpec> = {
  calm: { tail: -6, wagAmp: 8, wagHz: 1.5, ear: 0, pant: false, head: 0 },
  happy: { tail: 6, wagAmp: 22, wagHz: 3.6, ear: -4, pant: true, head: -6 },
  excited: { tail: 16, wagAmp: 30, wagHz: 6, ear: -10, pant: true, head: -10 },
  run: { tail: -24, wagAmp: 7, wagHz: 2.4, ear: 0, pant: true, head: -2 },
  sleepy: { tail: -58, wagAmp: 2, wagHz: 0.4, ear: 14, pant: false, head: 6 },
  proud: { tail: 14, wagAmp: 20, wagHz: 3.2, ear: -6, pant: false, head: -10 },
};

type ExtraPart = "haunch" | "eyelid";

export class DogRig implements DogRigApi {
  readonly pose: RigPose;
  frame: RigFrame;

  private readonly els = new Map<RigPart | ExtraPart, SVGElement>();
  private readonly written = new Map<string, string>();

  // GSAP-tweened state objects (kept separate so overwrite never clobbers unrelated tweens).
  private readonly weights = { sit: 1, lie: 0, bow: 0, crouch: 0 };
  private readonly face = { blink: 0, jaw: 0, brow: 0, yawn: 0, sleep: 0 };
  private readonly fx = { rootSX: 1, rootSY: 1, bob: 0, dip: 0, shake: 0, anticip: 0 };
  private readonly turn = { progress: 1 };
  private readonly look = { angle: -6 };
  private readonly lookTo: gsap.QuickToFunc;
  private lookGoal = -6;

  private readonly ear = new Spring(160, 9);
  private readonly tail = new Spring(90, 11);
  private readonly tag = new Spring(220, 5);

  private mood: DogMood = "calm";
  private activity: "none" | "sniff" | "scratch" = "none";
  private sleeping = false;
  private holding = false;
  private facing: 1 | -1 = -1;
  private lookTarget: { x: number; y: number } | null = null;

  private time = 0;
  private nextBlinkAt = rand(1.5, 3.5);
  private gaitPhase = 0;
  private gaitWeight = 0;
  private gallop = 0;
  private airW = 0;
  private wagPhase = 0;
  private breathPhase = 0;
  private pantPhase = 0;
  private scratchPhase = 0;
  private sniffPhase = 0;
  private scratchW = 0;
  private sniffW = 0;
  private prevVx = 0;

  constructor(private readonly svg: SVGSVGElement) {
    for (const part of [...RIG_PARTS, "haunch", "eyelid"] as const) {
      const el = svg.querySelector<SVGElement>(`[data-part="${part}"]`);
      if (el) this.els.set(part, el);
    }
    this.pose = createPose({ facing: -1, sit: 1, tail: -42, headAngle: -6 });
    this.frame = composeDog(this.pose);
    this.lookTo = gsap.quickTo(this.look, "angle", { duration: 0.32, ease: "power3.out" });
  }

  // ---------------------------------------------------------------------------
  // DogRigApi (driven by the brain)
  // ---------------------------------------------------------------------------

  setPose(pose: DogPoseName, duration = 0.28) {
    const target = { sit: 0, lie: 0, bow: 0, crouch: 0 };
    if (pose !== "stand") target[pose] = 1;
    gsap.to(this.weights, {
      ...target,
      duration,
      ease: pose === "lie" ? "power2.inOut" : "back.out(1.5)",
      overwrite: true,
    });
  }

  setMood(mood: DogMood) {
    if (mood === this.mood) return;
    this.mood = mood;
    gsap.to(this.face, { brow: mood === "excited" || mood === "proud" ? 1 : 0, duration: 0.2, overwrite: "auto" });
  }

  setLook(target: { x: number; y: number } | null) {
    this.lookTarget = target;
  }

  snapLook(target: { x: number; y: number }) {
    const angle = this.lookAngleFor(target.x, target.y, this.lastX, this.lastBottom, this.lastScale);
    this.lookGoal = angle;
    this.lookTo(angle, angle);
    this.ear.kick(-260);
    this.tail.kick(320);
  }

  setDip(amount: number, duration = 0.2) {
    gsap.to(this.fx, { dip: amount, duration, ease: "power2.out", overwrite: "auto" });
  }

  setActivity(activity: "none" | "sniff" | "scratch") {
    this.activity = activity;
  }

  setSleeping(sleeping: boolean) {
    this.sleeping = sleeping;
    gsap.to(this.face, { sleep: sleeping ? 1 : 0, duration: sleeping ? 0.9 : 0.25, overwrite: "auto" });
  }

  setHolding(holding: boolean) {
    this.holding = holding;
  }

  turnTo(facing: 1 | -1) {
    if (facing === this.facing && this.turn.progress >= 1) return;
    this.facing = facing;
    gsap.fromTo(this.turn, { progress: 0 }, { progress: 1, duration: 0.16, ease: "power1.inOut", overwrite: true });
    this.ear.kick(220);
    this.tail.kick(-260);
  }

  bark() {
    gsap.fromTo(
      this.face,
      { jaw: 0 },
      { jaw: 17, duration: 0.07, ease: "power1.out", yoyo: true, repeat: 3, overwrite: "auto" }
    );
    this.ear.kick(-200);
  }

  yawn() {
    gsap.to(this.face, {
      keyframes: [
        { yawn: 1, jaw: 30, duration: 0.55, ease: "sine.inOut" },
        { yawn: 1, jaw: 30, duration: 0.35 },
        { yawn: 0, jaw: 0, duration: 0.45, ease: "sine.inOut" },
      ],
      overwrite: "auto",
    });
  }

  shake() {
    gsap.fromTo(this.fx, { shake: 0 }, { shake: 1, duration: 0.5, ease: "none", overwrite: "auto" });
    this.ear.kick(400);
    this.tag.kick(500);
  }

  land(impact: number) {
    const k = clamp(impact, 0, 1);
    gsap.fromTo(
      this.fx,
      { rootSY: 1 - 0.16 * k, rootSX: 1 + 0.1 * k, bob: 3 * k },
      { rootSY: 1, rootSX: 1, bob: 0, duration: 0.5, ease: "elastic.out(1, 0.45)", overwrite: "auto" }
    );
    this.ear.kick(260 * k);
    this.tag.kick(300 * k);
  }

  anticipate() {
    gsap.fromTo(
      this.fx,
      { anticip: 0.8, rootSY: 1.06 },
      { anticip: 0, rootSY: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" }
    );
  }

  // ---------------------------------------------------------------------------
  // Per-frame update
  // ---------------------------------------------------------------------------

  private lastX = 0;
  private lastBottom = 0;
  private lastScale = 1;

  private lookAngleFor(tx: number, ty: number, x: number, bottom: number, s: number) {
    const pivotX = x + this.frame.pivot.x * s;
    const pivotY = bottom + this.frame.pivot.y * s;
    const lx = (tx - pivotX) * this.facing;
    const ly = ty - pivotY;
    if (lx < 6 * s) return clamp(ly < 0 ? -40 : 30, -48, 52);
    return clamp(Math.atan2(ly, lx) * RAD2DEG, -48, 52);
  }

  update(input: RigFrameInput) {
    const dt = clamp(input.dt, 0, 0.05);
    const s = input.scale;
    const p = this.pose;
    const spec = MOODS[this.mood];
    this.time += dt;
    this.lastX = input.x;
    this.lastBottom = input.bottom;
    this.lastScale = s;

    // ---- Gait: phase advances with the real ground speed so paws stay planted.
    const speed = Math.abs(input.vx) / s;
    const grounded = input.grounded;
    this.gaitWeight = follow(this.gaitWeight, grounded ? clamp(speed / 1.2, 0, 1) : 0, 14, dt);
    this.gallop = follow(this.gallop, clamp((speed - 4.2) / 3.6, 0, 1), 6, dt);
    const duty = lerp(0.56, 0.38, this.gallop);
    const amp = lerp(9.5, 15, this.gallop);
    if (grounded) this.gaitPhase += (speed * 60 * dt) / ((2 * amp) / duty);
    p.gaitPhase = this.gaitPhase;
    p.gaitWeight = this.gaitWeight;
    p.gaitGallop = this.gallop;

    // ---- Air pose.
    this.airW = follow(this.airW, grounded ? 0 : 1, grounded ? 18 : 12, dt);
    p.airborne = this.airW;
    p.airRise = clamp(-input.vy / (6 * Math.sqrt(s)), -1, 1);

    // ---- Pose blends (GSAP) + anticipation crouch.
    const moving = this.gaitWeight > 0.5;
    p.sit = moving ? this.weights.sit * 0.2 : this.weights.sit;
    p.lie = this.weights.lie;
    p.bow = this.weights.bow;
    p.crouch = this.weights.crouch + this.fx.anticip;

    // ---- Breathing / panting.
    const pant = spec.pant && !this.holding && !this.sleeping && this.face.yawn < 0.05;
    const breathHz = this.sleeping ? 0.32 : pant ? 2.4 : 0.75;
    this.breathPhase += dt * breathHz * TAU;
    p.breath = Math.sin(this.breathPhase) * (this.sleeping ? 1.4 : 1);
    this.pantPhase += dt * 4.2 * TAU;
    const pantJaw = pant ? 4.5 + 2.2 * Math.sin(this.pantPhase) : 0;
    p.jaw = this.holding ? 10 : Math.max(this.face.jaw, pantJaw);
    p.tongue = this.holding || this.face.yawn > 0.3 ? 0 : pant ? 1 : 0;
    p.tongueWiggle = pant ? 7 * Math.sin(this.pantPhase * 2) : 0;

    // ---- Blinking, scheduled on the rig's own clock.
    if (this.time >= this.nextBlinkAt) {
      if (!this.sleeping) {
        gsap.fromTo(
          this.face,
          { blink: 0 },
          { blink: 1, duration: 0.06, ease: "power1.in", yoyo: true, repeat: Math.random() < 0.18 ? 3 : 1, overwrite: "auto" }
        );
      }
      this.nextBlinkAt = this.time + rand(2.2, 5.5);
    }
    p.blink = Math.max(this.face.blink, this.face.sleep, this.face.yawn * 0.85);
    p.brow = this.face.brow;

    // ---- Head: look-at (quickTo-smoothed) + sniff twitch + yawn.
    this.sniffW = follow(this.sniffW, this.activity === "sniff" ? 1 : 0, 8, dt);
    this.scratchW = follow(this.scratchW, this.activity === "scratch" ? 1 : 0, 10, dt);
    this.sniffPhase += dt * TAU * 9;
    const target = this.lookTarget;
    const lookAngle =
      target && !this.sleeping ? this.lookAngleFor(target.x, target.y, input.x, input.bottom, s) : spec.head;
    if (Math.abs(lookAngle - this.lookGoal) > 0.4) {
      this.lookGoal = lookAngle;
      this.lookTo(lookAngle);
    }
    p.headAngle =
      this.look.angle * (1 - this.sniffW * 0.6) +
      this.sniffW * 2.5 * Math.sin(this.sniffPhase) -
      18 * this.face.yawn +
      this.scratchW * 14;
    p.dip = Math.max(this.fx.dip, this.sniffW * 0.62);

    // ---- Secondary motion springs.
    const accel = (input.vx - this.prevVx) / Math.max(dt * 60, 0.25) / s;
    this.prevVx = input.vx;
    const along = accel * this.facing;

    const earTarget =
      clamp(speed * 5.5, 0, 55) + spec.ear + (this.sleeping ? 16 : 0) - p.headAngle * 0.45 + p.dip * 10;
    p.ear = clamp(this.ear.step(earTarget, dt, -along * 900 + this.airW * input.vy * 30), -35, 80);

    const sitTail = Math.max(p.sit, p.lie);
    this.wagPhase += dt * TAU * spec.wagHz * (moving ? 0.7 : 1);
    const wag = spec.wagAmp * (sitTail > 0.5 ? 0.85 : 1) * Math.sin(this.wagPhase);
    const tailBase = lerp(spec.tail, Math.min(spec.tail, -38), sitTail);
    p.tail = clamp(this.tail.step(tailBase + wag, dt, -along * 700), -80, 50);

    p.tag = clamp(this.tag.step(0, dt, -along * 1400), -45, 45);

    this.scratchPhase += dt * TAU * 9;
    p.scratch = this.scratchW;
    p.scratchOsc = Math.sin(this.scratchPhase);

    // ---- Facing flip (GSAP progress): never collapses to a sliver.
    const k = this.turn.progress;
    const mag = 0.2 + 0.8 * Math.abs(Math.cos(Math.PI * k));
    p.facing = (k < 0.5 ? -this.facing : this.facing) * (k >= 1 ? 1 : mag);
    p.rootSX = this.fx.rootSX;
    p.rootSY = this.fx.rootSY;
    p.bob = this.fx.bob;
    p.shake = this.fx.shake;

    this.render();
  }

  private render() {
    const frame = composeDog(this.pose);
    this.frame = frame;
    for (const part of RIG_PARTS) this.write(part, "transform", frame.transforms[part]);
    this.write("haunch", "opacity", frame.haunchOpacity.toFixed(2));
    this.write("eyelid", "opacity", frame.eyelidOpacity.toFixed(2));
    this.write("tongue", "opacity", String(frame.tongueOpacity));
  }

  private write(part: RigPart | ExtraPart, attr: string, value: string) {
    const key = part + attr;
    if (this.written.get(key) === value) return;
    this.written.set(key, value);
    this.els.get(part)?.setAttribute(attr, value);
  }

  /** World position of the mouth / held ball for the current frame. */
  holdWorld(x: number, bottom: number, s: number) {
    return { x: x + this.frame.hold.x * s, y: bottom + this.frame.hold.y * s };
  }

  headTopWorld(x: number, bottom: number, s: number) {
    return { x: x + this.frame.headTop.x * s, y: bottom + this.frame.headTop.y * s };
  }

  destroy() {
    gsap.killTweensOf([this.weights, this.face, this.fx, this.turn, this.look]);
    this.els.clear();
    this.written.clear();
  }
}

/** Art-space viewBox, shared with DogFigure so the live rig and SSR art line up. */
export const DOG_VIEWBOX = ART.viewBox;
