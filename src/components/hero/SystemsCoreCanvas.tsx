"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SystemsCore3D } from "./SystemsCore3D";
import styles from "./HeroSection.module.scss";

export function SystemsCoreCanvas() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  return (
    <div className={styles.canvasContainer}>
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SystemsCore3D onHoverModule={setActiveModule} />
        </Suspense>
      </Canvas>

      {/* Real-Time Telemetry HUD Overlay */}
      <div className={styles.telemetryOverlay} aria-hidden="true">
        <div className={styles.telemetryBadge}>
          <span className={styles.telemetryDot} />
          <span className={styles.telemetryTitle}>CORE_MESH:</span>
          <span className={styles.telemetryValue}>
            {activeModule ? `ACTIVE [${activeModule}]` : "SYSTEMS_STABLE / 60 FPS"}
          </span>
        </div>
        <div className={styles.coordinates}>
          <span>NODE: R3F_V9</span>
          <span className={styles.sep}>/</span>
          <span>GEOM: PROCEDURAL</span>
        </div>
      </div>
    </div>
  );
}
