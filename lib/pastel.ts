import type { CSSProperties } from 'react';

/** Deterministic 0–360 hue from any string key, so a given item always lands on the same hue. */
export function hueForKey(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 360;
}

/** Inline style for the `.pastel-chip` utility (see globals.css) — light/dark swap follows the existing `.dark` cascade. */
export function pastelChipStyle(hue: number): CSSProperties {
  return {
    '--pastel-bg': `oklch(0.93 0.032 ${hue})`,
    '--pastel-fg': `oklch(0.49 0.075 ${hue})`,
    '--pastel-bg-dark': `oklch(0.28 0.035 ${hue})`,
    '--pastel-fg-dark': `oklch(0.76 0.07 ${hue})`,
  } as CSSProperties;
}

/** Shorthand for the common `pastelChipStyle(hueForKey(key))` pairing. */
export function keyedPastelChipStyle(key: string): CSSProperties {
  return pastelChipStyle(hueForKey(key));
}

/** Inline style for the `.tile-pastel` utility (see globals.css) — light mode is a flat washed-out
 * pastel; dark mode (handled entirely in CSS) swaps to a hue-tinted gradient via --tile-hue. */
export function tilePastel(hue: number): CSSProperties {
  return {
    '--tile-bg': `oklch(0.95 0.024 ${hue})`,
    '--tile-hue': hue,
  } as CSSProperties;
}

/** Fixed per-tile hues from the design handoff prototype, so tile color never depends on section order. */
export const HOME_TILE_HUES = {
  projects: 260,
  ask: 330,
  metrics: 60,
  work: 200,
  recommendations: 20,
  l1n3ar: 145,
} as const;
