'use client';
import { useRef, useState, type PointerEvent } from 'react';

// The panel's default open height also doubles as the resize floor — dragging can only grow it.
const DEFAULT_ASK_PANEL_HEIGHT = 340;

export function useAskPanelResize() {
  const [askPanelHeight, setAskPanelHeight] = useState(DEFAULT_ASK_PANEL_HEIGHT);
  const [isResizingAsk, setIsResizingAsk] = useState(false);
  const isResizingAskRef = useRef(false);
  const workColumnRef = useRef<HTMLDivElement>(null);

  const startAskResize = (e: PointerEvent) => {
    isResizingAskRef.current = true;
    setIsResizingAsk(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onAskResizeMove = (e: PointerEvent) => {
    // Gate on a ref, not the isResizingAsk state — a fast drag can fire pointermove
    // before React commits the state update from pointerdown, dropping the first move(s).
    if (!isResizingAskRef.current || !workColumnRef.current) return;
    const containerRect = workColumnRef.current.getBoundingClientRect();

    const headerEl = workColumnRef.current.querySelector('[data-ask-panel-header]');
    const headerHeight = headerEl?.getBoundingClientRect().height ?? 0;
    // The dragged distance covers the header + body together — only the body portion
    // is the dynamic grid row, so the header's real height must be subtracted out,
    // otherwise the panel ends up taller than the cursor position implies.
    const desiredBodyHeight = containerRect.bottom - e.clientY - headerHeight;

    const handleEl = workColumnRef.current.querySelector('.cursor-row-resize');
    const handleHeight = handleEl?.getBoundingClientRect().height ?? 0;

    // Cap growth at a real, visible landmark — "WorkLog shows just its header plus its
    // first project" — measured directly off the rendered DOM, rather than assembled from
    // separately measured/guessed heights that can drift out of sync with each other.
    const workLogHeaderEl = workColumnRef.current.querySelector('[data-worklog-header]');
    const firstProjectEl = workLogHeaderEl?.nextElementSibling?.firstElementChild;
    const firstProjectBottom = firstProjectEl?.getBoundingClientRect().bottom
      ?? workLogHeaderEl?.getBoundingClientRect().bottom
      ?? containerRect.top;
    const maxHeight = containerRect.bottom - firstProjectBottom - handleHeight - headerHeight;

    setAskPanelHeight(Math.min(Math.max(desiredBodyHeight, DEFAULT_ASK_PANEL_HEIGHT), maxHeight));
  };

  const endAskResize = () => {
    isResizingAskRef.current = false;
    setIsResizingAsk(false);
  };

  return {
    workColumnRef,
    askPanelHeight,
    isResizingAsk,
    startAskResize,
    onAskResizeMove,
    endAskResize,
  };
}
