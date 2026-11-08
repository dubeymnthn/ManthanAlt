"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./fetch-game.module.scss";
import { FetchDog, GameState } from "./FetchDog";
import { FetchBall } from "./FetchBall";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { soundManager } from "@/lib/sound";
import { RotateCcw } from "lucide-react";

export function FetchGame() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [showTooltip, setShowTooltip] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showPlayAgain, setShowPlayAgain] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const hasTriggeredEntrance = useRef(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);
  const isReducedMotion = useRef(false);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current = [];
  };

  const scheduleTimeout = (fn: () => void, delayMs: number) => {
    const t = setTimeout(fn, delayMs);
    timeoutRefs.current.push(t);
    return t;
  };

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      isReducedMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }
  }, []);

  // IntersectionObserver for one-time initial entrance animation
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggeredEntrance.current) {
            hasTriggeredEntrance.current = true;

            if (isReducedMotion.current) {
              setGameState("ready");
              setShowTooltip(true);
              return;
            }

            // Step 1 & 2: Dog trots in, Ball rolls in
            setGameState("entrance");

            // Step 3, 4, 5: Dog looks, tail wags, ball bounce
            scheduleTimeout(() => {
              // Step 6: Tooltip appears, game becomes ready
              setGameState("ready");
              setShowTooltip(true);
            }, 1800);
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(sectionEl);

    return () => {
      observer.disconnect();
      clearAllTimeouts();
    };
  }, []);

  // Handler for throwing the ball
  const handleThrowBall = useCallback(() => {
    if (gameState !== "ready") return;

    soundManager.playClick();
    clearAllTimeouts();
    setShowTooltip(false);
    setShowPlayAgain(false);

    if (isReducedMotion.current) {
      setStatusMessage("GOOD DOG!");
      setGameState("completed");
      setShowPlayAgain(true);
      return;
    }

    // State 1: Throw (ball arcs forward, show "GO GET IT!")
    setGameState("thrown");
    setStatusMessage("GO GET IT!");

    // State 2: Chase (dog turns & runs across scene)
    scheduleTimeout(() => {
      setGameState("chasing");
    }, 700);

    // State 3: Catch (dog reaches ball, scoops into mouth)
    scheduleTimeout(() => {
      setGameState("catching");
      setStatusMessage(null);
      soundManager.playNodeSelect();
    }, 2000);

    // State 4: Return (dog turns around with ball in mouth, runs back)
    scheduleTimeout(() => {
      setGameState("returning");
    }, 2650);

    // State 5: Drop (dog reaches start, drops ball with bounce, "GOOD DOG!")
    scheduleTimeout(() => {
      setGameState("completed");
      setStatusMessage("GOOD DOG!");
      soundManager.playClick();

      // Show "PLAY AGAIN"
      scheduleTimeout(() => {
        setShowPlayAgain(true);
      }, 1000);
    }, 3950);
  }, [gameState]);

  // Handler to replay the game
  const handlePlayAgain = () => {
    soundManager.playClick();
    clearAllTimeouts();
    setShowPlayAgain(false);
    setStatusMessage(null);
    setGameState("ready");
    setShowTooltip(true);
  };

  return (
    <section
      ref={sectionRef}
      id="fetch-game"
      className={styles.section}
      aria-label="A Little Play - Interactive Fetch Game"
    >
      <div className={styles.container}>
        <SectionHeading
          index="07"
          tag="A LITTLE PLAY"
          title="Even engineers take play breaks."
          subtitle="A little game before you go. Throw the ball."
        />

        {/* Compact Interactive Game Arena */}
        <div
          className={styles.playArena}
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Architectural Arena Borders & Grid Guide */}
          <div className={styles.courtHeader}>
            <div className={styles.courtStatus}>
              <span className={styles.statusDot} />
              <span className={styles.statusText}>
                {gameState === "idle" || gameState === "entrance"
                  ? "SYSTEM INITIALIZING"
                  : gameState === "ready"
                  ? "AWAITING USER INPUT"
                  : gameState === "thrown" || gameState === "chasing"
                  ? "FETCH IN PROGRESS"
                  : gameState === "catching"
                  ? "TARGET ACQUIRED"
                  : gameState === "returning"
                  ? "RETURNING TO BASE"
                  : "FETCH COMPLETED"}
              </span>
            </div>
            <span className={styles.courtCoords}>COURT: 01 // INTERACTIVE</span>
          </div>

          {/* Central Action Field */}
          <div className={styles.fieldSurface}>
            {/* Ground Baseline */}
            <div className={styles.groundLine} aria-hidden="true">
              <span className={styles.groundMarkerLeft} />
              <span className={styles.groundLineBar} />
              <span className={styles.groundMarkerRight} />
            </div>

            {/* Dynamic Status Callout Badge */}
            {statusMessage && (
              <div className={styles.bannerBadge} aria-live="assertive">
                <span className={styles.bannerText}>{statusMessage}</span>
              </div>
            )}

            {/* Dog Micro-Interaction Entity */}
            <FetchDog gameState={gameState} />

            {/* Tennis Ball Micro-Interaction Entity */}
            <FetchBall
              gameState={gameState}
              onThrow={handleThrowBall}
              showTooltip={showTooltip}
            />
          </div>

          {/* Play Again Control Bar */}
          <div
            className={`${styles.controlsBar} ${
              showPlayAgain ? styles.controlsVisible : ""
            }`}
          >
            {showPlayAgain && (
              <button
                type="button"
                className={styles.playAgainBtn}
                onClick={handlePlayAgain}
                onMouseEnter={() => soundManager.playHover()}
                aria-label="Play fetch again"
              >
                <RotateCcw size={13} className={styles.resetIcon} />
                <span>PLAY AGAIN</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
