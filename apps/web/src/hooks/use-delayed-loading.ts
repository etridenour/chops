"use client";

import { useEffect, useState } from "react";

export function useDelayedLoading(isLoading: boolean, delay = 200): boolean {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [prevIsLoading, setPrevIsLoading] = useState<boolean>(isLoading);

  if (prevIsLoading !== isLoading) {
    setPrevIsLoading(isLoading);
    setIsVisible(false);
  }

  useEffect(() => {
    if (!isLoading) return;

    const timeout = setTimeout(() => setIsVisible(true), delay);

    return () => clearTimeout(timeout);
  }, [isLoading, delay]);

  return isVisible;
}
