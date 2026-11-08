"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./playground.module.scss";
import { DogFigure } from "./DogFigure";
import { BallFigure } from "./BallFigure";
import { createFetchGame, type FetchGameController } from "./game";
import { loadStats } from "./stats";
import { type StatusKey, type PlayStats, EMPTY_STATS } from "./types";
import { STATIC_POSES } from "./rigMath";
import { useResolvedTheme } from "@/lib/theme";
import { soundManager } from "@/lib/sound";

/**
 * Interactive dog fetch companion.
 * Wires Matter.js 2D physics, GSAP DogRig, Canvas Confetti and Web Audio procedural feedback.
 * Rendered within a compact floating presentation viewport.
 */
export function FetchPlayground() {
  const resolvedTheme = useResolvedTheme();
  const night = resolvedTheme === "dark";

  const [status, setStatus] = useState<StatusKey>("ready");
  const [stats, setStats] = useState<PlayStats>(EMPTY_STATS);
  const [announcement, setAnnouncement] = useState<string>("");
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // DOM node references required by the Matter.js / GSAP game engine
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<SVGSVGElement>(null);
  const dogShadowRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLButtonElement>(null);
  const ballShadowRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const bubbleInnerRef = useRef<HTMLDivElement>(null);
  const bubbleTextRef = useRef<HTMLSpanElement>(null);
  const pingRef = useRef<HTMLDivElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const indicatorTextRef = useRef<HTMLSpanElement>(null);
  const dustRefs = useRef<HTMLDivElement[]>([]);

  const controllerRef = useRef<FetchGameController | null>(null);

  // Load stats from localStorage on mount and check reduced-motion
  useEffect(() => {
    setStats(loadStats());
    if (typeof window !== "undefined") {
      setIsReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  // Inform game engine when theme changes (day vs night behaviors)
  useEffect(() => {
    controllerRef.current?.setNight(night);
  }, [night]);

  // Initialize Matter.js physics & game engine
  useEffect(() => {
    if (isReducedMotion) return;

    const root = rootRef.current;
    const stage = stageRef.current;
    const dog = dogRef.current;
    const dogShadow = dogShadowRef.current;
    const ball = ballRef.current;
    const ballShadow = ballShadowRef.current;
    const bubble = bubbleRef.current;
    const bubbleInner = bubbleInnerRef.current;
    const bubbleText = bubbleTextRef.current;
    const ping = pingRef.current;
    const confettiCanvas = confettiCanvasRef.current;
    const indicator = indicatorRef.current;
    const indicatorText = indicatorTextRef.current;

    if (
      !root ||
      !stage ||
      !dog ||
      !dogShadow ||
      !ball ||
      !ballShadow ||
      !bubble ||
      !bubbleInner ||
      !bubbleText ||
      !ping ||
      !confettiCanvas ||
      !indicator ||
      !indicatorText
    ) {
      return;
    }

    const ballSquash = ball.querySelector<SVGGElement>('[data-part="squash"]');
    const ballStretch = ball.querySelector<SVGGElement>('[data-part="stretch"]');
    const ballSpin = ball.querySelector<SVGGElement>('[data-part="spin"]');

    if (!ballSquash || !ballStretch || !ballSpin) return;

    const controller = createFetchGame(
      {
        root,
        stage,
        dog,
        dogShadow,
        ball,
        ballSquash,
        ballStretch,
        ballSpin,
        ballShadow,
        bubble,
        bubbleInner,
        bubbleText,
        dust: dustRefs.current.filter(Boolean),
        ping,
        confettiCanvas,
        indicator,
        indicatorText,
        readout: null, // Minimal presentation: HUD readout omitted
      },
      {
        onStatus: (newStatus) => {
          setStatus(newStatus);
          if (newStatus === "ready" || newStatus === "warmup" || newStatus === "idle" as StatusKey) {
            setIsDragging(false);
          }
        },
        onStats: (newStats) => setStats(newStats),
        onAnnounce: (msg) => setAnnouncement(msg),
      },
      {
        night,
        stats: loadStats(),
      }
    );

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [isReducedMotion, night]);

  // Accessible click toss fallback when user prefers reduced motion
  const handleReducedMotionToss = () => {
    soundManager.playClick();
    setStatus("good");
    setAnnouncement("Good job, Bucky!");
    setStats((prev) => ({
      ...prev,
      fetches: prev.fetches + 1,
    }));
  };

  const isThrowActive =
    isDragging ||
    status === "return" ||
    status === "excited" ||
    status === "gotit" ||
    status === "midair";

  return (
    <div
      ref={rootRef}
      className={styles.playground}
      aria-label="Bucky the Dog — Interactive Engineering Portfolio Companion"
      data-live="false"
    >
      {/* Live region for screen readers (visually hidden via .sr-only) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Charming tooltip: "HEY! I'M BUCKY. THROW THE BALL!" */}
      <div
        className={`${styles.tooltip} ${isThrowActive ? styles.tooltipHidden : ""}`}
        aria-hidden="true"
      >
        <span>HEY! I&apos;M BUCKY. THROW THE BALL!</span>
      </div>

      {/* Tiny subtle fetch counter: "BUCKY'S FETCHES / 008" */}
      {stats.fetches > 0 && (
        <div className={styles.fetchCounter} aria-hidden="true">
          <span className={styles.fetchCounterLabel}>BUCKY&apos;S FETCHES</span>
          <span className={styles.fetchCounterDivider}>/</span>
          <span className={styles.fetchCounterNum}>
            {String(stats.fetches).padStart(3, "0")}
          </span>
        </div>
      )}

      {/* Central Action Field */}
      <div ref={stageRef} className={styles.stage}>
        {/* Dust Puffs Pool */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) dustRefs.current[i] = el;
            }}
            className={styles.dust}
            aria-hidden="true"
          />
        ))}

        {/* Calling Ground Ping Ripple */}
        <div ref={pingRef} className={styles.ping} aria-hidden="true" />

        {/* Off-Court Indicator (visually hidden) */}
        <div ref={indicatorRef} className={styles.indicator} data-visible="false" aria-hidden="true">
          <span ref={indicatorTextRef} />
        </div>

        {/* Dog Shadow & SVG Entity */}
        <div ref={dogShadowRef} className={styles.dogShadow} aria-hidden="true" />
        <DogFigure
          ref={dogRef}
          pose={isReducedMotion ? STATIC_POSES.sit : undefined}
          className={styles.dogSvg}
        />

        {/* Tennis Ball Shadow & Interactive Button Entity */}
        <div ref={ballShadowRef} className={styles.ballShadow} aria-hidden="true" />
        <button
          ref={ballRef}
          type="button"
          className={styles.ballButton}
          onPointerDown={() => setIsDragging(true)}
          onClick={isReducedMotion ? handleReducedMotionToss : undefined}
          aria-label="Tennis ball. Drag to fling to Bucky, tap to toss, or press Space to play fetch."
        >
          <BallFigure className={styles.ballSvg} />
        </button>

        {/* Dog Speech Bubble (Displays "GOOD JOB, BUCKY!" or cute emotes) */}
        <div ref={bubbleRef} className={styles.bubble} aria-hidden="true">
          <div ref={bubbleInnerRef} className={styles.bubbleInner}>
            <span ref={bubbleTextRef} />
            <span className={styles.bubbleTail} />
          </div>
        </div>

        {/* Celebratory Confetti Canvas (Confined strictly to companion bounds) */}
        <canvas ref={confettiCanvasRef} className={styles.confettiCanvas} aria-hidden="true" />
      </div>
    </div>
  );
}
