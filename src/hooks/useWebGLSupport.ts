"use client";

import { useEffect, useState } from "react";

export function useWebGLSupport(): boolean {
  const [hasSupport, setHasSupport] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setHasSupport(Boolean(gl));
    } catch {
      setHasSupport(false);
    }
  }, []);

  return hasSupport;
}
