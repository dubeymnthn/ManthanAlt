import { BALL, DOG, G_STEP, STEP_S, TIMING } from "./constants";
import { createTrajectory, predictBall, type BallSnapshot, type PhysicsWorld } from "./physics";
import { clamp, RAD2DEG } from "./rigMath";
import type { BrainEvent, BrainInput, DogMood, DogPoseName, DogRigApi, StatusKey } from "./types";

/**
 * The dog's mind: a state machine advanced once per physics step and timed purely by simulation
 * time (no timers), so it pauses with the court and replays identically in a headless harness.
 *
 * idle ──grab──▶ excited ──throw──▶ chase ──catch / pickup──▶ return ──▶ drop ──▶ idle
 *   │                                 ▲                                    (GOOD DOG!)
 *   ├─ ignored 8s ─▶ nudge ───────────┘ (ball thrown at any point)
 *   ├─ ignored 25s (12s at night) ─▶ nap ──(ball moves / pointer near / click)──▶ wake
 *   ├─ click ground ─▶ come (trot there, sit)
 *   └─ ball resting on its back ─▶ shake
 */

export type DogMode =
  | "idle"
  | "excited"
  | "chase"
  | "pickup"
  | "return"
  | "drop"
  | "nudge"
  | "nap"
  | "wake"
  | "come"
  | "shake";

type IdleActivity = "none" | "sniff" | "look" | "scratch" | "stretch" | "wander" | "yawn";

const PREDICT_STEPS = 150;
const JUMP_LOOKAHEAD = 55;

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

/** Steps needed to cover dx from velocity v0 with accel/decel limits and a top speed. */
export function travelSteps(dx: number, v0: number, vmax: number, accel: number, decel: number) {
  const dist = Math.abs(dx);
  const dir = Math.sign(dx) || 1;
  let v = Math.min(v0 * dir, vmax);
  let steps = 0;
  let extra = 0;
  if (v < 0) {
    steps += -v / decel;
    extra = (v * v) / (2 * decel);
    v = 0;
  }
  const total = dist + extra;
  const tAcc = (vmax - v) / accel;
  const dAcc = ((v + vmax) / 2) * tAcc;
  if (dAcc >= total) steps += (-v + Math.sqrt(v * v + 2 * accel * total)) / accel;
  else steps += tAcc + (total - dAcc) / vmax;
  return steps;
}

export class DogBrain {
  mode: DogMode = "idle";
  /** Fetches completed while the ball was caught in the air, in a row. */
  streak = 0;

  private modeAt = 0;
  private lastEventAt = 0;
  private statusKey: StatusKey | null = null;
  private statusHoldUntil = -1;
  private pose: DogPoseName = "sit";
  private moodName: DogMood = "calm";

  private activity: IdleActivity = "none";
  private lastActivity: IdleActivity = "none";
  private activityAt = 0;
  private activityUntil = 0;
  private nextActivityAt = rand(5, 8);

  private lastFlipAt = -1;
  private behindSince = -1;
  private stillSince = 0;
  private onDogSince = -1;

  private ballInPlay = false;
  private caughtMidAir = false;
  private planX: number | null = null;
  private lastPlanAt = -1;
  private sideOverride: 1 | -1 | 0 = 0;
  private noProgressSince = -1;
  private stuckStage = 0;
  private lastJumpAt = -10;
  private hopAt = 0;

  private nudgeCount = 0;
  private nudgePhase: "approach" | "push" | "after" = "approach";
  private nudgeDir: 1 | -1 = 1;
  private nudgeAt = 0;
  private hopOverAt = -10;
  private comeX = 0;
  private shakeCount = 0;
  private lastShakeAt = -10;
  private dropped = false;
  private celebrated = false;
  private lastZzzAt = -10;

  private readonly lookPt = { x: 0, y: 0 };
  private lookOn = false;
  /** Facing a mode wants while not travelling (reset every step). */
  private faceHint: 1 | -1 | 0 = 0;
  /** Side the dog approaches the drop spot from, decided once per return. */
  private returnSide: 1 | -1 = -1;
  private readonly traj = createTrajectory(PREDICT_STEPS);

  constructor(
    private readonly world: PhysicsWorld,
    private readonly rig: DogRigApi,
    private readonly emit: (event: BrainEvent) => void,
    private readonly input: BrainInput
  ) {}

  private get t() {
    return this.world.time;
  }

  // ---------------------------------------------------------------------------
  // Small helpers
  // ---------------------------------------------------------------------------

  private status(key: StatusKey, holdSeconds = 0) {
    const t = this.t;
    if (holdSeconds === 0 && t < this.statusHoldUntil) return;
    if (holdSeconds > 0) this.statusHoldUntil = t + holdSeconds;
    if (key === this.statusKey) return;
    this.statusKey = key;
    this.emit({ type: "status", status: key });
  }

  private setPose(pose: DogPoseName, duration?: number) {
    if (pose === this.pose) return;
    this.pose = pose;
    this.rig.setPose(pose, duration);
  }

  private setMood(mood: DogMood) {
    if (mood === this.moodName) return;
    this.moodName = mood;
    this.rig.setMood(mood);
  }

  private lookAt(x: number, y: number) {
    this.lookPt.x = x;
    this.lookPt.y = y;
    this.lookOn = true;
  }

  private bubble(text: string, kind: "bark" | "praise" | "zzz" | "love" | "query", seconds: number) {
    this.emit({ type: "bubble", text, kind, seconds });
  }

  private face(dir: 1 | -1) {
    if (dir === this.world.facing) return;
    this.world.facing = dir;
    this.lastFlipAt = this.t;
    this.behindSince = -1;
    this.rig.turnTo(dir);
  }

  private idleFor() {
    return this.t - Math.max(this.input.interactionAt, this.lastEventAt);
  }

  private pointerActive() {
    return this.t - this.input.pointerAt < TIMING.pointerActive;
  }

  /**
   * Where the dog returns the ball: always returns to its home position on the right side.
   * Clamped so a ball dropped there (and the dog delivering it) stays inside the court.
   */
  private playerSpot() {
    const w = this.world;
    const s = w.scale;
    const homeSpot = w.homeX - 44 * s;
    const margin = w.ballRadius + 6 * s;
    return clamp(homeSpot, margin, w.bounds.width - margin);
  }

  /** Torso x that puts the mouth (and a held ball) at `spotX` when facing `dir`. */
  private deliveryX(spotX: number, dir: 1 | -1) {
    const w = this.world;
    const s = w.scale;
    const hold = DOG.holdX * s;
    const r = w.ballRadius + 2 * s;
    const lo = dir === 1 ? r - hold : r + hold;
    const hi = dir === 1 ? w.bounds.width - r - hold : w.bounds.width - r + hold;
    return w.clampDogX(clamp(spotX - dir * hold, Math.min(lo, hi), Math.max(lo, hi)));
  }

  /** Smoothly chooses a gait speed and pose based on remaining horizontal distance. */
  private driveTowards(targetX: number, urgency: "casual" | "eager" | "sprint" = "eager") {
    const w = this.world;
    const s = w.scale;
    const clampedTarget = w.clampDogX(targetX);
    const dist = Math.abs(clampedTarget - w.dog.position.x);

    if (dist < 8 * s) {
      w.motor.targetX = null;
      return false;
    }

    w.motor.targetX = clampedTarget;

    if (urgency === "sprint") {
      this.setPose("stand", 0.14);
      // Smoothly ramp down from full sprint to trot as the dog nears its target spot
      const blend = clamp((dist - 18 * s) / (95 * s), 0, 1);
      w.motor.speed = (DOG.trotSpeed + (DOG.runSpeed - DOG.trotSpeed) * blend) * s;
      this.setMood(blend > 0.35 ? "run" : "excited");
    } else if (urgency === "eager") {
      this.setPose("stand", 0.16);
      if (dist > 140 * s) {
        w.motor.speed = DOG.runSpeed * 0.9 * s;
        this.setMood("run");
      } else if (dist > 45 * s) {
        w.motor.speed = DOG.trotSpeed * s;
        this.setMood("excited");
      } else {
        w.motor.speed = DOG.walkSpeed * 1.25 * s;
        this.setMood("happy");
      }
    } else {
      this.setPose("stand", 0.2);
      w.motor.speed = (dist > 90 * s ? DOG.trotSpeed : DOG.walkSpeed) * s;
    }
    return true;
  }

  private setMode(mode: DogMode) {
    const prev = this.mode;
    this.mode = mode;
    this.modeAt = this.t;
    this.world.motor.jump = 0;
    if (prev === "idle" && this.activity !== "none") this.endActivity();
    if (prev === "nap" && mode !== "nap") this.rig.setSleeping(false);

    const w = this.world;
    switch (mode) {
      case "idle":
        w.motor.targetX = null;
        this.setMood(this.moodName === "run" || this.moodName === "excited" ? "happy" : this.moodName);
        this.stillSince = this.t;
        this.status("ready");
        break;
      case "excited":
        w.motor.targetX = null;
        w.dip = 0;
        this.rig.setDip(0);
        this.setPose("bow", 0.2);
        this.setMood("excited");
        this.bubble("!", "bark", 0.9);
        this.rig.bark();
        this.emit({ type: "sound", sound: "bark" });
        this.status("excited");
        this.hopAt = this.t + rand(0.45, 0.9);
        break;
      case "chase":
        this.setPose("stand", 0.15);
        this.setMood("run");
        this.rig.setDip(0);
        w.dip = 0;
        this.planX = null;
        this.lastPlanAt = -1;
        this.sideOverride = 0;
        this.noProgressSince = -1;
        this.stuckStage = 0;
        this.bubble("BUCKY IS ON IT!", "bark", 1.4);
        this.status("chase");
        break;
      case "pickup":
        w.motor.targetX = null;
        this.rig.setDip(1, TIMING.pickupDip);
        break;
      case "return": {
        this.setPose("stand");
        this.setMood("proud");
        this.status("return");
        this.returnSide = -1;
        break;
      }
      case "drop":
        w.motor.targetX = null;
        this.dropped = false;
        this.celebrated = false;
        this.rig.setDip(0.55, TIMING.dropDelay);
        break;
      case "nudge":
        this.enterNudge();
        break;
      case "nap":
        w.motor.targetX = null;
        this.setPose("lie", 0.6);
        this.setMood("sleepy");
        this.rig.setSleeping(true);
        this.status("nap");
        this.bubble("z Z z", "zzz", 4);
        this.lastZzzAt = this.t;
        this.emit({ type: "napped" });
        break;
      case "wake":
        w.motor.targetX = null;
        this.rig.setSleeping(false);
        this.rig.yawn();
        this.setPose("sit", 0.4);
        this.setMood("calm");
        this.emit({ type: "clearBubble" });
        this.emit({ type: "woke" });
        this.status("wake");
        this.lastEventAt = this.t;
        break;
      case "come":
        this.setPose("stand", 0.18);
        this.setMood("happy");
        this.status("come");
        break;
      case "shake":
        this.shakeCount = 0;
        this.doShake();
        this.status("shake");
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Per-step update
  // ---------------------------------------------------------------------------

  step() {
    this.lookOn = false;
    this.faceHint = 0;
    switch (this.mode) {
      case "idle":
        this.tickIdle();
        break;
      case "excited":
        this.tickExcited();
        break;
      case "chase":
        this.tickChase();
        break;
      case "pickup":
        this.tickPickup();
        break;
      case "return":
        this.tickReturn();
        break;
      case "drop":
        this.tickDrop();
        break;
      case "nudge":
        this.tickNudge();
        break;
      case "nap":
        this.tickNap();
        break;
      case "wake":
        this.tickWake();
        break;
      case "come":
        this.tickCome();
        break;
      case "shake":
        this.tickShake();
        break;
    }

    // Dip relaxes back up unless a mode is driving it.
    if (this.mode !== "pickup" && this.mode !== "drop" && this.mode !== "nudge" && this.mode !== "chase") {
      this.world.dip = Math.max(0, this.world.dip - STEP_S / 0.25);
    }

    this.updateFacing();
    this.rig.setLook(this.lookOn ? this.lookPt : null);
    const m = this.mode;
    this.world.setHeadSolid(m !== "chase" && m !== "pickup" && m !== "return" && m !== "drop" && m !== "excited");
  }

  /** Catch checks run after the physics step so they see the ball's newest position. */
  postStep() {
    if (this.mode === "chase" || this.mode === "excited") this.tryCatch();
  }

  private updateFacing() {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    if (!w.dogGrounded) return;
    if (this.mode === "nap" || this.mode === "drop" || this.mode === "pickup") return;
    if (this.mode === "nudge" && this.nudgePhase === "push") return;
    const vx = w.dog.velocity.x;
    const target = w.motor.targetX;
    // Short shuffles (backing up, settling on a spot) keep the current facing: no flip-flopping.
    const travelling = target !== null && Math.abs(target - w.dog.position.x) > 28 * s;
    let want: 1 | -1 = w.facing;
    if (Math.abs(vx) > 0.9 * s && travelling) {
      want = vx > 0 ? 1 : -1;
      this.behindSince = -1;
    } else if (this.faceHint !== 0) {
      want = this.faceHint;
      this.behindSince = -1;
    } else if (this.lookOn) {
      const rel = (this.lookPt.x - w.dog.position.x) * w.facing;
      if (rel < -14 * s) {
        if (this.behindSince < 0) this.behindSince = t;
        if (t - this.behindSince > 0.16) want = w.facing === 1 ? -1 : 1;
      } else {
        this.behindSince = -1;
      }
    }
    if (want !== w.facing && t - this.lastFlipAt > TIMING.flipCooldown) this.face(want);
  }

  // ---------------------------------------------------------------------------
  // idle
  // ---------------------------------------------------------------------------

  private tickIdle() {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    const inp = this.input;
    const ball = w.ballSnapshot();

    // If the ball is moving noticeably or in the air while loose, automatically go fetch it!
    if (!inp.grabbed && !w.held && (this.ballInPlay || !ball.onGround || ball.speed > 1.8 * s)) {
      this.ballInPlay = true;
      this.setMode("chase");
      return;
    }
    if (this.checkBallOnBack()) return;

    if (this.activity !== "none") {
      this.tickActivity(ball);
      if (t >= this.activityUntil) this.endActivity();
      return;
    }

    w.motor.targetX = null;
    if (this.pointerActive()) this.lookAt(inp.pointerX, inp.pointerY);
    else if (!w.held) this.lookAt(ball.x, ball.y);

    if (Math.abs(w.dog.velocity.x) > 0.3 * s) {
      this.stillSince = t;
    }
    if (this.pose !== "sit" && this.pose !== "lie" && t - this.stillSince > TIMING.sitAfter) {
      this.setPose("sit");
    }
    this.status("ready");

    const idle = this.idleFor();
    const napAfter = inp.night ? TIMING.napAfterNight : TIMING.napAfterDay;
    if (idle > napAfter && !this.pointerActive() && !inp.grabbed) {
      this.setMode("nap");
      return;
    }
    if (
      this.nudgeCount < 2 &&
      idle > TIMING.nudgeAfter * (this.nudgeCount + 1) &&
      ball.onGround &&
      ball.speed < 0.6 * s &&
      !w.held
    ) {
      this.setMode("nudge");
      return;
    }
    if (t >= this.nextActivityAt) this.startActivity();
  }

  private startActivity() {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    const night = this.input.night;
    const options: Array<[IdleActivity, number]> = [
      ["sniff", 3],
      ["look", 2.2],
      ["scratch", 1.4],
      ["stretch", 1.4],
      ["wander", 2],
      ["yawn", night ? 3.2 : 0.7],
    ];
    const pool = options.filter(([a]) => a !== this.lastActivity);
    let total = 0;
    for (const [, weight] of pool) total += weight;
    let pick = Math.random() * total;
    let activity: IdleActivity = pool[0][0];
    for (const [a, weight] of pool) {
      pick -= weight;
      if (pick <= 0) {
        activity = a;
        break;
      }
    }

    this.activity = activity;
    this.lastActivity = activity;
    this.activityAt = t;
    let duration = 2;
    switch (activity) {
      case "sniff": {
        duration = rand(2.2, 3.2);
        this.setPose("stand", 0.2);
        this.rig.setActivity("sniff");
        const dir = Math.random() < 0.5 ? w.facing : -w.facing;
        w.motor.targetX = w.clampDogX(w.dog.position.x + dir * rand(24, 56) * s);
        w.motor.speed = DOG.walkSpeed * 0.55 * s;
        this.status("sniff");
        break;
      }
      case "look":
        duration = 2.4;
        this.status("look");
        break;
      case "scratch":
        duration = 1.5;
        this.setPose("sit", 0.2);
        this.rig.setActivity("scratch");
        this.status("scratch");
        break;
      case "stretch":
        duration = 1.4;
        this.setPose("bow", 0.35);
        this.status("stretch");
        break;
      case "wander": {
        duration = 4;
        this.setPose("stand", 0.2);
        const dir = Math.random() < 0.5 ? 1 : -1;
        const target = w.clampDogX(w.dog.position.x + dir * rand(60, 150) * s);
        w.motor.targetX = target;
        w.motor.speed = DOG.walkSpeed * s;
        this.status("wander");
        break;
      }
      case "yawn":
        duration = 1.5;
        this.setPose("sit", 0.3);
        this.rig.yawn();
        this.status("yawn");
        break;
    }
    this.activityUntil = t + duration;
    this.nextActivityAt = this.activityUntil + rand(4, 9);
  }

  private tickActivity(ball: BallSnapshot) {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    const k = t - this.activityAt;
    switch (this.activity) {
      case "sniff":
        this.lookAt(w.dog.position.x + w.facing * 60 * s, w.bounds.groundY);
        if (w.arrived && k > 0.8) w.motor.targetX = null;
        break;
      case "look": {
        const head = w.headPivot();
        if (k < 0.8) this.lookAt(head.x + w.facing * 60 * s, head.y - 70 * s);
        else if (k < 1.6) this.lookAt(head.x - w.facing * 80 * s, head.y - 20 * s);
        else this.lookAt(ball.x, ball.y);
        break;
      }
      case "wander":
        this.lookAt(w.dog.position.x + w.facing * 80 * s, w.dog.position.y - 10 * s);
        if (w.arrived && k > 0.4) this.activityUntil = Math.min(this.activityUntil, t + 0.2);
        break;
      default:
        if (!w.held) this.lookAt(ball.x, ball.y);
        break;
    }
  }

  private endActivity() {
    const w = this.world;
    const a = this.activity;
    this.activity = "none";
    this.rig.setActivity("none");
    w.motor.targetX = null;
    if (a === "stretch" || a === "sniff" || a === "wander") this.setPose("stand", 0.25);
    this.stillSince = this.t;
  }

  private checkBallOnBack(): boolean {
    if (this.world.ballOnDog()) {
      if (this.onDogSince < 0) this.onDogSince = this.t;
      if (this.t - this.onDogSince > 0.35) {
        this.onDogSince = -1;
        this.setMode("shake");
        return true;
      }
    } else {
      this.onDogSince = -1;
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // excited (visitor holds / drags the ball anywhere on screen)
  // ---------------------------------------------------------------------------

  private tickExcited() {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    const ball = w.ballSnapshot();

    if (!this.input.grabbed) {
      this.ballInPlay = true;
      this.setMode("chase");
      return;
    }

    this.lookAt(ball.x, ball.y);

    // Follow the ball horizontally across the bottom of the screen so the dog stays
    // positioned right underneath / slightly offset in a natural play stance.
    const dogX = w.dog.position.x;
    const stance = this.stanceOffset(ball.height);
    const side = this.approachSide(ball.x, dogX, stance);
    const desiredX = w.clampDogX(ball.x - side * stance);
    const distToSpot = Math.abs(desiredX - dogX);

    if (distToSpot > 14 * s) {
      this.driveTowards(desiredX, "eager");
    } else {
      w.motor.targetX = null;
      this.faceHint = ball.x >= dogX ? 1 : -1;

      // When settled underneath the held ball, do a playful bow or sit
      if (w.dogGrounded && Math.abs(w.dog.velocity.x) < 0.6 * s) {
        if (t - this.modeAt > 8) {
          this.setPose("sit", 0.25);
          this.setMood("happy");
        } else {
          this.setPose("bow", 0.22);
          this.setMood("excited");
        }
      }
    }

    // If the visitor dangles the ball within jumping reach above the dog, try to leap and snatch it!
    if (w.dogGrounded && distToSpot < 42 * s && ball.height > 28 * s && ball.height < 145 * s) {
      this.considerJump(ball);
    } else if (
      t >= this.hopAt &&
      w.dogGrounded &&
      distToSpot < 28 * s &&
      Math.abs(w.dog.velocity.x) < 1.2 * s
    ) {
      w.motor.jump = DOG.hopSpeed * Math.sqrt(s);
      this.rig.anticipate();
      this.hopAt = t + rand(0.65, 1.3);
    }
  }

  // ---------------------------------------------------------------------------
  // chase
  // ---------------------------------------------------------------------------

  private stanceOffset(height: number) {
    const s = this.world.scale;
    return height > 45 * s ? (DOG.pivotX + 10) * s : (DOG.pivotX + 24) * s;
  }

  private plan() {
    const w = this.world;
    const s = w.scale;
    const traj = this.traj;
    this.lastPlanAt = this.t;
    predictBall(w, traj, PREDICT_STEPS);

    const rest = w.bounds.groundY - w.ballRadius;
    const dogX = w.dog.position.x;
    const vx = w.dog.velocity.x;
    const vmax = DOG.runSpeed * s;
    const reach = 142 * s;
    let chosen: number | null = null;

    for (let k = 1; k < traj.length; k += 2) {
      const bx = traj.x[k];
      const h = rest - traj.y[k];
      if (h > reach) continue;
      const stance = this.stanceOffset(h);
      const side = this.approachSide(bx, dogX, stance);
      const tx = w.clampDogX(bx - side * stance);
      const need = travelSteps(tx - dogX, vx, vmax, DOG.accel * s, DOG.decel * s) + 2;
      if (need <= k) {
        chosen = tx;
        break;
      }
    }
    if (chosen === null) {
      // Ball is high up or fast: immediately track the horizontal position underneath the trajectory
      const last = traj.length - 1;
      const bx = traj.x[last];
      const stance = this.stanceOffset(0);
      chosen = w.clampDogX(bx - this.approachSide(bx, dogX, stance) * stance);
    }
    // Responsive smoothing: reacts briskly to large trajectory changes, smooths tiny micro-jitter
    const alpha = this.planX === null || Math.abs(chosen - this.planX) > 45 * s ? 0.8 : 0.55;
    this.planX = this.planX === null ? chosen : this.planX + (chosen - this.planX) * alpha;
  }

  private approachSide(bx: number, dogX: number, stance: number): 1 | -1 {
    if (this.sideOverride !== 0) return this.sideOverride;
    const w = this.world;
    const r = w.ballRadius;
    // Against a wall there is only one side to stand on.
    if (bx - stance < w.dogHalfW + r) return -1;
    if (bx + stance > w.bounds.width - w.dogHalfW - r) return 1;
    if (Math.abs(bx - dogX) < stance * 0.85) return w.facing;
    return bx >= dogX ? 1 : -1;
  }

  /** Is (bx, by) inside the snap zone in front of the head? */
  catchTest(bx: number, by: number, dogX: number, dogBottom: number, facing: number, dip: number) {
    const w = this.world;
    const s = w.scale;
    const px = dogX + facing * DOG.pivotX * s;
    const py = dogBottom + DOG.pivotY * s + dip * 11 * s;
    const lx = (bx - px) * facing;
    const ly = by - py;
    const d = Math.hypot(lx, ly);
    if (d < 4 * s || d > DOG.mouthDist * s + w.ballRadius + 11 * s) return false;
    if (lx < -10 * s) return false;
    const angle = Math.atan2(ly, lx) * RAD2DEG;
    return angle > -92 && angle < 72;
  }

  private inReach(bx: number, by: number, dip: number) {
    const w = this.world;
    return this.catchTest(bx, by, w.dog.position.x, w.dogBottom, w.facing, dip);
  }

  private tickChase() {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    const ball = w.ballSnapshot();

    if (w.held) {
      this.setMode("return");
      return;
    }
    if (this.input.grabbed) {
      this.setMode("excited");
      return;
    }
    if (this.checkBallOnBack()) return;

    this.lookAt(ball.x, ball.y);
    if (this.planX === null || t - this.lastPlanAt >= 2 * STEP_S - 1e-6) this.plan();

    if (this.planX !== null) {
      const moving = this.driveTowards(this.planX, "sprint");
      if (!moving) {
        this.faceHint = ball.x >= w.dog.position.x ? 1 : -1;
      }
    }

    // Natural head-lowering anticipation when closing in on a low/rolling ball
    const distToBallX = Math.abs(ball.x - w.dog.position.x);
    if (w.dogGrounded && ball.height < 28 * s && distToBallX < 85 * s) {
      const targetDip = clamp(1 - distToBallX / (85 * s), 0, 0.75);
      w.dip += (targetDip - w.dip) * 0.25;
      this.rig.setDip(w.dip);
    } else {
      w.dip = Math.max(0, w.dip - STEP_S / 0.25);
      this.rig.setDip(w.dip);
    }

    if (w.dogGrounded && !ball.onGround) this.considerJump(ball);

    // Ground/low ball within reach: dip and pick it up cleanly.
    if (
      w.dogGrounded &&
      ball.height < w.ballRadius * 0.85 &&
      ball.speed < 5.5 * s &&
      (this.inReach(ball.x, ball.y, 1) ||
        Math.hypot(w.holdPoint().x - ball.x, w.holdPoint().y - ball.y) < 26 * s)
    ) {
      this.setMode("pickup");
      return;
    }

    // Stuck: standing at the plan, ball resting, still out of reach.
    const resting = ball.onGround && ball.speed < 0.6 * s;
    if (resting && w.arrived && w.dogGrounded) {
      if (this.noProgressSince < 0) this.noProgressSince = t;
      const stuck = t - this.noProgressSince;
      if (stuck > 0.7 && this.stuckStage === 0) {
        this.stuckStage = 1;
        this.sideOverride =
          this.approachSide(ball.x, w.dog.position.x, this.stanceOffset(0)) === 1 ? -1 : 1;
        this.planX = null;
      } else if (stuck > 1.8 && this.stuckStage === 1) {
        this.stuckStage = 2;
        const dir = ball.x < w.bounds.width / 2 ? 1 : -1;
        w.setBallVelocity(dir * 3 * s, -4.5 * Math.sqrt(s));
        this.sideOverride = 0;
        this.planX = null;
      } else if (stuck > 3.5) {
        this.resetBall();
        return;
      }
    } else if (!resting) {
      this.noProgressSince = -1;
    }

    if (t - this.modeAt > TIMING.chaseTimeout) this.resetBall();
  }

  private considerJump(ball: BallSnapshot) {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    if (t - this.lastJumpAt < 0.4) return;
    if (ball.height < 32 * s) return;
    if (Math.abs(ball.x - w.dog.position.x) > 240 * s) return;
    const root = Math.sqrt(s);
    for (const base of DOG.jumpSpeeds) {
      const v = base * root;
      const hit = this.simulateJump(v);
      if (hit < 0) continue;
      const apex = v / G_STEP;
      if (hit >= apex * 0.45 || hit <= 6) {
        // Real dogs mistime sometimes; it keeps mid-air catches worth celebrating.
        const jump = Math.random() < 0.08 ? v * rand(0.85, 0.94) : v;
        w.motor.jump = jump;
        this.lastJumpAt = t;
        this.rig.anticipate();
      }
      return;
    }
  }

  /** Simulate jumping now; returns the step of the first catch, or -1. */
  private simulateJump(v: number) {
    const w = this.world;
    const rest = w.bounds.groundY - w.ballRadius;
    const drag = 1 - BALL.frictionAir;
    const heldByUser = this.input.grabbed;
    let bx = w.ball.position.x;
    let by = w.ball.position.y;
    let bvx = heldByUser ? 0 : w.ball.velocity.x;
    let bvy = heldByUser ? 0 : w.ball.velocity.y;
    let dx = w.dog.position.x;
    let bottom = w.dogBottom;
    const dvx = w.dog.velocity.x;
    let dvy = -v;
    const facing = bx >= dx ? 1 : -1;
    for (let k = 1; k <= JUMP_LOOKAHEAD; k++) {
      if (!heldByUser) {
        bvx *= drag;
        bvy = bvy * drag + G_STEP;
        bx += bvx;
        by += bvy;
        if (by > rest) {
          by = rest;
          bvy = -Math.abs(bvy) * 0.58;
        }
      }
      dvy += G_STEP;
      dx += dvx;
      bottom += dvy;
      if (k > 2 && bottom >= w.bounds.groundY) return -1;
      if (this.catchTest(bx, by, dx, bottom, facing, 0)) return k;
    }
    return -1;
  }

  private tryCatch() {
    const w = this.world;
    if (w.held) return;
    // Allow snatching the ball if the dog jumped for it or if it's loose in chase mode
    if (this.input.grabbed && w.dogGrounded) return;
    const r = w.ballRadius;
    const x1 = w.ball.position.x;
    const y1 = w.ball.position.y;
    if (!this.input.grabbed && w.bounds.groundY - r - y1 < r * 0.6) return; // ground balls are picked up instead
    const x0 = w.prev.bx;
    const y0 = w.prev.by;
    const dogX = w.dog.position.x;
    const bottom = w.dogBottom;
    for (let i = 1; i <= 4; i++) {
      const f = i / 4;
      const bx = x0 + (x1 - x0) * f;
      const by = y0 + (y1 - y0) * f;
      if (this.catchTest(bx, by, dogX, bottom, w.facing, w.dip)) {
        this.catchBall(bx, by);
        return;
      }
    }
  }

  private catchBall(bx: number, by: number) {
    const w = this.world;
    const s = w.scale;
    const height = w.bounds.groundY - w.ballRadius - by;
    const midAir = !w.dogGrounded || height > 44 * s;
    w.hold();
    this.caughtMidAir = midAir;
    this.rig.snapLook({ x: bx, y: by });
    this.rig.setHolding(true);
    if (midAir) this.streak += 1;
    else this.streak = 0;
    this.emit({ type: "caught", midAir, x: bx, y: by });
    this.emit({ type: "sound", sound: "catch" });
    this.status(midAir ? "midair" : "gotit", midAir ? 1.3 : 0.7);
    this.setMode("return");
  }

  // ---------------------------------------------------------------------------
  // pickup / return / drop
  // ---------------------------------------------------------------------------

  private tickPickup() {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    const k = t - this.modeAt;
    const ball = w.ballSnapshot();
    w.dip = Math.min(1, k / TIMING.pickupDip);
    this.lookAt(ball.x, ball.y);
    if (this.input.grabbed) {
      this.setMode("excited");
      return;
    }
    if (k < TIMING.pickupDip) return;
    const hold = w.holdPoint();
    const close = Math.hypot(hold.x - ball.x, hold.y - ball.y) < 34 * s;
    if (this.inReach(ball.x, ball.y, 1) || close) {
      w.hold();
      this.caughtMidAir = false;
      this.streak = 0;
      this.rig.setHolding(true);
      this.rig.setDip(0, 0.25);
      this.emit({ type: "caught", midAir: false, x: ball.x, y: ball.y });
      this.emit({ type: "sound", sound: "pickup" });
      this.status("gotit", 0.6);
      this.setMode("return");
    } else {
      this.rig.setDip(0);
      this.setMode("chase");
    }
  }

  private tickReturn() {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    if (!w.held) {
      this.rig.setHolding(false);
      this.setMode(this.input.grabbed ? "excited" : "chase");
      return;
    }
    if (!w.dogGrounded) {
      w.motor.targetX = null;
      return;
    }
    const spot = this.playerSpot();
    const dogX = w.dog.position.x;
    const target = this.deliveryX(spot, -1);
    w.motor.targetX = target;
    w.motor.speed = DOG.trotSpeed * s;
    if (Math.abs(target - dogX) < 36 * s) this.faceHint = -1;
    this.status("return");

    const k = t - this.modeAt;
    const settled = w.arrived && Math.abs(w.dog.velocity.x) < 0.3 * s;
    if ((settled && k > 0.35) || k > TIMING.returnTimeout) {
      this.face(-1);
      this.setMode("drop");
    }
  }

  private tickDrop() {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    const k = t - this.modeAt;
    if (!this.dropped) {
      w.dip = Math.min(0.55, (k / TIMING.dropDelay) * 0.55);
      if (!w.held) {
        this.rig.setHolding(false);
        this.setMode(this.input.grabbed ? "excited" : "idle");
        return;
      }
      if (k >= TIMING.dropDelay) {
        const p = w.holdPoint();
        w.releaseHeld(w.facing * 1.1 * s, -1.6 * Math.sqrt(s));
        this.dropped = true;
        this.ballInPlay = false;
        this.lastEventAt = t;
        this.rig.setHolding(false);
        this.rig.setDip(0, 0.3);
        this.emit({ type: "fetched", midAir: this.caughtMidAir, x: p.x, y: p.y });
        this.emit({ type: "sound", sound: "drop" });
        this.bubble("GOOD JOB, BUCKY!", "praise", 2.0);
        this.status("good", 1.8);
      }
      return;
    }
    w.dip = Math.max(0, w.dip - STEP_S / 0.3);
    if (!this.celebrated && k >= TIMING.dropDelay + 0.25) {
      this.celebrated = true;
      this.face(-1);
      this.setPose("sit", 0.3);
      this.setMood("happy");
    }
    const ball = w.ballSnapshot();
    this.lookAt(ball.x, ball.y - 30 * s);
    if (k >= TIMING.dropCelebrate) {
      this.lastEventAt = t;
      this.setMode("idle");
    }
  }

  // ---------------------------------------------------------------------------
  // nudge (ignored for a while: nose the ball towards the visitor)
  // ---------------------------------------------------------------------------

  private nudgeTarget() {
    return this.pointerActive() ? this.input.pointerX : this.world.homeX - 120 * this.world.scale;
  }

  private enterNudge() {
    const w = this.world;
    const s = w.scale;
    const ball = w.ballSnapshot();
    this.nudgeCount += 1;
    this.nudgeAt = this.t;
    const delta = this.nudgeTarget() - ball.x;
    if (Math.abs(delta) < 70 * s) {
      // Already close: invite play instead.
      this.nudgePhase = "after";
      this.setPose("bow", 0.25);
      this.setMood("excited");
      this.rig.bark();
      this.emit({ type: "sound", sound: "bark" });
      this.bubble("!", "bark", 1);
      this.status("excited");
      return;
    }
    this.nudgeDir = delta > 0 ? 1 : -1;
    this.nudgePhase = "approach";
    this.setPose("stand", 0.2);
    this.setMood("calm");
    this.status("nudge");
  }

  private tickNudge() {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    const ball = w.ballSnapshot();
    const dir = this.nudgeDir;

    if (this.ballInPlay && !this.input.grabbed) {
      this.setMode("chase");
      return;
    }
    if (t - this.modeAt > TIMING.nudgeTimeout) {
      this.setMode("idle");
      return;
    }

    if (this.nudgePhase === "approach") {
      this.lookAt(ball.x, ball.y);
      const standX = w.clampDogX(ball.x - dir * (DOG.pivotX + 26) * s);
      const dogX = w.dog.position.x;
      // On the wrong side of the ball: hop over it rather than shoving it the wrong way.
      const wrongSide = (dogX - ball.x) * dir > -w.dogHalfW;
      if (wrongSide && Math.abs(dogX - ball.x) < 70 * s && w.dogGrounded && t - this.hopOverAt > 0.8) {
        w.motor.jump = 6.2 * Math.sqrt(s);
        this.hopOverAt = t;
        this.rig.anticipate();
      }
      w.motor.targetX = standX;
      w.motor.speed = DOG.walkSpeed * 1.6 * s;
      if (w.arrived && w.dogGrounded && Math.abs(dogX - standX) < 7 * s) {
        this.face(dir);
        this.nudgePhase = "push";
        this.nudgeAt = t;
        this.rig.setDip(0.8, 0.2);
      }
      return;
    }

    if (this.nudgePhase === "push") {
      const k = t - this.nudgeAt;
      w.dip = Math.min(0.8, (k / 0.2) * 0.8);
      this.lookAt(ball.x, ball.y);
      if (k > 0.2) {
        w.motor.targetX = w.clampDogX(ball.x - dir * (DOG.pivotX + 10) * s);
        w.motor.speed = DOG.walkSpeed * s;
      }
      const hold = w.holdPoint();
      const near = Math.abs(hold.x - ball.x) < w.ballRadius + 14 * s;
      if ((k > 0.25 && near) || k > 0.9) {
        w.setBallVelocity(dir * rand(3.2, 4.6) * s, -rand(1.8, 2.6) * Math.sqrt(s), dir * 0.2);
        this.rig.setDip(0, 0.3);
        this.nudgePhase = "after";
        this.nudgeAt = t;
        w.motor.targetX = null;
      }
      return;
    }

    // after
    w.motor.targetX = null;
    w.dip = Math.max(0, w.dip - STEP_S / 0.3);
    if (this.pointerActive()) this.lookAt(this.input.pointerX, this.input.pointerY);
    else this.lookAt(ball.x, ball.y);
    if (t - this.nudgeAt > 0.9) {
      // Not a visitor interaction: the nap / next-nudge clocks keep running.
      this.bubble("?", "query", 1.2);
      this.setPose("sit", 0.3);
      this.setMode("idle");
    }
  }

  // ---------------------------------------------------------------------------
  // nap / wake / come / shake
  // ---------------------------------------------------------------------------

  private tickNap() {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    if ((this.ballInPlay && !w.held) || this.input.grabbed) {
      this.setMode("wake");
      return;
    }
    const ball = w.ballSnapshot();
    if (ball.speed > 2.5 * s && !w.held) {
      this.setMode("wake");
      return;
    }
    if (t - this.lastZzzAt > 3.6) {
      this.bubble("z Z z", "zzz", 4);
      this.lastZzzAt = t;
    }
  }

  private tickWake() {
    const w = this.world;
    const t = this.t;
    const k = t - this.modeAt;
    const ball = w.ballSnapshot();
    if (k > 0.3) this.lookAt(ball.x, ball.y);
    if (this.ballInPlay && !w.held && !this.input.grabbed && k > 0.3) {
      this.setMode("chase");
      return;
    }
    if (this.input.grabbed && k > 0.3) {
      this.setMode("excited");
      return;
    }
    if (k > TIMING.wakeDuration) {
      this.setPose("bow", 0.3);
      this.status("stretch");
      this.setMode("idle");
      this.nextActivityAt = Math.max(this.nextActivityAt, t + 0.7);
      this.activity = "stretch";
      this.lastActivity = "stretch";
      this.activityAt = t;
      this.activityUntil = t + 0.8;
    }
  }

  private tickCome() {
    const w = this.world;
    const s = w.scale;
    const t = this.t;
    this.driveTowards(this.comeX, "casual");
    if (this.pointerActive()) this.lookAt(this.input.pointerX, this.input.pointerY);
    const k = t - this.modeAt;
    if ((w.arrived && Math.abs(w.dog.velocity.x) < 0.3 * s && k > 0.2) || k > TIMING.comeTimeout) {
      this.setPose("sit", 0.25);
      this.lastEventAt = t;
      this.setMode("idle");
    }
  }

  private doShake() {
    const w = this.world;
    const s = w.scale;
    this.shakeCount += 1;
    this.lastShakeAt = this.t;
    w.motor.jump = DOG.hopSpeed * 1.15 * Math.sqrt(s);
    const dir = w.dog.position.x < w.bounds.width / 2 ? 1 : -1;
    w.motor.targetX = w.clampDogX(w.dog.position.x + dir * 48 * s);
    w.motor.speed = DOG.walkSpeed * 2.2 * s;
    this.setPose("stand", 0.15);
    this.rig.shake();
  }

  private tickShake() {
    const w = this.world;
    const t = this.t;
    const k = t - this.modeAt;
    if (!w.ballOnDog() && w.dogGrounded && k > 0.45) {
      this.setMode(this.ballInPlay ? "chase" : "idle");
      return;
    }
    if (w.dogGrounded && t - this.lastShakeAt > 0.7) {
      if (this.shakeCount < 4) this.doShake();
      else this.resetBall();
    }
    if (k > 4) this.setMode(this.ballInPlay ? "chase" : "idle");
  }

  // ---------------------------------------------------------------------------
  // Hooks from the engine (visitor input and physics events)
  // ---------------------------------------------------------------------------

  /** The visitor grabbed the ball (possibly straight out of the dog's mouth). */
  onGrab() {
    this.lastEventAt = this.t;
    this.rig.setHolding(false);
    if (this.mode === "nap") this.emit({ type: "woke" });
    this.setMode("excited");
  }

  onThrow() {
    this.ballInPlay = true;
    this.lastEventAt = this.t;
    if (this.mode === "nap") this.emit({ type: "woke" });
    this.nudgeCount = 0;
    this.setMode("chase");
  }

  /** The grab ended without a throw (cancelled): the ball is loose, go get it. */
  onRelease() {
    this.ballInPlay = true;
    this.setMode("chase");
  }

  onCall(x: number) {
    this.lastEventAt = this.t;
    const m = this.mode;
    if (m === "nap") {
      this.setMode("wake");
      return;
    }
    if (m === "chase" || m === "pickup" || m === "excited" || m === "shake" || m === "drop") return;
    if (m === "return") return; // the engine moves the drop spot to the click instead
    this.comeX = x;
    this.nudgeCount = 0;
    this.setMode("come");
  }

  onPet() {
    this.lastEventAt = this.t;
    if (this.mode === "nap") {
      this.setMode("wake");
      return;
    }
    this.bubble("♥", "love", 1.2);
    this.status("pet", 1);
    if (this.mode === "idle") {
      this.setPose("sit", 0.25);
      this.setMood("happy");
    }
  }

  onPointerNear() {
    if (this.mode === "nap" && this.t - this.modeAt > 1.5) this.setMode("wake");
  }

  onBallEscaped() {
    this.resetBall();
  }

  onBallHitDog(speed: number) {
    const s = this.world.scale;
    if (speed < 5 * s) return;
    const m = this.mode;
    if (m === "idle" || m === "come" || m === "nap" || m === "wake") {
      this.bubble("!", "bark", 0.7);
      this.status("bonk", 0.9);
      if (m === "nap") this.setMode("wake");
    }
  }

  private resetBall() {
    const w = this.world;
    const s = w.scale;
    w.resetBall(w.clampDogX(w.dog.position.x + w.facing * 110 * s));
    this.emit({ type: "ballReset" });
    this.bubble("?", "query", 1.2);
    this.status("reset", 1.2);
    if (this.mode === "chase") {
      this.modeAt = this.t;
      this.planX = null;
      this.noProgressSince = -1;
      this.stuckStage = 0;
      this.sideOverride = 0;
    } else if (this.mode !== "excited") {
      this.setMode(this.ballInPlay ? "chase" : "idle");
    }
  }

  /** Debug/introspection for the harness. */
  get debug() {
    return { mode: this.mode, planX: this.planX, ballInPlay: this.ballInPlay, activity: this.activity };
  }
}