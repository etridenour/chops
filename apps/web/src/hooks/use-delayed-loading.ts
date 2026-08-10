"use client";

import { useEffect, useState } from "react";

/**
 * Holds a loading flag back until a request has been running long enough to be
 * worth showing. A request that finishes faster than `delay` never reports true,
 * so fast responses don't flash an indicator on and off.
 *
 * Asymmetric on purpose: slow to appear, instant to disappear.
 */
export function useDelayedLoading(isLoading: boolean, delay = 200): boolean {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading) {
      setIsVisible(false);
      return;
    }

    const timeout = setTimeout(() => setIsVisible(true), delay);

    // Runs when isLoading flips back to false. A request that finished inside
    // the delay window cancels its own timer before it ever fired.
    return () => clearTimeout(timeout);
  }, [isLoading, delay]);

  return isVisible;
}
