"use client";

import { useEffect, useRef, useState } from "react";

export function usePersistentState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const isHydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        setValue(JSON.parse(raw));
      }
    } catch (error) {
      console.warn("Failed to hydrate state from localStorage", error);
    } finally {
      isHydrated.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isHydrated.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Failed to persist state to localStorage", error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
