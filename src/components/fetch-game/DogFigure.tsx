import { forwardRef } from "react";
import { ART, STATIC_POSES, composeDog, type RigPose } from "./rigMath";
import styles from "./playground.module.scss";

/**
 * The court dog, re-rigged from the original editorial SVG into separately transformable groups
 * (data-part="..."). Art is drawn facing right with the origin on the ground under the torso.
 * Colours come from CSS classes backed by custom properties, so day and night both work.
 * The initial transforms come from the same composeDog() the live rig uses.
 */

interface DogFigureProps {
  pose?: RigPose;
  className?: string;
}

const LEG_PATH =
  "M-4.2 0 C-4.6 8 -4.2 16 -3.8 22.5 C-3.9 25.2 -2.6 26.6 0 26.6 C2.6 26.6 4.1 25.4 4 22.5 C4.4 16 4.8 8 4.4 0 Z";

function Leg({ far = false }: { far?: boolean }) {
  return (
    <>
      <path className={far ? styles.dogFurShade : styles.dogFur} d={LEG_PATH} />
      <ellipse className={far ? styles.dogPawFar : styles.dogPaw} cx="0.8" cy="25.4" rx="4.6" ry="2.1" />
    </>
  );
}

export const DogFigure = forwardRef<SVGSVGElement, DogFigureProps>(function DogFigure(
  { pose = STATIC_POSES.sit, className },
  ref
) {
  const frame = composeDog(pose);
  const t = frame.transforms;
  const vb = ART.viewBox;

  return (
    <svg
      ref={ref}
      className={className}
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      aria-hidden="true"
      focusable="false"
    >
      <g data-part="root" transform={t.root}>
        <g data-part="body" transform={t.body}>
          <g data-part="legFarBack" transform={t.legFarBack}>
            <Leg far />
          </g>
          <g data-part="legFarFront" transform={t.legFarFront}>
            <Leg far />
          </g>

          <g data-part="tail" transform={t.tail}>
            <path
              className={styles.dogTail}
              d="M-26 -31 C-32 -35 -38 -41 -36 -49 C-34 -51 -31 -50 -30 -46 C-29 -41 -24 -35 -21 -31 Z"
            />
            <path
              className={styles.dogFurLight}
              d="M-36 -49 C-35 -51 -33 -51 -31 -49 C-32 -47 -34 -46 -35 -46 C-36 -47 -36 -48 -36 -49 Z"
            />
          </g>

          <g data-part="torso" transform={t.torso}>
            <path
              className={styles.dogFur}
              d="M-24 -29 C-24 -37 -16 -39 -2 -39 C12 -39 20 -35 24 -29 C24 -21 16 -15 0 -15 C-16 -15 -24 -21 -24 -29 Z"
            />
            <path
              className={styles.dogChest}
              d="M8 -35 C14 -33 20 -29 20 -23 C16 -19 10 -17 4 -19 C10 -23 12 -29 8 -35 Z"
            />
          </g>

          <path className={styles.dogFur} d="M12 -33 C14 -39 20 -45 26 -47 C31 -43 30 -35 24 -29 Z" />
          <path
            className={styles.dogCollar}
            d="M16 -37 C18 -39 23 -40 28 -39 C28 -37 27 -35 26 -33 C22 -34 18 -35 16 -37 Z"
          />
          <g data-part="tag" transform={t.tag}>
            <circle className={styles.dogTagGlow} cx="23" cy="-33" r="4.8" />
            <circle className={styles.dogTag} cx="23" cy="-33" r="2.2" />
          </g>

          <g data-part="legNearBack" transform={t.legNearBack}>
            <Leg />
          </g>
          <ellipse
            data-part="haunch"
            className={styles.dogHaunch}
            cx="-14"
            cy="-22"
            rx="10.5"
            ry="8.5"
            opacity={frame.haunchOpacity}
          />
          <g data-part="legNearFront" transform={t.legNearFront}>
            <Leg />
          </g>

          <g data-part="head" transform={t.head}>
            <path
              className={styles.dogFur}
              d="M20 -49 C20 -57 27 -61 36 -59 C44 -57 49 -51 49 -45 C49 -39 43 -35 34 -35 C26 -35 20 -41 20 -49 Z"
            />
            <ellipse className={styles.dogMouth} cx="43.5" cy="-39.6" rx="6" ry="2.8" />
            <g data-part="jaw" transform={t.jaw}>
              <path
                className={styles.dogFurLight}
                d="M36 -39 C40 -37.5 46 -37.5 49.5 -40.5 C49 -38 46 -35.5 41 -35.5 C38.5 -35.5 36.5 -37 36 -39 Z"
              />
              <g data-part="tongue" transform={t.tongue} opacity={frame.tongueOpacity}>
                <path className={styles.dogTongue} d="M44 -39 C44 -35 47 -34 48 -36 C49 -38 47 -39 44 -39 Z" />
              </g>
            </g>
            <path
              className={styles.dogFurLight}
              d="M36 -51 C40 -51 50 -49 51 -45 C51 -41 46 -37 38 -37 C34 -37 32 -41 36 -51 Z"
            />
            <ellipse className={styles.dogInk} cx="50" cy="-46" rx="3" ry="2.2" />
            <circle className={styles.dogShine} cx="49.3" cy="-46.7" r="0.7" />
            <path className={styles.dogLine} d="M43 -40 Q46 -38 49 -42" />
            <g data-part="eyes" transform={t.eyes}>
              <circle className={styles.dogInk} cx="35" cy="-52" r="2.8" />
              <circle className={styles.dogShine} cx="34.2" cy="-52.8" r="1" />
            </g>
            <path
              data-part="eyelid"
              className={styles.dogLine}
              d="M32.4 -51.6 Q35 -49.8 37.6 -51.6"
              opacity={frame.eyelidOpacity}
            />
            <path data-part="brow" className={styles.dogBrow} transform={t.brow} d="M32 -56 Q35 -58 38 -56" />
            <g data-part="ear" transform={t.ear}>
              <path
                className={styles.dogFurDark}
                d="M24 -56 C20 -53 16 -45 18 -37 C19 -33 23 -32 25 -35 C28 -39 30 -47 29 -54 Z"
              />
              <path
                className={styles.dogEarInner}
                d="M23 -51 C21 -48 19 -42 21 -37 C22 -35 24 -35 25 -37 C27 -40 28 -46 27 -51 Z"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
});
