"use client";

import { useEffect, useRef, useState } from "react";

type UseSmoothStreamTextOptions = {
  sourceText: string;
  enabled?: boolean;
};

export function useSmoothStreamText({
  sourceText,
  enabled = true,
}: UseSmoothStreamTextOptions) {
  const [displayedText, setDisplayedText] = useState(sourceText);
  const rafRef = useRef<number | null>(null);
  const indexRef = useRef(sourceText.length);
  const sourceRef = useRef(sourceText);

  useEffect(() => {
    sourceRef.current = sourceText;

    if (!enabled) {
      indexRef.current = sourceText.length;
      setDisplayedText(sourceText);
      return;
    }

    if (sourceText.length < indexRef.current) {
      indexRef.current = 0;
      setDisplayedText("");
    }

    const step = () => {
      const currentSource = sourceRef.current;

      if (indexRef.current >= currentSource.length) {
        rafRef.current = null;
        return;
      }

      const remaining = currentSource.length - indexRef.current;
      const chunkSize =
        remaining > 280 ? 10 : remaining > 160 ? 7 : remaining > 60 ? 4 : 1;
      const nextIndex = Math.min(
        indexRef.current + chunkSize,
        currentSource.length,
      );

      indexRef.current = nextIndex;
      setDisplayedText(currentSource.slice(0, nextIndex));

      rafRef.current = requestAnimationFrame(step);
    };

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(step);
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [enabled, sourceText]);

  return displayedText;
}
