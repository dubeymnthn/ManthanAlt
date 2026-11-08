"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * false during SSR and hydration, true afterwards (and immediately for components
 * mounted later on the client). Lets client-only UI render a stable placeholder first
 * without an extra effect + state round-trip.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
