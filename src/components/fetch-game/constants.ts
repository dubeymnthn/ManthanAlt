/**
 * Tuning for the footer fetch court.
 *
 * Units: lengths are "art units" (1 art unit = 1 CSS px at scale 1, multiplied by the court
 * scale at runtime); speeds are px per physics step and accelerations px per step², because
 * the simulation always advances in fixed 1000/60 ms steps (matter-js' base delta).
 * Numbers were tuned with a headless matter-js harness: throws should feel snappy, never floaty.
 */

export const STEP_MS = 1000 / 60;
export const STEP_S = STEP_MS / 1000;
/** Frame deltas above this (tab switches, long GC pauses) are clamped to one step. */
export const MAX_FRAME_MS = 100;
export const MAX_STEPS_PER_FRAME = 5;

/** engine.gravity.y (with matter's default scale 0.001) ≈ 1600 px/s². */
export const GRAVITY_Y = 1.6;
/** Gravity per step², as matter-js integrates it. */
export const G_STEP = GRAVITY_Y * 0.001 * STEP_MS * STEP_MS;

/** Static bounds are far thicker than any step displacement, so fast flings cannot tunnel. */
export const WALL_THICKNESS = 800;
/** Invisible ceiling above the visible court; throws are clamped to rarely reach it. */
export const CEILING_GAP = 240;
/** Max apex a throw may reach above the visible top edge. */
export const THROW_APEX_ABOVE_TOP = 50;

export const BALL = {
  radius: 12,
  restitution: 0.7,
  friction: 0.5,
  frictionStatic: 0.6,
  frictionAir: 0.006,
  density: 0.0012,
  /** Extra per-step damping while rolling on the ground (matter has no rolling resistance). */
  rolling: 0.972,
  /** Throw speed clamp (px/step at scale 1). */
  maxThrowSpeed: 25,
  /** Hard clamp applied every step as a tunnelling guard. */
  maxSpeed: 32,
  sleepThreshold: 45,
} as const;

export const DOG = {
  bodyW: 50,
  bodyH: 40,
  chamfer: 11,
  density: 0.0025,
  headRadius: 11,
  runSpeed: 8.8,
  trotSpeed: 5.6,
  walkSpeed: 2.6,
  accel: 0.62,
  decel: 0.95,
  airAccel: 0.1,
  /** Jump take-off speeds (px/step), scaled by sqrt(scale). */
  jumpSpeeds: [4.6, 6.0, 7.4],
  hopSpeed: 3.4,
  /** Neck joint (head pivot) relative to the ground point under the torso centre. */
  pivotX: 22,
  pivotY: -42,
  /** Distance from the head pivot to the mouth. */
  mouthDist: 28,
  /** Where a held ball sits, relative to the ground point (facing right). */
  holdX: 52,
  holdY: -41,
  /** Head collision circle centre relative to the pivot. */
  headOffsetX: 12,
  headOffsetY: -5,
} as const;

/** Behaviour timings in simulation seconds. */
export const TIMING = {
  nudgeAfter: 8,
  napAfterDay: 25,
  napAfterNight: 12,
  sitAfter: 1.1,
  chaseTimeout: 10,
  returnTimeout: 9,
  comeTimeout: 6,
  nudgeTimeout: 6.5,
  pickupDip: 0.14,
  dropDelay: 0.2,
  dropCelebrate: 1.25,
  wakeDuration: 1.1,
  flipCooldown: 0.18,
  pointerActive: 2.5,
} as const;

export const MOBILE_SCALE = 0.82;
export const STATS_STORAGE_KEY = "fetch-court-stats-v1";
