import { useId } from "react";
import styles from "./playground.module.scss";

/**
 * Tennis ball art. Three nested groups let the engine layer the motion: impact squash
 * (about the contact point), velocity stretch, and spin (matter's body.angle). The highlight
 * sits outside the spin group so the light stays put while the seams roll.
 */
export function BallFigure({ className }: { className?: string }) {
  const gradientId = `court-ball-shine-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <svg className={className} viewBox="-12 -12 24 24" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={gradientId} cx="34%" cy="30%" r="62%">
          <stop offset="0%" style={{ stopColor: "var(--ball-shine)", stopOpacity: 0.75 }} />
          <stop offset="100%" style={{ stopColor: "var(--ball-shine)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <g data-part="squash">
        <g data-part="stretch">
          <g data-part="spin">
            <circle className={styles.ballFelt} r="12" />
            <path className={styles.ballSeam} d="M-7.7 -8.6 C-2.6 -3.4 -2.6 3.4 -7.7 8.6" />
            <path className={styles.ballSeam} d="M7.7 -8.6 C2.6 -3.4 2.6 3.4 7.7 8.6" />
            <path className={styles.ballSeamLight} d="M-7.1 -8.1 C-2.1 -3 -2.1 3 -7.1 8.1" />
          </g>
          <circle cx="-2.4" cy="-3" r="9.5" fill={`url(#${gradientId})`} />
          <circle className={styles.ballRim} r="11.6" />
        </g>
      </g>
    </svg>
  );
}
