/** Shared contracts between the dog brain, the rig, the engine and the React shell. */

export type StatusKey =
  | "warmup"
  | "ready"
  | "excited"
  | "chase"
  | "midair"
  | "gotit"
  | "return"
  | "good"
  | "sniff"
  | "look"
  | "scratch"
  | "stretch"
  | "wander"
  | "yawn"
  | "nudge"
  | "nap"
  | "wake"
  | "come"
  | "shake"
  | "reset"
  | "bonk"
  | "pet";

export const STATUS_LABEL: Record<StatusKey, string> = {
  warmup: "WARMING UP",
  ready: "AWAITING THROW",
  excited: "READY? READY?",
  chase: "IN PURSUIT",
  midair: "MID-AIR CATCH!",
  gotit: "GOT IT",
  return: "RETURNING",
  good: "GOOD DOG!",
  sniff: "SNIFFING AROUND",
  look: "ON LOOKOUT",
  scratch: "SCRATCHING",
  stretch: "STRETCHING",
  wander: "WANDERING",
  yawn: "YAWNING",
  nudge: "NUDGING THE BALL",
  nap: "NAPPING  ZZZ",
  wake: "WAKING UP",
  come: "COMING!",
  shake: "SHAKE IT OFF",
  reset: "BALL RESET",
  bonk: "BONK!",
  pet: "GOOD BOY",
};

export interface PlayStats {
  fetches: number;
  catches: number;
  bestStreak: number;
}

export const EMPTY_STATS: PlayStats = { fetches: 0, catches: 0, bestStreak: 0 };

export type DogPoseName = "stand" | "sit" | "lie" | "bow" | "crouch";

export type DogMood = "calm" | "happy" | "excited" | "run" | "sleepy" | "proud";

export type BubbleKind = "bark" | "praise" | "zzz" | "love" | "query";

/** What the brain may ask of the visual rig. Implemented by DogRig (DOM) and stubs (tests). */
export interface DogRigApi {
  setPose(pose: DogPoseName, duration?: number): void;
  setMood(mood: DogMood): void;
  /** World-space look target; null looks straight ahead. */
  setLook(target: { x: number; y: number } | null): void;
  /** Snap the head towards a point immediately (catches). */
  snapLook(target: { x: number; y: number }): void;
  setDip(amount: number, duration?: number): void;
  setActivity(activity: "none" | "sniff" | "scratch"): void;
  setSleeping(sleeping: boolean): void;
  setHolding(holding: boolean): void;
  turnTo(facing: 1 | -1): void;
  bark(): void;
  yawn(): void;
  shake(): void;
  land(impact: number): void;
  anticipate(): void;
}

export type BrainEvent =
  | { type: "status"; status: StatusKey }
  | { type: "bubble"; text: string; kind: BubbleKind; seconds: number }
  | { type: "clearBubble" }
  | { type: "caught"; midAir: boolean; x: number; y: number }
  | { type: "fetched"; midAir: boolean; x: number; y: number }
  | { type: "napped" }
  | { type: "woke" }
  | { type: "sound"; sound: "bark" | "catch" | "pickup" | "drop" }
  | { type: "ballReset" }
  | { type: "dust"; x: number; y: number; dir: number; amount: number };

/** Live input the engine feeds the brain each step. */
export interface BrainInput {
  /** The visitor is holding the ball. */
  grabbed: boolean;
  pointerX: number;
  pointerY: number;
  /** Sim time of the last pointer movement over the court (-Infinity if never). */
  pointerAt: number;
  /** Sim time of the last deliberate interaction (throw, grab, call, pet). */
  interactionAt: number;
  /** Where the last throw started (the player's spot). */
  throwOriginX: number;
  night: boolean;
}
