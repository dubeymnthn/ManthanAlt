/**
 * Pure (DOM-free) composition of the dog rig.
 *
 * The art is drawn facing right in art units with the origin on the ground under the torso
 * centre. composeDog() turns a set of pose parameters into one SVG matrix per part (relative
 * to its parent group) plus a few anchor points, using two-bone-free "leg IK": every leg is a
 * single segment that rotates and stretches so its paw lands on a target (planted stance, gait
 * swing, folded sit...). The same function renders the static SSR pose and the live rig.
 */

export type Mat = [number, number, number, number, number, number];

export const RAD2DEG = 180 / Math.PI;

export function mul(m: Mat, n: Mat): Mat {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
}

export function translate(x: number, y: number): Mat {
  return [1, 0, 0, 1, x, y];
}

export function scaleAbout(sx: number, sy: number, cx = 0, cy = 0): Mat {
  return [sx, 0, 0, sy, cx - sx * cx, cy - sy * cy];
}

export function rotateAbout(deg: number, cx = 0, cy = 0): Mat {
  const r = deg / RAD2DEG;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy];
}

export function applyMat(m: Mat, x: number, y: number): { x: number; y: number } {
  return { x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] };
}

const r3 = (v: number) => Math.round(v * 1000) / 1000;

export function matToSvg(m: Mat): string {
  return `matrix(${r3(m[0])} ${r3(m[1])} ${r3(m[2])} ${r3(m[3])} ${r3(m[4])} ${r3(m[5])})`;
}

export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const frac = (v: number) => v - Math.floor(v);

/** Art geometry (art units, facing right, origin = ground under the torso centre). */
export const ART = {
  /** Symmetric in x so the facing flip happens inside the SVG viewport. */
  viewBox: { x: -64, y: -74, w: 128, h: 80 },
  legLength: 27,
  shoulder: { x: 18, y: -27 },
  rearHip: { x: -13, y: -27 },
  bodyCenter: { x: 0, y: -27 },
  headPivot: { x: 22, y: -42 },
  earPivot: { x: 24, y: -55 },
  jawHinge: { x: 37, y: -39.5 },
  tongueRoot: { x: 44.5, y: -39 },
  eyeCenter: { x: 35, y: -52 },
  tailPivot: { x: -23, y: -32 },
  tagPivot: { x: 23, y: -35.5 },
  hold: { x: 52, y: -41 },
  headTop: { x: 33, y: -64 },
} as const;

export type LegPart = "legFarBack" | "legFarFront" | "legNearBack" | "legNearFront";

export type RigPart =
  | "root"
  | "body"
  | "torso"
  | LegPart
  | "tail"
  | "tag"
  | "head"
  | "ear"
  | "jaw"
  | "tongue"
  | "eyes"
  | "brow";

export const RIG_PARTS: readonly RigPart[] = [
  "root",
  "body",
  "torso",
  "legFarBack",
  "legFarFront",
  "legNearBack",
  "legNearFront",
  "tail",
  "tag",
  "head",
  "ear",
  "jaw",
  "tongue",
  "eyes",
  "brow",
];

interface LegDef {
  part: LegPart;
  hip: { x: number; y: number };
  back: boolean;
  /** Phase offsets (cycles) for the diagonal trot and the rotary gallop. */
  trot: number;
  gallop: number;
}

const LEGS: readonly LegDef[] = [
  { part: "legFarBack", hip: { x: -15, y: -27 }, back: true, trot: 0.5, gallop: 0 },
  { part: "legFarFront", hip: { x: 16, y: -27 }, back: false, trot: 0, gallop: 0.55 },
  { part: "legNearBack", hip: { x: -11, y: -27 }, back: true, trot: 0, gallop: 0.1 },
  { part: "legNearFront", hip: { x: 21, y: -27 }, back: false, trot: 0.5, gallop: 0.65 },
];

/** Everything the rig can express. Angles in degrees (+ = clockwise when facing right). */
export interface RigPose {
  /** Signed horizontal scale for the facing flip (|v| stays >= 0.2 while turning). */
  facing: number;
  rootSX: number;
  rootSY: number;
  sit: number;
  lie: number;
  bow: number;
  crouch: number;
  /** 0..1 blend into the airborne pose; airRise -1 (falling) .. 1 (rising). */
  airborne: number;
  airRise: number;
  gaitPhase: number;
  gaitWeight: number;
  gaitGallop: number;
  /** Extra vertical body offset (landing squash etc.). */
  bob: number;
  breath: number;
  headAngle: number;
  dip: number;
  jaw: number;
  tongue: number;
  tongueWiggle: number;
  blink: number;
  brow: number;
  ear: number;
  tail: number;
  tag: number;
  scratch: number;
  scratchOsc: number;
  shake: number;
}

export function createPose(overrides: Partial<RigPose> = {}): RigPose {
  return {
    facing: 1,
    rootSX: 1,
    rootSY: 1,
    sit: 0,
    lie: 0,
    bow: 0,
    crouch: 0,
    airborne: 0,
    airRise: 0,
    gaitPhase: 0,
    gaitWeight: 0,
    gaitGallop: 0,
    bob: 0,
    breath: 0,
    headAngle: 0,
    dip: 0,
    jaw: 0,
    tongue: 0,
    tongueWiggle: 0,
    blink: 0,
    brow: 0,
    ear: 0,
    tail: 0,
    tag: 0,
    scratch: 0,
    scratchOsc: 0,
    shake: 0,
    ...overrides,
  };
}

export interface RigFrame {
  transforms: Record<RigPart, string>;
  haunchOpacity: number;
  eyelidOpacity: number;
  tongueOpacity: number;
  /** Anchors in SVG user space (origin = ground point, after the facing flip). */
  hold: { x: number; y: number };
  headTop: { x: number; y: number };
  pivot: { x: number; y: number };
  /** Total body rotation, useful for secondary motion. */
  bodyRotation: number;
}

/** Body bob / pitch produced by the gait at a given phase. */
export function gaitBodyMotion(phase: number, weight: number, gallop: number) {
  const tau = Math.PI * 2;
  const trotBob = -1.5 * (1 - Math.cos(tau * 2 * phase)) * 0.5;
  const gallopBob = -2.8 * (1 - Math.cos(tau * phase + 0.4)) * 0.5;
  return {
    bob: lerp(trotBob, gallopBob, gallop) * weight,
    pitch: gallop * 7 * Math.sin(tau * phase + 0.9) * weight,
  };
}

function gaitOffset(u: number, duty: number, amp: number, lift: number) {
  if (u < duty) return { x: amp - 2 * amp * (u / duty), lift: 0 };
  const s = (u - duty) / (1 - duty);
  const e = s * s * (3 - 2 * s);
  return { x: -amp + 2 * amp * e, lift: lift * Math.sin(Math.PI * s) };
}

export function composeDog(p: RigPose): RigFrame {
  const gait = gaitBodyMotion(p.gaitPhase, p.gaitWeight, p.gaitGallop);

  // ---- Body: sit pivots on the shoulders, the play-bow on the hips, gait pitch on the centre.
  const sitA = -21 * p.sit;
  const bowA = 15 * p.bow;
  const airPitch = -9 * p.airRise * p.airborne;
  const pitchA = gait.pitch + airPitch;
  const shakeA = 6 * Math.sin(p.shake * Math.PI * 6) * (p.shake > 0 && p.shake < 1 ? 1 : 0);
  const yOff = gait.bob + p.bob + 3.5 * p.crouch + 12.5 * p.lie + 1.5 * p.sit;
  const bodyRot = sitA + bowA + pitchA + shakeA;

  const body = mul(
    translate(0, yOff),
    mul(
      rotateAbout(sitA, ART.shoulder.x, ART.shoulder.y),
      mul(
        rotateAbout(bowA, ART.rearHip.x, ART.rearHip.y),
        rotateAbout(pitchA + shakeA, ART.bodyCenter.x, ART.bodyCenter.y)
      )
    )
  );

  const root = scaleAbout(p.facing * p.rootSX, p.rootSY, 0, 0);

  // ---- Legs: planted-foot gait + pose targets, solved as rotate + stretch.
  const g = clamp(p.gaitGallop, 0, 1);
  const duty = lerp(0.56, 0.38, g);
  const amp = lerp(8.5, 13, g);
  const liftH = lerp(4, 6.5, g);
  const wSit = clamp(p.sit, 0, 1);
  const wLie = clamp(p.lie, 0, 1);
  const wBow = clamp(p.bow, 0, 1);
  const poseSum = wSit + wLie + wBow;
  const norm = poseSum > 1 ? 1 / poseSum : 1;
  const wStand = Math.max(0, 1 - poseSum);

  const legs = {} as Record<LegPart, string>;
  for (const leg of LEGS) {
    const hip = applyMat(body, leg.hip.x, leg.hip.y);
    const u = frac(p.gaitPhase + lerp(leg.trot, leg.gallop, g));
    const off = gaitOffset(u, duty, amp, liftH);
    const standX = hip.x + (leg.back ? -0.5 : 0.5) + off.x * p.gaitWeight;
    const standY = -off.lift * p.gaitWeight;
    const sitX = hip.x + (leg.back ? 10 : 2);
    const lieX = hip.x + (leg.back ? 12 : 20);
    const bowX = hip.x + (leg.back ? -2 : 9);

    const tx = standX * wStand + (sitX * wSit + lieX * wLie + bowX * wBow) * norm;
    const ty = standY * wStand;
    const dx = tx - hip.x;
    const dy = ty - hip.y;
    let angle = Math.atan2(-dx, dy) * RAD2DEG;
    let k = clamp(Math.hypot(dx, dy) / ART.legLength, 0.55, 1.1);

    if (p.airborne > 0) {
      const rise = (clamp(p.airRise, -1, 1) + 1) / 2;
      const airAngle = leg.back ? lerp(16, 48, rise) : lerp(-12, -54, rise);
      const airK = leg.back ? 0.96 : lerp(0.96, 0.8, rise);
      angle = lerp(angle, airAngle, clamp(p.airborne, 0, 1));
      k = lerp(k, airK, clamp(p.airborne, 0, 1));
    }
    if (leg.part === "legNearBack" && p.scratch > 0) {
      angle = lerp(angle, -102 + 13 * p.scratchOsc, p.scratch);
      k = lerp(k, 0.88, p.scratch);
    }

    legs[leg.part] = matToSvg(
      mul(translate(leg.hip.x, leg.hip.y), mul(rotateAbout(angle - bodyRot), scaleAbout(1, k)))
    );
  }

  // ---- Head: look angle + dip, counter-rotated so it stays level while the body pitches.
  const headY = 5 * p.dip + 10 * p.lie;
  const headA =
    p.headAngle + 42 * p.dip + 9 * p.lie - 0.75 * sitA - 0.9 * bowA - 0.5 * pitchA - shakeA * 1.4;
  const head = mul(translate(0, headY), rotateAbout(headA, ART.headPivot.x, ART.headPivot.y));

  const rootBody = mul(root, body);
  const rootHead = mul(rootBody, head);

  const transforms: Record<RigPart, string> = {
    root: matToSvg(root),
    body: matToSvg(body),
    torso: matToSvg(scaleAbout(1 + 0.012 * p.breath, 1 + 0.035 * p.breath, 0, -15)),
    ...legs,
    tail: matToSvg(rotateAbout(p.tail, ART.tailPivot.x, ART.tailPivot.y)),
    tag: matToSvg(rotateAbout(p.tag, ART.tagPivot.x, ART.tagPivot.y)),
    head: matToSvg(head),
    ear: matToSvg(rotateAbout(p.ear, ART.earPivot.x, ART.earPivot.y)),
    jaw: matToSvg(rotateAbout(p.jaw, ART.jawHinge.x, ART.jawHinge.y)),
    tongue: matToSvg(
      mul(
        rotateAbout(p.tongueWiggle, ART.tongueRoot.x, ART.tongueRoot.y),
        scaleAbout(1, Math.max(0.01, p.tongue), ART.tongueRoot.x, ART.tongueRoot.y)
      )
    ),
    eyes: matToSvg(scaleAbout(1, 1 - 0.92 * clamp(p.blink, 0, 1), ART.eyeCenter.x, ART.eyeCenter.y)),
    brow: matToSvg(translate(0, -1.6 * p.brow)),
  };

  return {
    transforms,
    haunchOpacity: clamp(p.sit * 1.4 + p.lie * 0.9, 0, 1),
    eyelidOpacity: clamp((p.blink - 0.55) / 0.3, 0, 1),
    tongueOpacity: p.tongue > 0.04 ? 1 : 0,
    hold: applyMat(rootHead, ART.hold.x, ART.hold.y),
    headTop: applyMat(rootHead, ART.headTop.x, ART.headTop.y),
    pivot: applyMat(mul(rootBody, translate(0, headY)), ART.headPivot.x, ART.headPivot.y),
    bodyRotation: bodyRot,
  };
}

/** Named static poses for the SSR placeholder and the reduced-motion court. */
export const STATIC_POSES = {
  sit: createPose({ facing: -1, sit: 1, tail: -42, headAngle: -6, ear: 4 }),
  happy: createPose({ facing: -1, sit: 1, tail: -30, headAngle: -12, ear: 8, jaw: 7, tongue: 1, brow: 1 }),
} as const;
