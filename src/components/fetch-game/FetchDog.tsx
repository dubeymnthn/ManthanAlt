"use client";

import React from "react";
import styles from "./fetch-game.module.scss";

export type GameState =
  | "idle"
  | "entrance"
  | "ready"
  | "thrown"
  | "chasing"
  | "catching"
  | "returning"
  | "completed";

interface FetchDogProps {
  gameState: GameState;
}

export const FetchDog: React.FC<FetchDogProps> = ({ gameState }) => {
  const isRunning = gameState === "chasing" || gameState === "returning";
  const hasBallInMouth = gameState === "returning";
  const isWagging = gameState === "ready" || gameState === "completed" || gameState === "entrance";
  const isAlert = gameState === "thrown";
  const isCatching = gameState === "catching";

  return (
    <div
      className={`${styles.dogContainer} ${styles[`dogState_${gameState}`]}`}
      aria-hidden="true"
    >
      <div className={`${styles.dogVisual} ${isRunning ? styles.running : ""} ${isAlert ? styles.alert : ""} ${isCatching ? styles.catching : ""}`}>
        <svg
          viewBox="0 0 110 80"
          className={styles.dogSvg}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground Contact Shadow */}
          <ellipse
            cx="52"
            cy="74"
            rx="32"
            ry="4.5"
            className={styles.dogShadow}
          />

          {/* Back Left Leg (Far side) */}
          <g className={`${styles.leg} ${styles.legBackLeft}`}>
            <path
              d="M30 46 C27 52 24 60 22 71 C22 72.5 26 73 28 72 C30 65 34 56 36 49 Z"
              fill="#AF6834"
            />
            {/* Paw */}
            <ellipse cx="24" cy="72" rx="4" ry="2" fill="#995627" />
          </g>

          {/* Front Left Leg (Far side) */}
          <g className={`${styles.leg} ${styles.legFrontLeft}`}>
            <path
              d="M62 46 C61 54 60 62 59 71 C59 72.5 63 73 65 72 C66 64 67 56 68 48 Z"
              fill="#AF6834"
            />
            {/* Paw */}
            <ellipse cx="61" cy="72" rx="3.5" ry="2" fill="#995627" />
          </g>

          {/* Wagging Tail */}
          <g className={`${styles.tailGroup} ${isWagging ? styles.wagging : ""}`}>
            <path
              d="M22 42 C16 38 10 32 12 24 C14 22 17 23 18 27 C19 32 24 38 27 42 Z"
              fill="#C87A3D"
            />
            {/* Tail Tip (Lighter Cream) */}
            <path
              d="M12 24 C13 22 15 22 17 24 C16 26 14 27 13 27 C12 26 12 25 12 24 Z"
              fill="#E8A870"
            />
          </g>

          {/* Main Torso / Body */}
          <path
            d="M24 44 C24 36 32 34 46 34 C60 34 68 38 72 44 C72 52 64 58 48 58 C32 58 24 52 24 44 Z"
            fill="#D48B55"
          />

          {/* Chest Patch / Lighter Editorial Accent */}
          <path
            d="M56 38 C62 40 68 44 68 50 C64 54 58 56 52 54 C58 50 60 44 56 38 Z"
            fill="#E8A870"
            opacity="0.9"
          />

          {/* Chartreuse Collar */}
          <path
            d="M64 36 C66 34 71 33 76 34 C76 36 75 38 74 40 C70 39 66 38 64 36 Z"
            fill="#B7DB72"
          />
          {/* Gold / Brass Tag */}
          <circle cx="71" cy="40" r="2.2" fill="#72953F" />

          {/* Back Right Leg (Near side) */}
          <g className={`${styles.leg} ${styles.legBackRight}`}>
            <path
              d="M34 45 C32 51 28 60 27 71 C27 73 32 73.5 34 72 C37 64 41 55 43 47 Z"
              fill="#D48B55"
            />
            {/* Paw */}
            <ellipse cx="30" cy="72" rx="4.5" ry="2" fill="#AF6834" />
          </g>

          {/* Front Right Leg (Near side) */}
          <g className={`${styles.leg} ${styles.legFrontRight}`}>
            <path
              d="M68 45 C68 53 68 62 68 71 C68 73 73 73 74 71.5 C75 63 76 54 76 46 Z"
              fill="#D48B55"
            />
            {/* Paw */}
            <ellipse cx="71" cy="72" rx="4" ry="2" fill="#AF6834" />
          </g>

          {/* Head & Neck */}
          <g className={styles.headGroup}>
            {/* Neck Connection */}
            <path
              d="M60 40 C62 34 68 28 74 26 C79 30 78 38 72 44 Z"
              fill="#D48B55"
            />

            {/* Head Contour */}
            <path
              d="M68 24 C68 16 75 12 84 14 C92 16 97 22 97 28 C97 34 91 38 82 38 C74 38 68 32 68 24 Z"
              fill="#D48B55"
            />

            {/* Snout / Muzzle */}
            <path
              d="M84 22 C88 22 98 24 99 28 C99 32 94 36 86 36 C82 36 80 32 84 22 Z"
              fill="#E8A870"
            />

            {/* Nose */}
            <ellipse cx="98" cy="27" rx="3" ry="2.2" fill="#1D2921" />
            <circle cx="97.3" cy="26.3" r="0.7" fill="#FFFFFF" opacity="0.6" />

            {/* Friendly Eye */}
            <circle cx="83" cy="21" r="2.8" fill="#1D2921" />
            <circle cx="82.2" cy="20.2" r="1" fill="#FFFFFF" />

            {/* Eyebrow Accent (Editorial expression) */}
            <path
              d="M80 17 Q83 15 86 17"
              stroke="#995627"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Mouth / Smile */}
            <path
              d="M91 33 Q94 35 97 31"
              stroke="#1D2921"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
            />

            {/* Happy Panting Tongue */}
            {(isWagging || isCatching) && (
              <path
                d="M92 34 C92 38 95 39 96 37 C97 35 95 34 92 34 Z"
                fill="#E88B8B"
              />
            )}

            {/* Ball Held in Mouth (When returning) */}
            {hasBallInMouth && (
              <g className={styles.mouthBall}>
                <circle cx="98" cy="32" r="6.5" fill="#B7DB72" />
                <path
                  d="M94 28 Q98 32 94 36"
                  stroke="#8EAF48"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M102 28 Q98 32 102 36"
                  stroke="#8EAF48"
                  strokeWidth="1"
                  fill="none"
                />
              </g>
            )}

            {/* Floppy Ear (Over top of head) */}
            <g className={`${styles.earGroup} ${isRunning ? styles.earFlapping : ""}`}>
              <path
                d="M72 17 C68 20 64 28 66 36 C67 40 71 41 73 38 C76 34 78 26 77 19 Z"
                fill="#AF6834"
              />
              {/* Inner Ear Tone */}
              <path
                d="M71 22 C69 25 67 31 69 36 C70 38 72 38 73 36 C75 33 76 27 75 22 Z"
                fill="#C37840"
                opacity="0.8"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
