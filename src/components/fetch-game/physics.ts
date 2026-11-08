import Matter from "matter-js";
import {
  BALL,
  CEILING_GAP,
  DOG,
  G_STEP,
  GRAVITY_Y,
  STEP_MS,
  THROW_APEX_ABOVE_TOP,
  WALL_THICKNESS,
} from "./constants";

/**
 * matter-js world for the fetch court (no DOM). Owns the engine and every body: static ground,
 * side walls and ceiling (thick, extending well past the visible court so fast flings cannot
 * tunnel), the ball, the dog (a dynamic chamfered box with infinite inertia so it never tips)
 * and a kinematic head circle that is moved every step so the dog can nose / bonk the ball.
 */

const { Bodies, Body, Composite, Constraint, Engine, Events, Sleeping } = Matter;

/**
 * matter-js 0.20's Body.setPosition takes a third `updateVelocity` flag (used to move the
 * kinematic head with a real velocity); @types/matter-js has not caught up yet.
 */
const setPosition = Body.setPosition as (
  body: Matter.Body,
  position: Matter.Vector,
  updateVelocity?: boolean
) => void;

export const CAT_WORLD = 0x0001;
export const CAT_BALL = 0x0002;
export const CAT_DOG = 0x0004;
export const CAT_HEAD = 0x0008;
const BALL_MASK = CAT_WORLD | CAT_DOG | CAT_HEAD;

export interface CourtBounds {
  width: number;
  height: number;
  /** y of the ground surface. */
  groundY: number;
  /** y of the ceiling's underside (above the visible top). */
  ceilingY: number;
}

export type ImpactKind = "ground" | "wall" | "ceiling" | "dog" | "head";

export interface BallImpact {
  kind: ImpactKind;
  /** Approach speed along the contact normal (px/step). */
  speed: number;
  x: number;
  y: number;
  /** Contact normal pointing away from the surface the ball hit. */
  nx: number;
  ny: number;
}

export interface DogLanding {
  speed: number;
  x: number;
  y: number;
}

export interface MotorCommand {
  /** Target x for the torso centre, or null to brake to a stop. */
  targetX: number | null;
  /** Max speed for this command (px/step, already scaled). */
  speed: number;
  /** Pending jump take-off speed (px/step, already scaled), 0 = none. */
  jump: number;
}

export interface BallSnapshot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  /** Height of the ball centre above its resting height (0 = on the ground). */
  height: number;
  onGround: boolean;
  sleeping: boolean;
}

const ARRIVE_EPS = 1.8;
const ARRIVE_RELEASE = 4.5;

export class PhysicsWorld {
  readonly engine: Matter.Engine;
  readonly ball: Matter.Body;
  readonly dog: Matter.Body;
  readonly head: Matter.Body;

  bounds: CourtBounds;
  scale: number;
  ballRadius: number;
  dogHalfW: number;
  dogHalfH: number;
  homeX: number;

  /** Simulation clock in seconds. */
  time = 0;
  facing: 1 | -1 = -1;
  dip = 0;
  headSolid = true;
  held = false;
  grab: Matter.Constraint | null = null;

  readonly motor: MotorCommand = { targetX: null, speed: 0, jump: 0 };
  arrived = true;
  dogGrounded = true;
  /** Seconds the dog has been airborne in the current jump. */
  airTime = 0;

  /** Snapshots from before the last step, for render interpolation and swept catch tests. */
  readonly prev = { bx: 0, by: 0, ba: 0, dx: 0, dy: 0 };

  onBallImpact: ((impact: BallImpact) => void) | null = null;
  onDogLanding: ((landing: DogLanding) => void) | null = null;
  onBallEscaped: (() => void) | null = null;

  private ground!: Matter.Body;
  private wallL!: Matter.Body;
  private wallR!: Matter.Body;
  private ceiling!: Matter.Body;
  private lastHeadPos = { x: 0, y: 0 };

  constructor(width: number, height: number, groundY: number, scale: number) {
    this.scale = scale;
    this.bounds = { width, height, groundY, ceilingY: -CEILING_GAP };
    this.ballRadius = BALL.radius * scale;
    this.dogHalfW = (DOG.bodyW * scale) / 2;
    this.dogHalfH = (DOG.bodyH * scale) / 2;

    this.engine = Engine.create({
      enableSleeping: true,
      positionIterations: 8,
      velocityIterations: 6,
    });
    this.engine.gravity.y = GRAVITY_Y;

    // Dog (Bucky) positioned around 88-93% of viewport width, facing left towards the arena
    const dogX = Math.max(width * 0.9, width - 130 * scale);
    this.homeX = dogX;
    this.dog = Bodies.rectangle(
      dogX,
      groundY - this.dogHalfH,
      DOG.bodyW * scale,
      DOG.bodyH * scale,
      {
        label: "dog",
        chamfer: { radius: DOG.chamfer * scale },
        density: DOG.density,
        friction: 0,
        frictionStatic: 0,
        frictionAir: 0,
        restitution: 0,
        inertia: Infinity,
        collisionFilter: { group: -1, category: CAT_DOG, mask: CAT_WORLD | CAT_BALL },
      }
    );
    Body.setInertia(this.dog, Infinity);

    // Ball initially sits immediately beside Bucky's front paws (facing left => left of torso)
    const ballX = dogX - 44 * scale;
    this.ball = Bodies.circle(ballX, groundY - this.ballRadius, this.ballRadius, {
      label: "ball",
      restitution: BALL.restitution,
      friction: BALL.friction,
      frictionStatic: BALL.frictionStatic,
      frictionAir: BALL.frictionAir,
      density: BALL.density,
      sleepThreshold: BALL.sleepThreshold,
      collisionFilter: { category: CAT_BALL, mask: BALL_MASK },
    });

    this.head = Bodies.circle(0, 0, DOG.headRadius * scale, {
      label: "head",
      isStatic: true,
      restitution: 0.35,
      friction: 0.2,
      collisionFilter: { group: -1, category: CAT_HEAD, mask: CAT_BALL },
    });

    this.buildBounds();
    Composite.add(this.engine.world, [this.dog, this.ball, this.head]);
    this.placeHead(false);
    this.snapshot();

    Events.on(this.engine, "collisionStart", this.handleCollisionStart);
  }

  // ---------------------------------------------------------------------------
  // Bounds & resize
  // ---------------------------------------------------------------------------

  private buildBounds() {
    const { width, groundY, ceilingY } = this.bounds;
    const T = WALL_THICKNESS;
    const tall = groundY - ceilingY + 2 * T;
    const midY = (groundY + ceilingY) / 2;
    const world = { category: CAT_WORLD };

    this.ground = Bodies.rectangle(width / 2, groundY + T / 2, width + 4 * T, T, {
      label: "ground",
      isStatic: true,
      friction: 0.8,
      collisionFilter: world,
    });
    this.wallL = Bodies.rectangle(-T / 2, midY, T, tall, {
      label: "wall",
      isStatic: true,
      friction: 0.15,
      collisionFilter: world,
    });
    this.wallR = Bodies.rectangle(width + T / 2, midY, T, tall, {
      label: "wall",
      isStatic: true,
      friction: 0.15,
      collisionFilter: world,
    });
    this.ceiling = Bodies.rectangle(width / 2, ceilingY - T / 2, width + 4 * T, T, {
      label: "ceiling",
      isStatic: true,
      friction: 0.1,
      collisionFilter: world,
    });
    Composite.add(this.engine.world, [this.ground, this.wallL, this.wallR, this.ceiling]);
  }

  /** Rebuild the static bounds for a new court size and keep every body inside. */
  resize(width: number, height: number, groundY: number, scale: number) {
    const { ball, dog, head } = this;
    if (scale !== this.scale) {
      const k = scale / this.scale;
      Body.scale(ball, k, k);
      Body.scale(dog, k, k);
      Body.setInertia(dog, Infinity);
      Body.scale(head, k, k);
      this.scale = scale;
      this.ballRadius = BALL.radius * scale;
      this.dogHalfW = (DOG.bodyW * scale) / 2;
      this.dogHalfH = (DOG.bodyH * scale) / 2;
    }

    Composite.remove(this.engine.world, [this.ground, this.wallL, this.wallR, this.ceiling]);
    this.bounds = { width, height, groundY, ceilingY: -CEILING_GAP };
    const prevHomeX = this.homeX;
    this.homeX = Math.max(width * 0.9, width - 130 * scale);
    this.buildBounds();

    const r = this.ballRadius;
    const atHome = Math.abs(dog.position.x - prevHomeX) < 140 * scale;
    if (atHome && !this.held && Math.abs(dog.velocity.x) < 0.5 && Math.abs(ball.velocity.x) < 0.5) {
      setPosition(dog, { x: this.homeX, y: groundY - this.dogHalfH }, false);
      setPosition(ball, { x: this.homeX - 44 * scale, y: groundY - r }, false);
      Body.setVelocity(dog, { x: 0, y: 0 });
      Body.setVelocity(ball, { x: 0, y: 0 });
    } else {
      if (!this.held) {
        const bx = clampNum(ball.position.x, r + 1, width - r - 1);
        const by = Math.min(ball.position.y, groundY - r - 0.5);
        if (bx !== ball.position.x || by !== ball.position.y) {
          Sleeping.set(ball, false);
          setPosition(ball, { x: bx, y: by }, false);
        }
      }
      const dx = clampNum(dog.position.x, this.dogHalfW + 1, width - this.dogHalfW - 1);
      const dy = Math.min(dog.position.y, groundY - this.dogHalfH);
      if (dx !== dog.position.x || dy !== dog.position.y) {
        Sleeping.set(dog, false);
        setPosition(dog, { x: dx, y: dy }, false);
        Body.setVelocity(dog, { x: 0, y: 0 });
      }
    }
    if (this.motor.targetX !== null) this.motor.targetX = this.clampDogX(this.motor.targetX);
    this.placeHead(false);
    this.snapshot();
  }

  clampDogX(x: number) {
    const margin = this.dogHalfW + 4 * this.scale;
    return clampNum(x, margin, this.bounds.width - margin);
  }

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  get dogBottom() {
    return this.dog.position.y + this.dogHalfH;
  }

  ballSnapshot(): BallSnapshot {
    const b = this.ball;
    const height = this.bounds.groundY - this.ballRadius - b.position.y;
    return {
      x: b.position.x,
      y: b.position.y,
      vx: b.velocity.x,
      vy: b.velocity.y,
      speed: b.speed,
      height,
      onGround: height < 1.5,
      sleeping: b.isSleeping,
    };
  }

  /** The neck joint in world space (moves down while the head dips). */
  headPivot(facing: number = this.facing) {
    const s = this.scale;
    return {
      x: this.dog.position.x + facing * DOG.pivotX * s,
      y: this.dogBottom + DOG.pivotY * s + this.dip * 11 * s,
    };
  }

  holdPoint(facing: number = this.facing) {
    const s = this.scale;
    return {
      x: this.dog.position.x + facing * DOG.holdX * s,
      y: this.dogBottom + DOG.holdY * s + this.dip * 14 * s,
    };
  }

  /** Is the ball resting on the dog's back? */
  ballOnDog(): boolean {
    if (this.held) return false;
    const b = this.ball.position;
    const top = this.dog.position.y - this.dogHalfH;
    return (
      Math.abs(b.x - this.dog.position.x) < this.dogHalfW + this.ballRadius * 0.3 &&
      b.y + this.ballRadius <= top + 4 * this.scale &&
      b.y + this.ballRadius >= top - 6 * this.scale &&
      this.ball.speed < 1.2
    );
  }

  /** Highest velocity a throw may have upward so its apex stays near the visible top. */
  maxLaunchUp() {
    const rise = this.bounds.groundY - this.ballRadius + THROW_APEX_ABOVE_TOP;
    return Math.sqrt(2 * G_STEP * Math.max(rise, 60));
  }

  // ---------------------------------------------------------------------------
  // Ball control
  // ---------------------------------------------------------------------------

  private wakeBall() {
    if (this.ball.isSleeping) Sleeping.set(this.ball, false);
  }

  setBallVelocity(vx: number, vy: number, spin?: number) {
    this.wakeBall();
    Body.setVelocity(this.ball, { x: vx, y: vy });
    if (spin !== undefined) Body.setAngularVelocity(this.ball, spin);
  }

  /** Clamp a throw: max speed, and an upward limit so it does not vanish above the court. */
  clampThrow(vx: number, vy: number) {
    const max = BALL.maxThrowSpeed * this.scale;
    const mag = Math.hypot(vx, vy);
    if (mag > max) {
      vx *= max / mag;
      vy *= max / mag;
    }
    vy = Math.max(vy, -this.maxLaunchUp());
    return { vx, vy };
  }

  startGrab(px: number, py: number) {
    this.releaseHeld(0, 0);
    this.endGrab();
    this.wakeBall();
    const b = this.ball;
    const offX = px - b.position.x;
    const offY = py - b.position.y;
    // Grab offset in the ball's local frame so off-centre grabs swing and spin.
    const c = Math.cos(-b.angle);
    const s = Math.sin(-b.angle);
    const lim = this.ballRadius * 0.85;
    const local = {
      x: clampNum(offX * c - offY * s, -lim, lim),
      y: clampNum(offX * s + offY * c, -lim, lim),
    };
    this.grab = Constraint.create({
      label: "grab",
      pointA: this.clampGrabPoint(px, py),
      bodyB: b,
      pointB: local,
      length: 0,
      stiffness: 0.28,
      damping: 0.12,
    });
    Composite.add(this.engine.world, this.grab);
  }

  moveGrab(px: number, py: number) {
    if (!this.grab) return;
    this.grab.pointA = this.clampGrabPoint(px, py);
    this.wakeBall();
  }

  /** Remove the drag constraint; optionally throw with the given velocity. */
  endGrab(throwVelocity?: { vx: number; vy: number; spin?: number }) {
    if (this.grab) {
      Composite.remove(this.engine.world, this.grab);
      this.grab = null;
    }
    if (throwVelocity) {
      const v = this.clampThrow(throwVelocity.vx, throwVelocity.vy);
      this.setBallVelocity(v.vx, v.vy, throwVelocity.spin);
    }
  }

  private clampGrabPoint(px: number, py: number) {
    const r = this.ballRadius;
    const { width, groundY } = this.bounds;
    return { x: clampNum(px, r + 2, width - r - 2), y: clampNum(py, r + 2, groundY - r - 1) };
  }

  /** The dog takes the ball: collisions off, pinned to the mouth every step. */
  hold() {
    this.endGrab();
    this.held = true;
    this.wakeBall();
    this.ball.collisionFilter.mask = 0;
  }

  /** Let go of a held ball with a small toss. */
  releaseHeld(vx: number, vy: number) {
    if (!this.held) return;
    this.held = false;
    this.ball.collisionFilter.mask = BALL_MASK;
    const p = this.holdPoint();
    const r = this.ballRadius;
    setPosition(
      this.ball,
      {
        x: clampNum(p.x, r + 1, this.bounds.width - r - 1),
        y: Math.min(p.y, this.bounds.groundY - r - 0.5),
      },
      false
    );
    this.setBallVelocity(vx, vy, 0);
  }

  /** Drop the ball back into the court from just above the top edge. */
  resetBall(x: number) {
    this.endGrab();
    if (this.held) {
      this.held = false;
      this.ball.collisionFilter.mask = BALL_MASK;
    }
    const r = this.ballRadius;
    const bx = clampNum(x, r + 4, this.bounds.width - r - 4);
    this.wakeBall();
    setPosition(this.ball, { x: bx, y: -r * 2 }, false);
    Body.setVelocity(this.ball, { x: 0, y: 1.5 });
    Body.setAngularVelocity(this.ball, (Math.random() - 0.5) * 0.2);
    this.prev.bx = bx;
    this.prev.by = -r * 2;
  }

  // ---------------------------------------------------------------------------
  // Stepping
  // ---------------------------------------------------------------------------

  setHeadSolid(solid: boolean) {
    if (solid === this.headSolid) return;
    this.headSolid = solid;
    this.head.collisionFilter.mask = solid ? CAT_BALL : 0;
  }

  private placeHead(withVelocity: boolean) {
    const s = this.scale;
    const pivot = this.headPivot();
    const a = this.dip * 0.75;
    const ox = DOG.headOffsetX * s;
    const oy = DOG.headOffsetY * s;
    const pos = {
      x: pivot.x + this.facing * (ox * Math.cos(a) - oy * Math.sin(a)),
      y: pivot.y + ox * Math.sin(a) + oy * Math.cos(a),
    };
    // Turning around swaps the head to the other side: teleport instead of batting the ball.
    const jump = Math.hypot(pos.x - this.lastHeadPos.x, pos.y - this.lastHeadPos.y);
    setPosition(this.head, pos, withVelocity && jump < 14 * s);
    if (!withVelocity || jump >= 14 * s) Body.setVelocity(this.head, { x: 0, y: 0 });
    this.lastHeadPos = pos;
  }

  private snapshot() {
    this.prev.bx = this.ball.position.x;
    this.prev.by = this.ball.position.y;
    this.prev.ba = this.ball.angle;
    this.prev.dx = this.dog.position.x;
    this.prev.dy = this.dog.position.y;
  }

  /** Drive the dog body from the motor command: smooth spring-damper arrival + agile turnarounds. */
  private applyMotor() {
    const { dog, motor } = this;
    const s = this.scale;
    let vx = dog.velocity.x;
    let desired = 0;

    if (motor.targetX !== null) {
      const dx = this.clampDogX(motor.targetX) - dog.position.x;
      const dist = Math.abs(dx);
      if (this.arrived && dist > ARRIVE_RELEASE * s) this.arrived = false;

      if (!this.arrived) {
        if (dist < ARRIVE_EPS * s && Math.abs(vx) < 0.8 * s) {
          this.arrived = true;
        } else {
          const effDist = Math.max(0, dist - ARRIVE_EPS * s);
          // Kinematic braking curve blended with a soft proportional settle zone near the target
          const kinematicStop = Math.sqrt(2 * DOG.decel * s * 0.82 * effDist);
          const slowRadius = 32 * s;
          const softStop =
            effDist < slowRadius
              ? motor.speed * (effDist / slowRadius)
              : kinematicStop;
          desired = Math.sign(dx) * Math.min(motor.speed, kinematicStop, Math.max(softStop, 0.35 * s));
        }
      }
    } else {
      this.arrived = true;
    }

    if (this.dogGrounded) {
      const reversing = desired !== 0 && vx !== 0 && Math.sign(desired) !== Math.sign(vx);
      const speedingUp =
        !reversing &&
        Math.abs(desired) > Math.abs(vx) &&
        Math.sign(desired) === Math.sign(vx || desired);

      // Give a 1.35x paw-traction boost when reversing direction so the dog pivots crisply
      const baseRate = reversing
        ? DOG.decel * 1.35
        : speedingUp
          ? DOG.accel
          : DOG.decel;
      vx = approach(vx, desired, baseRate * s);
      if (this.arrived && Math.abs(vx) < 0.06 * s) vx = 0;
    } else {
      vx = approach(vx, desired, DOG.airAccel * 1.25 * s);
    }

    let vy = dog.velocity.y;
    if (motor.jump > 0 && this.dogGrounded) {
      vy = -motor.jump;
      // Add a slight horizontal lunge towards the target when leaping
      if (desired !== 0) {
        vx = clampNum(vx + Math.sign(desired) * 0.65 * s, -DOG.runSpeed * 1.15 * s, DOG.runSpeed * 1.15 * s);
      }
      this.dogGrounded = false;
      this.airTime = 0;
    }
    motor.jump = 0;

    if (vx !== dog.velocity.x || vy !== dog.velocity.y) {
      if (dog.isSleeping) Sleeping.set(dog, false);
      Body.setVelocity(dog, { x: vx, y: vy });
    }
  }

  /** One fixed 1000/60 ms step. */
  step() {
    this.snapshot();
    this.applyMotor();
    this.placeHead(true);

    // A kinematic head does not wake sleeping bodies; do it when it is about to touch the ball.
    if (this.ball.isSleeping && this.headSolid) {
      const reach = this.ballRadius + DOG.headRadius * this.scale + 3;
      const d = Math.hypot(
        this.lastHeadPos.x - this.ball.position.x,
        this.lastHeadPos.y - this.ball.position.y
      );
      if (d < reach) Sleeping.set(this.ball, false);
    }
    if (this.grab) this.wakeBall();

    Engine.update(this.engine, STEP_MS);
    this.time += STEP_MS / 1000;

    this.afterStep();
  }

  private afterStep() {
    const { ball, dog, bounds } = this;
    const r = this.ballRadius;
    const s = this.scale;

    // Dog grounding (flat ground: a geometric test is exact and cheap).
    const wasGrounded = this.dogGrounded;
    const onGround = this.dogBottom >= bounds.groundY - 1.2 && dog.velocity.y > -1;
    if (onGround && !wasGrounded) {
      this.dogGrounded = true;
      this.onDogLanding?.({ speed: Math.abs(dog.velocity.y), x: dog.position.x, y: this.dogBottom });
    } else if (!onGround && wasGrounded && this.dogBottom < bounds.groundY - 3) {
      this.dogGrounded = false;
      this.airTime = 0;
    }
    if (!this.dogGrounded) {
      this.airTime += STEP_MS / 1000;
      // Supported by something other than the ground (e.g. landed on the ball): give up the jump.
      if (this.airTime > 1.6 && Math.abs(dog.velocity.y) < 0.3) this.dogGrounded = true;
    }

    // Held ball rides in the mouth (kept inside the court when the dog noses a wall).
    if (this.held) {
      const p = this.holdPoint();
      p.x = clampNum(p.x, r, bounds.width - r);
      p.y = Math.min(p.y, bounds.groundY - r);
      setPosition(ball, p, false);
      Body.setVelocity(ball, { x: dog.velocity.x, y: dog.velocity.y });
      Body.setAngularVelocity(ball, 0);
      return;
    }

    const height = bounds.groundY - r - ball.position.y;
    if (!this.grab && !ball.isSleeping && height < 1 && Math.abs(ball.velocity.y) < 1) {
      Body.setVelocity(ball, { x: ball.velocity.x * BALL.rolling, y: ball.velocity.y });
      Body.setAngularVelocity(ball, ball.angularVelocity * BALL.rolling);
    }

    const max = BALL.maxSpeed * s;
    if (ball.speed > max) {
      const k = max / ball.speed;
      Body.setVelocity(ball, { x: ball.velocity.x * k, y: ball.velocity.y * k });
    }

    const escaped =
      !Number.isFinite(ball.position.x) ||
      !Number.isFinite(ball.position.y) ||
      ball.position.x < -r * 2 ||
      ball.position.x > bounds.width + r * 2 ||
      ball.position.y > bounds.groundY + r ||
      ball.position.y < bounds.ceilingY - r * 4;
    if (escaped) this.onBallEscaped?.();

    const dogLost =
      !Number.isFinite(dog.position.x) ||
      !Number.isFinite(dog.position.y) ||
      dog.position.x < -this.dogHalfW ||
      dog.position.x > bounds.width + this.dogHalfW ||
      dog.position.y > bounds.groundY;
    if (dogLost) {
      const x = Number.isFinite(dog.position.x)
        ? this.clampDogX(dog.position.x)
        : bounds.width * 0.3;
      setPosition(dog, { x, y: bounds.groundY - this.dogHalfH }, false);
      Body.setVelocity(dog, { x: 0, y: 0 });
      this.dogGrounded = true;
    }
  }

  private handleCollisionStart = (event: Matter.IEventCollision<Matter.Engine>) => {
    for (const pair of event.pairs) {
      const a = pair.bodyA.parent;
      const b = pair.bodyB.parent;
      if (a === this.ball || b === this.ball) {
        const other = a === this.ball ? b : a;
        if (!this.onBallImpact || this.held) continue;
        const n = pair.collision.normal;
        // matter's normal points from bodyB towards bodyA; flip it so it points at the ball.
        const sign = a === this.ball ? 1 : -1;
        const nx = n.x * sign;
        const ny = n.y * sign;
        const rvx = this.ball.velocity.x - other.velocity.x;
        const rvy = this.ball.velocity.y - other.velocity.y;
        const speed = Math.abs(rvx * nx + rvy * ny);
        const kind: ImpactKind =
          other.label === "ground"
            ? "ground"
            : other.label === "wall"
              ? "wall"
              : other.label === "ceiling"
                ? "ceiling"
                : other === this.dog
                  ? "dog"
                  : "head";
        this.onBallImpact({
          kind,
          speed,
          x: this.ball.position.x - nx * this.ballRadius,
          y: this.ball.position.y - ny * this.ballRadius,
          nx,
          ny,
        });
      }
    }
  };

  destroy() {
    Events.off(this.engine, "collisionStart", this.handleCollisionStart);
    this.onBallImpact = null;
    this.onDogLanding = null;
    this.onBallEscaped = null;
    if (this.grab) this.grab = null;
    Composite.clear(this.engine.world, false, true);
    Engine.clear(this.engine);
  }
}

// -----------------------------------------------------------------------------
// Ballistic prediction (mirrors matter's Verlet integration closely enough for planning)
// -----------------------------------------------------------------------------

export interface TrajectoryBuffer {
  x: Float32Array;
  y: Float32Array;
  length: number;
}

export function createTrajectory(capacity: number): TrajectoryBuffer {
  return { x: new Float32Array(capacity), y: new Float32Array(capacity), length: 0 };
}

const GROUND_E = 0.58;
const WALL_E = 0.62;

/**
 * Forward-simulate the free ball with gravity, air drag, ground bounces, rolling resistance and
 * wall reflections. Index k holds the predicted centre k steps from now.
 */
export function predictBall(world: PhysicsWorld, out: TrajectoryBuffer, steps: number) {
  const r = world.ballRadius;
  const { width, groundY } = world.bounds;
  const rest = groundY - r;
  const drag = 1 - BALL.frictionAir;
  const isGrabbed = world.grab !== null;
  const grabTarget = world.grab?.pointA;

  let x = world.ball.position.x;
  let y = world.ball.position.y;
  let vx = world.ball.velocity.x;
  let vy = world.ball.velocity.y;
  const n = Math.min(steps, out.x.length);

  for (let k = 0; k < n; k++) {
    if (isGrabbed && grabTarget) {
      // If the user is holding/dragging the ball, predict it settling smoothly toward the cursor
      vx = (grabTarget.x - x) * 0.25;
      vy = (grabTarget.y - y) * 0.25;
      x = clampNum(x + vx, r, width - r);
      y = clampNum(y + vy, r, rest);
    } else {
      if (y >= rest - 0.5 && Math.abs(vy) < 1.1) {
        vy = 0;
        y = rest;
        vx *= BALL.rolling * drag;
      } else {
        vx *= drag;
        vy = vy * drag + G_STEP;
      }
      x += vx;
      y += vy;
      if (y > rest) {
        y = rest;
        vy = Math.abs(vy) > 1.1 ? -Math.abs(vy) * GROUND_E : 0;
        vx *= 0.94;
      }
      if (x < r) {
        x = r + (r - x);
        vx = Math.abs(vx) * WALL_E;
      } else if (x > width - r) {
        x = width - r - (x - (width - r));
        vx = -Math.abs(vx) * WALL_E;
      }
    }
    out.x[k] = x;
    out.y[k] = y;
  }
  out.length = n;
}

export function approach(v: number, target: number, rate: number) {
  if (v < target) return Math.min(target, v + rate);
  if (v > target) return Math.max(target, v - rate);
  return v;
}

export function clampNum(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}