import gsap from "gsap";
import { soundManager } from "@/lib/sound";
import { BALL, G_STEP, MAX_FRAME_MS, MAX_STEPS_PER_FRAME, STEP_MS, TIMING } from "./constants";
import { DogBrain } from "./dogBrain";
import { DogRig } from "./dogRig";
import { CourtEffects } from "./effects";
import { PhysicsWorld, clampNum } from "./physics";
import { ART, RAD2DEG, clamp, lerp } from "./rigMath";
import { saveStats } from "./stats";
import type { BrainEvent, BrainInput, PlayStats, StatusKey } from "./types";

/**
 * The live fetch court: wires matter-js (PhysicsWorld), the dog's mind (DogBrain), the GSAP rig
 * and effects to the DOM. One fixed-timestep loop runs on gsap.ticker only while the court is on
 * screen and the tab is visible; every frame writes transforms to refs (React only hears about
 * discrete events: status, counters, announcements). destroy() releases everything, so React
 * StrictMode's mount → unmount → mount never leaves a second loop behind.
 */

export interface FetchGameElements {
  root: HTMLElement;
  stage: HTMLElement;
  dog: SVGSVGElement;
  dogShadow: HTMLElement;
  ball: HTMLButtonElement;
  ballSquash: SVGGElement;
  ballStretch: SVGGElement;
  ballSpin: SVGGElement;
  ballShadow: HTMLElement;
  bubble: HTMLElement;
  bubbleInner: HTMLElement;
  bubbleText: HTMLElement;
  dust: HTMLElement[];
  ping: HTMLElement;
  confettiCanvas: HTMLCanvasElement;
  indicator: HTMLElement;
  indicatorText: HTMLElement;
  readout: HTMLElement | null;
}

export interface FetchGameCallbacks {
  onStatus(status: StatusKey): void;
  onStats(stats: PlayStats): void;
  onAnnounce(message: string): void;
}

export interface FetchGameOptions {
  night: boolean;
  stats: PlayStats;
}

export interface FetchGameController {
  setNight(night: boolean): void;
  destroy(): void;
}

interface DragState {
  id: number;
  startX: number;
  startY: number;
  startAt: number;
  moved: number;
  samples: Array<{ t: number; x: number; y: number }>;
}

/** 100 px of court = 1 m (at scale 1) for the telemetry readout. */
const PX_PER_METRE = 100;
const BALL_VIEW_RADIUS = 12;

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

function readMetrics(root: HTMLElement) {
  const style = getComputedStyle(root);
  return {
    scale: parseFloat(style.getPropertyValue("--pg-scale")) || 1,
    ground: parseFloat(style.getPropertyValue("--pg-ground-h")) || 30,
    hit: parseFloat(style.getPropertyValue("--pg-ball-hit")) || 44,
  };
}

export function createFetchGame(
  el: FetchGameElements,
  callbacks: FetchGameCallbacks,
  options: FetchGameOptions
): FetchGameController {
  const stats: PlayStats = { ...options.stats };
  const rect = el.stage.getBoundingClientRect();
  let metrics = readMetrics(el.root);
  let width = Math.max(1, rect.width);
  let height = Math.max(1, rect.height);
  let groundY = height - metrics.ground;

  const world = new PhysicsWorld(width, height, groundY, metrics.scale);
  const input: BrainInput = {
    grabbed: false,
    pointerX: width / 2,
    pointerY: groundY - 60,
    pointerAt: -Infinity,
    interactionAt: 0,
    throwOriginX: world.ball.position.x,
    night: options.night,
  };

  let rig!: DogRig;
  let effects!: CourtEffects;
  const squash = { along: 1, perp: 1, angle: 0, cx: 0, cy: 0 };

  // Everything created during setup is recorded by the context and reverted on destroy.
  const ctx = gsap.context(() => {
    rig = new DogRig(el.dog);
    effects = new CourtEffects({
      dust: el.dust,
      ping: el.ping,
      bubble: el.bubble,
      bubbleInner: el.bubbleInner,
      bubbleText: el.bubbleText,
      confettiCanvas: el.confettiCanvas,
      themeSource: el.root,
    });
  }, el.root);
  effects.resize(width, height);

  let audioArmed = false;
  const armAudio = () => {
    audioArmed = true;
  };

  let hitStopUntil = 0;

  const brain = new DogBrain(world, rig, handleBrainEvent, input);

  function announce(message: string) {
    callbacks.onAnnounce(message);
  }

  function handleBrainEvent(event: BrainEvent) {
    switch (event.type) {
      case "status":
        callbacks.onStatus(event.status);
        break;
      case "bubble":
        effects.showBubble(event.text, event.kind, event.seconds, performance.now());
        break;
      case "clearBubble":
        effects.hideBubble();
        break;
      case "caught":
        if (event.midAir) {
          stats.catches += 1;
          stats.bestStreak = Math.max(stats.bestStreak, brain.streak);
          saveStats(stats);
          callbacks.onStats({ ...stats });
          effects.confetti(event.x, event.y, false);
          hitStopUntil = performance.now() + 150;
          if (audioArmed) soundManager.playCatch(true);
          announce(`Mid-air catch! Streak of ${brain.streak}.`);
        } else if (audioArmed) {
          soundManager.playCatch(false);
        }
        break;
      case "fetched": {
        stats.fetches += 1;
        saveStats(stats);
        callbacks.onStats({ ...stats });
        effects.showBubble(
          `GOOD JOB, BUCKY! / FETCH #${String(stats.fetches).padStart(3, "0")}`,
          "praise",
          2.2,
          performance.now()
        );
        if (stats.fetches % 10 === 0) {
          effects.confetti(event.x, event.y, true);
          if (audioArmed) soundManager.playCatch(true);
          announce(`${stats.fetches} fetches! Good job, Bucky!`);
        } else {
          announce(`Good job, Bucky! Fetch number ${stats.fetches}.`);
        }
        break;
      }
      case "napped":
        announce("Bucky curled up for a nap.");
        break;
      case "woke":
        announce("Bucky is awake.");
        break;
      case "ballReset":
        announce("The ball was reset.");
        break;
      case "sound":
        if (!audioArmed) break;
        if (event.sound === "bark") soundManager.playBark();
        else if (event.sound === "pickup") soundManager.playNodeSelect();
        else if (event.sound === "drop") soundManager.playBounce(0.35);
        break;
      case "dust":
        effects.dust(event.x, event.y, event.dir, event.amount, world.scale);
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Physics events
  // ---------------------------------------------------------------------------

  world.onBallImpact = (impact) => {
    const s = world.scale;
    const k = clamp(impact.speed / (16 * s), 0, 1);
    if (impact.speed > 1.6 * s) {
      squash.angle = Math.atan2(impact.ny, impact.nx) * RAD2DEG;
      squash.cx = -impact.nx * BALL_VIEW_RADIUS;
      squash.cy = -impact.ny * BALL_VIEW_RADIUS;
      const amount = 0.08 + 0.3 * k;
      gsap.fromTo(
        squash,
        { along: 1 - amount, perp: 1 + amount * 0.6 },
        { along: 1, perp: 1, duration: 0.45, ease: "elastic.out(1, 0.38)", overwrite: true }
      );
      if (audioArmed) soundManager.playBounce(k);
    }
    if (impact.kind === "ground" && impact.speed > 6 * s) {
      effects.dust(impact.x, world.bounds.groundY, 0, k * 0.8, s);
    }
    if (impact.kind === "dog" || impact.kind === "head") brain.onBallHitDog(impact.speed);
  };

  world.onDogLanding = (landing) => {
    const s = world.scale;
    const k = clamp(landing.speed / (8 * Math.sqrt(s)), 0, 1);
    rig.land(k);
    if (landing.speed > 2.5 * s) effects.dust(landing.x, world.bounds.groundY, 0, k, s);
  };

  world.onBallEscaped = () => brain.onBallEscaped();

  // ---------------------------------------------------------------------------
  // Simulation step + render
  // ---------------------------------------------------------------------------

  let prevDogVx = 0;
  let lastSkidAt = -1;
  let lastKickAt = -1;

  function stepOnce() {
    brain.step();
    world.step();
    brain.postStep();

    // Dust from skids and full-speed gallops.
    const s = world.scale;
    const vx = world.dog.velocity.x;
    const dv = vx - prevDogVx;
    prevDogVx = vx;
    const t = world.time;
    if (world.dogGrounded) {
      const speed = Math.abs(vx);
      const dir = Math.sign(vx);
      if (speed > 3.5 * s && Math.sign(dv) === -dir && Math.abs(dv) > 0.5 * s && t - lastSkidAt > 0.06) {
        lastSkidAt = t;
        effects.dust(world.dog.position.x + dir * 14 * s, world.bounds.groundY, dir, 0.35, s);
      } else if (speed > 7.4 * s && t - lastKickAt > 0.22) {
        lastKickAt = t;
        effects.dust(world.dog.position.x - dir * 20 * s, world.bounds.groundY, -dir, 0.18, s);
      }
    }
  }

  const written = new Map<string, string>();
  function writeStyle(key: string, node: HTMLElement | SVGElement, prop: "transform" | "opacity", value: string) {
    if (written.get(key) === value) return;
    written.set(key, value);
    node.style[prop] = value;
  }
  function writeAttr(key: string, node: Element, attr: string, value: string) {
    if (written.get(key) === value) return;
    written.set(key, value);
    node.setAttribute(attr, value);
  }

  let wasHeld = false;
  let holdBlendAt = 0;
  const holdFrom = { x: 0, y: 0 };
  const lastBall = { x: world.ball.position.x, y: world.ball.position.y, angle: 0 };
  let readoutAt = 0;
  let readoutText = "";

  function render(alpha: number, dt: number) {
    const s = world.scale;
    const now = performance.now();
    const { prev } = world;
    const r = world.ballRadius;

    // Dog
    const dogX = lerp(prev.dx, world.dog.position.x, alpha);
    const dogY = lerp(prev.dy, world.dog.position.y, alpha);
    const bottom = dogY + world.dogHalfH;
    rig.update({
      x: dogX,
      bottom,
      vx: world.dog.velocity.x,
      vy: world.dog.velocity.y,
      grounded: world.dogGrounded,
      scale: s,
      dt,
    });
    const vb = ART.viewBox;
    writeStyle(
      "dog",
      el.dog,
      "transform",
      `translate3d(${(dogX + vb.x * s).toFixed(2)}px, ${(bottom + vb.y * s).toFixed(2)}px, 0)`
    );
    const air = Math.max(0, groundY - bottom);
    const dogShadowK = clamp(1 - air / (120 * s), 0.45, 1);
    writeStyle(
      "dogShadow",
      el.dogShadow,
      "transform",
      `translate3d(${dogX.toFixed(1)}px, ${groundY.toFixed(1)}px, 0) scale(${dogShadowK.toFixed(3)})`
    );
    writeStyle("dogShadowO", el.dogShadow, "opacity", dogShadowK.toFixed(2));

    // Ball
    let bx: number;
    let by: number;
    let angle = lastBall.angle;
    if (world.held) {
      if (!wasHeld) {
        holdBlendAt = now;
        holdFrom.x = lastBall.x;
        holdFrom.y = lastBall.y;
      }
      const mouth = rig.holdWorld(dogX, bottom, s);
      const k = clamp((now - holdBlendAt) / 90, 0, 1);
      bx = clampNum(lerp(holdFrom.x, mouth.x, k), r, width - r);
      by = Math.min(lerp(holdFrom.y, mouth.y, k), groundY - r);
    } else {
      bx = lerp(prev.bx, world.ball.position.x, alpha);
      by = lerp(prev.by, world.ball.position.y, alpha);
      angle = lerp(prev.ba, world.ball.angle, alpha);
    }
    wasHeld = world.held;
    lastBall.x = bx;
    lastBall.y = by;
    lastBall.angle = angle;

    const half = metrics.hit / 2;
    writeStyle(
      "ball",
      el.ball,
      "transform",
      `translate3d(${(bx - half).toFixed(2)}px, ${(by - half).toFixed(2)}px, 0)`
    );
    writeAttr("spin", el.ballSpin, "transform", `rotate(${((angle * RAD2DEG) % 360).toFixed(1)})`);

    const bvx = world.ball.velocity.x;
    const bvy = world.ball.velocity.y;
    const height = groundY - r - by;
    const airborne = !world.held && height > 2;
    const stretchK = airborne ? clamp(Math.hypot(bvx, bvy) / (24 * s), 0, 1) * 0.16 : 0;
    const stretch =
      stretchK > 0.01
        ? (() => {
            const a = (Math.atan2(bvy, bvx) * RAD2DEG).toFixed(1);
            return `rotate(${a}) scale(${(1 + stretchK).toFixed(3)} ${(1 - stretchK * 0.6).toFixed(3)}) rotate(${-a})`;
          })()
        : "scale(1)";
    writeAttr("stretch", el.ballStretch, "transform", stretch);
    const sq =
      squash.along !== 1 || squash.perp !== 1
        ? `translate(${squash.cx.toFixed(2)} ${squash.cy.toFixed(2)}) rotate(${squash.angle.toFixed(1)}) scale(${squash.along.toFixed(3)} ${squash.perp.toFixed(3)}) rotate(${(-squash.angle).toFixed(1)}) translate(${(-squash.cx).toFixed(2)} ${(-squash.cy).toFixed(2)})`
        : "scale(1)";
    writeAttr("squash", el.ballSquash, "transform", sq);

    const ballShadowK = clamp(1 - height / (170 * s), 0.3, 1);
    writeStyle(
      "ballShadow",
      el.ballShadow,
      "transform",
      `translate3d(${bx.toFixed(1)}px, ${groundY.toFixed(1)}px, 0) scale(${ballShadowK.toFixed(3)})`
    );
    writeStyle("ballShadowO", el.ballShadow, "opacity", (ballShadowK * ballShadowK).toFixed(2));

    // Off-court marker while the ball flies above the visible top.
    const above = by + r < 0;
    writeAttr("indicatorV", el.indicator, "data-visible", above ? "true" : "false");
    if (above) {
      writeStyle("indicator", el.indicator, "transform", `translate3d(${clamp(bx, 18, width - 18).toFixed(1)}px, 0, 0)`);
      const alt = (height / (PX_PER_METRE * s)).toFixed(1);
      if (el.indicatorText.textContent !== alt) el.indicatorText.textContent = alt;
    }

    // Speech bubble rides above the head.
    const headTop = rig.headTopWorld(dogX, bottom, s);
    effects.updateBubble(clamp(headTop.x, 30, width - 30), headTop.y - 6 * s, now);

    // Telemetry readout (~8 Hz).
    if (el.readout && now - readoutAt > 120) {
      readoutAt = now;
      const alt = Math.max(0, height / (PX_PER_METRE * s));
      const vel = (Math.hypot(bvx, bvy) * 60) / (PX_PER_METRE * s);
      const text = `ALT ${alt.toFixed(1)}M · VEL ${vel.toFixed(1)}M/S`;
      if (text !== readoutText) {
        readoutText = text;
        el.readout.textContent = text;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Loop (gsap.ticker, fixed 60 Hz physics with interpolation)
  // ---------------------------------------------------------------------------

  let acc = 0;
  let running = false;
  let destroyed = false;

  const tick = (_time: number, deltaMs: number) => {
    let dt = deltaMs;
    if (!(dt > 0) || dt > MAX_FRAME_MS) dt = STEP_MS;
    const slow = performance.now() < hitStopUntil ? 0.3 : 1;
    acc += dt * slow;
    let steps = 0;
    while (acc >= STEP_MS && steps < MAX_STEPS_PER_FRAME) {
      stepOnce();
      acc -= STEP_MS;
      steps += 1;
    }
    if (steps >= MAX_STEPS_PER_FRAME) acc = 0;
    render(acc / STEP_MS, (dt * slow) / 1000);
  };

  let onScreen = false;
  let tabVisible = typeof document === "undefined" || !document.hidden;

  function updateRunning() {
    const should = onScreen && tabVisible && !destroyed;
    if (should && !running) {
      running = true;
      acc = 0;
      gsap.ticker.add(tick);
      el.root.removeAttribute("data-paused");
    } else if (!should && running) {
      running = false;
      gsap.ticker.remove(tick);
      el.root.setAttribute("data-paused", "true");
    }
  }

  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      onScreen = !!entry && entry.isIntersecting;
      updateRunning();
    },
    { rootMargin: "120px 0px" }
  );
  io.observe(el.root);

  const onVisibility = () => {
    tabVisible = !document.hidden;
    updateRunning();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const ro = new ResizeObserver((entries) => {
    const box = entries[entries.length - 1]?.contentRect;
    if (!box || box.width < 1 || box.height < 1) return;
    if (Math.abs(box.width - width) < 0.5 && Math.abs(box.height - height) < 0.5) return;
    metrics = readMetrics(el.root);
    width = box.width;
    height = box.height;
    groundY = height - metrics.ground;
    world.resize(width, height, groundY, metrics.scale);
    effects.resize(width, height);
    input.throwOriginX = clampNum(input.throwOriginX, 0, width);
    input.pointerX = clampNum(input.pointerX, 0, width);
    if (!running) render(1, 0);
  });
  ro.observe(el.stage);

  // ---------------------------------------------------------------------------
  // Input
  // ---------------------------------------------------------------------------

  let drag: DragState | null = null;
  let lastDragEndAt = 0;

  const toStage = (e: { clientX: number; clientY: number }) => {
    const box = el.stage.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  function interacted() {
    input.interactionAt = world.time;
  }

  /** Quick toss with a pleasing randomised arc, away from the dog when there is room. */
  function autoThrow() {
    const s = world.scale;
    const b = world.ball.position;
    let dir: 1 | -1 = b.x >= world.dog.position.x ? 1 : -1;
    const roomAhead = dir === 1 ? width - b.x : b.x;
    const roomBehind = dir === 1 ? b.x : width - b.x;
    if (roomAhead < 170 * s && roomBehind > roomAhead) dir = dir === 1 ? -1 : 1;
    const room = Math.max(90 * s, (dir === 1 ? width - b.x : b.x) - 40 * s);
    const vy = -rand(8.6, 11.6) * Math.sqrt(s);
    const flight = (2 * -vy) / G_STEP;
    const distance = Math.min(room * rand(0.45, 0.85), 640 * s);
    const vx = (dir * distance) / flight;
    world.endGrab();
    if (world.held) world.releaseHeld(0, 0);
    world.setBallVelocity(vx, vy, dir * 0.18);
    input.throwOriginX = world.ball.position.x;
    interacted();
    brain.onThrow();
    if (audioArmed) soundManager.playThrow(0.45);
  }

  function pointerVelocity(samples: DragState["samples"], at: number) {
    const recent = samples.filter((p) => at - p.t <= 90);
    if (recent.length < 2) return { x: 0, y: 0 };
    const first = recent[0];
    const last = recent[recent.length - 1];
    const span = Math.max(last.t - first.t, 8);
    return { x: ((last.x - first.x) / span) * STEP_MS, y: ((last.y - first.y) / span) * STEP_MS };
  }

  const onBallPointerDown = (e: PointerEvent) => {
    if (drag || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.preventDefault();
    armAudio();
    const p = toStage(e);
    try {
      el.ball.setPointerCapture(e.pointerId);
    } catch {
      // Capture can fail if the pointer is already gone; the drag still works while hovering.
    }
    drag = {
      id: e.pointerId,
      startX: p.x,
      startY: p.y,
      startAt: performance.now(),
      moved: 0,
      samples: [{ t: e.timeStamp, x: p.x, y: p.y }],
    };
    world.startGrab(p.x, p.y);
    input.grabbed = true;
    input.pointerX = p.x;
    input.pointerY = p.y;
    input.pointerAt = world.time;
    interacted();
    brain.onGrab();
    el.root.setAttribute("data-dragging", "true");
  };

  const onBallPointerMove = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = toStage(e);
    world.moveGrab(p.x, p.y);
    drag.moved = Math.max(drag.moved, Math.hypot(p.x - drag.startX, p.y - drag.startY));
    drag.samples.push({ t: e.timeStamp, x: p.x, y: p.y });
    while (drag.samples.length > 2 && e.timeStamp - drag.samples[0].t > 140) drag.samples.shift();
    input.pointerX = p.x;
    input.pointerY = p.y;
    input.pointerAt = world.time;
  };

  function finishDrag(e: PointerEvent, released: boolean) {
    const d = drag;
    if (!d || e.pointerId !== d.id) return;
    drag = null;
    input.grabbed = false;
    lastDragEndAt = performance.now();
    el.root.removeAttribute("data-dragging");
    if (el.ball.hasPointerCapture?.(d.id)) {
      try {
        el.ball.releasePointerCapture(d.id);
      } catch {
        // already released
      }
    }
    interacted();

    const tap = released && d.moved < 6 && performance.now() - d.startAt < 300;
    if (tap) {
      autoThrow();
      return;
    }
    if (released) {
      const v = pointerVelocity(d.samples, e.timeStamp);
      if (Math.hypot(v.x, v.y) > 1.2 * world.scale) {
        const ball = world.ball.velocity;
        world.endGrab({ vx: v.x * 0.85 + ball.x * 0.15, vy: v.y * 0.85 + ball.y * 0.15, spin: v.x * 0.012 });
        input.throwOriginX = world.ball.position.x;
        brain.onThrow();
        if (audioArmed) {
          soundManager.playThrow(clamp(Math.hypot(v.x, v.y) / (BALL.maxThrowSpeed * world.scale), 0, 1));
        }
        return;
      }
    }
    // Gentle drop or cancelled drag: the ball is simply loose.
    world.endGrab();
    input.throwOriginX = world.ball.position.x;
    brain.onRelease();
  }

  const onBallPointerUp = (e: PointerEvent) => finishDrag(e, true);
  const onBallPointerCancel = (e: PointerEvent) => finishDrag(e, false);
  const onBallContextMenu = (e: Event) => e.preventDefault();

  /** Keyboard / assistive-tech activation (click with detail 0): throw. */
  const onBallClick = (e: MouseEvent) => {
    if (e.detail !== 0 || drag) return;
    armAudio();
    autoThrow();
  };

  const onStageClick = (e: MouseEvent) => {
    if (el.ball.contains(e.target as Node)) return;
    if (performance.now() - lastDragEndAt < 250) return;
    armAudio();
    const p = toStage(e);
    const s = world.scale;
    interacted();
    const dog = world.dog.position;
    const onDog =
      Math.abs(p.x - (dog.x + world.facing * 10 * s)) < world.dogHalfW + 22 * s &&
      p.y > dog.y - world.dogHalfH - 36 * s &&
      p.y < groundY + 4;
    if (onDog) {
      brain.onPet();
      return;
    }
    const x = clampNum(p.x, world.dogHalfW, width - world.dogHalfW);
    if (brain.mode === "return") input.throwOriginX = x;
    effects.ping(x, groundY);
    brain.onCall(x);
  };

  const onStagePointerMove = (e: PointerEvent) => {
    if (drag) return;
    const p = toStage(e);
    input.pointerX = p.x;
    input.pointerY = p.y;
    input.pointerAt = world.time;
    if (brain.mode === "nap") {
      const head = world.headPivot();
      if (Math.hypot(p.x - head.x, p.y - head.y) < 110 * world.scale) brain.onPointerNear();
    }
  };

  const onStagePointerLeave = () => {
    if (!drag) input.pointerAt = world.time - TIMING.pointerActive;
  };

  el.ball.addEventListener("pointerdown", onBallPointerDown);
  el.ball.addEventListener("pointermove", onBallPointerMove);
  el.ball.addEventListener("pointerup", onBallPointerUp);
  el.ball.addEventListener("pointercancel", onBallPointerCancel);
  el.ball.addEventListener("lostpointercapture", onBallPointerCancel);
  el.ball.addEventListener("contextmenu", onBallContextMenu);
  el.ball.addEventListener("click", onBallClick);
  el.stage.addEventListener("click", onStageClick);
  el.stage.addEventListener("pointermove", onStagePointerMove, { passive: true });
  el.stage.addEventListener("pointerleave", onStagePointerLeave, { passive: true });

  // First frame now (no flash between the static placeholder and the live court).
  render(1, 0);
  el.root.setAttribute("data-live", "true");

  return {
    setNight(night: boolean) {
      input.night = night;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      gsap.ticker.remove(tick);
      running = false;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      el.ball.removeEventListener("pointerdown", onBallPointerDown);
      el.ball.removeEventListener("pointermove", onBallPointerMove);
      el.ball.removeEventListener("pointerup", onBallPointerUp);
      el.ball.removeEventListener("pointercancel", onBallPointerCancel);
      el.ball.removeEventListener("lostpointercapture", onBallPointerCancel);
      el.ball.removeEventListener("contextmenu", onBallContextMenu);
      el.ball.removeEventListener("click", onBallClick);
      el.stage.removeEventListener("click", onStageClick);
      el.stage.removeEventListener("pointermove", onStagePointerMove);
      el.stage.removeEventListener("pointerleave", onStagePointerLeave);
      if (drag && el.ball.hasPointerCapture?.(drag.id)) {
        try {
          el.ball.releasePointerCapture(drag.id);
        } catch {
          // already released
        }
      }
      drag = null;
      gsap.killTweensOf(squash);
      effects.destroy();
      rig.destroy();
      ctx.revert();
      world.destroy();
      el.root.removeAttribute("data-live");
      el.root.removeAttribute("data-paused");
      el.root.removeAttribute("data-dragging");
    },
  };
}
