"use client";

import React from "react";
import styles from "./fetch-game.module.scss";
import { GameState } from "./FetchDog";
import { soundManager } from "@/lib/sound";

interface FetchBallProps {
  gameState: GameState;
  onThrow: () => void;
  showTooltip: boolean;
}

export const FetchBall: React.FC<FetchBallProps> = ({
  gameState,
  onThrow,
  showTooltip,
}) => {
  const isReady = gameState === "ready";
  const isHidden = gameState === "returning";

  const handleClick = () => {
    if (!isReady) return;
    onThrow();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isReady) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onThrow();
    }
  };

  return (
    <div
      className={`${styles.ballContainer} ${styles[`ballState_${gameState}`]} ${
        isHidden ? styles.ballHidden : ""
      }`}
    >
      {/* Tooltip above the ball */}
      <div
        className={`${styles.tooltip} ${showTooltip && isReady ? styles.tooltipVisible : ""}`}
        role="tooltip"
        id="fetch-ball-tooltip"
        aria-hidden={!showTooltip || !isReady}
      >
        <span className={styles.tooltipText}>TAP THE BALL — PLAY FETCH</span>
        <span className={styles.tooltipArrow} aria-hidden="true" />
      </div>

      {/* Accessible Interactive Ball Button */}
      <button
        type="button"
        className={`${styles.ballButton} ${isReady ? styles.ballInteractive : ""}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => {
          if (isReady) soundManager.playHover();
        }}
        disabled={!isReady}
        aria-label="Throw the tennis ball to play fetch with the dog"
        aria-describedby="fetch-ball-tooltip"
      >
        {/* Pulsing ring indicator when ready to throw */}
        {isReady && <span className={styles.pulseRing} aria-hidden="true" />}

        {/* Tennis Ball SVG */}
        <svg
          viewBox="0 0 36 36"
          className={styles.ballSvg}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Contact Shadow */}
          <ellipse
            cx="18"
            cy="33"
            rx="11"
            ry="2.5"
            className={styles.ballShadow}
          />

          {/* Main Chartreuse Tennis Ball Body */}
          <circle cx="18" cy="17" r="14" fill="#B7DB72" />

          {/* Subtle 3D Volume Gradient Highlight */}
          <circle
            cx="14"
            cy="13"
            r="12"
            fill="url(#ballHighlight)"
            opacity="0.45"
          />

          {/* Curved Tennis Ball Seam Lines */}
          <path
            d="M9 7 C15 13 15 21 9 27"
            stroke="#8EAF48"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M27 7 C21 13 21 21 27 27"
            stroke="#8EAF48"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Seam Depth Accent */}
          <path
            d="M9.5 7.5 C15.5 13.5 15.5 20.5 9.5 26.5"
            stroke="#FFFFFF"
            strokeWidth="0.6"
            strokeLinecap="round"
            opacity="0.5"
            fill="none"
          />

          <defs>
            <radialGradient
              id="ballHighlight"
              cx="35%"
              cy="35%"
              r="60%"
              fx="30%"
              fy="30%"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#B7DB72" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </button>
    </div>
  );
};
