import { useCallback, useEffect, useState } from "react";

export const STEPS = [
  "entered", // passed the top-secret gate
  "ch1", // chapter 1 read, clue circle found
  "game1", // catch the red circle mini-game
  "ch2", // blocked quiz + story
  "game2", // avoid the block mini-game
  "ch3", // best friends — there's more
  "ch4", // she said yes
  "quiz", // avni test passed
  "wedding", // wedding chapter seen
  "ch5", // adventures seen
  "report", // avni report seen
  "game3", // cleaning challenge mini-game
  "opened", // love letter read
  "game4", // red circle maze mini-game
  "final", // final photo revealed
] as const;

export type Step = (typeof STEPS)[number];

const KEY = "avni-red-circle-progress-v2";

export function useStoryProgress() {
  const [done, setDone] = useState<Step[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDone(JSON.parse(raw) as Step[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((next: Step[]) => {
    setDone(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const unlock = useCallback((step: Step) => {
    setDone((prev) => {
      if (prev.includes(step)) return prev;
      const next = [...prev, step];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const has = useCallback((step: Step) => done.includes(step), [done]);

  const reset = useCallback(() => {
    persist([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, [persist]);

  return { done, has, unlock, reset, hydrated };
}
