'use client';
import { useRef, useState, type PointerEvent } from 'react';

// Neither pane can be dragged past this — the divider's range is the middle third
// of the container, so it can reach 1/3 or 2/3 of the available width, never further.
const MIN_PERCENT = 100 / 3;
const MAX_PERCENT = 200 / 3;

export function useSplitResize(initial = 60) {
  const [leftPercent, setLeftPercent] = useState(initial);
  const isResizingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startResize = (e: PointerEvent) => {
    isResizingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onResizeMove = (e: PointerEvent) => {
    if (!isResizingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    setLeftPercent(Math.min(Math.max(percent, MIN_PERCENT), MAX_PERCENT));
  };

  const endResize = () => {
    isResizingRef.current = false;
  };

  return { containerRef, leftPercent, startResize, onResizeMove, endResize };
}
