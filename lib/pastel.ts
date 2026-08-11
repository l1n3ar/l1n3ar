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

const HEAT_LEVELS_LIGHT = [{ l: 0.90, c: 0.035 }, { l: 0.82, c: 0.06 }, { l: 0.72, c: 0.09 }, { l: 0.60, c: 0.12 }];
const HEAT_LEVELS_DARK = [{ l: 0.30, c: 0.035 }, { l: 0.40, c: 0.06 }, { l: 0.52, c: 0.09 }, { l: 0.66, c: 0.12 }];

/** Inline style for the `.heat-cell` utility (see globals.css) — a 4-step pastel intensity scale
 * (level 1-4) on a fixed hue, for heatmap-style visualizations like the GitHub contribution grid. */
export function heatLevelStyle(hue: number, level: 1 | 2 | 3 | 4): CSSProperties {
  const light = HEAT_LEVELS_LIGHT[level - 1];
  const dark = HEAT_LEVELS_DARK[level - 1];
  return {
    '--heat-bg': `oklch(${light.l} ${light.c} ${hue})`,
    '--heat-bg-dark': `oklch(${dark.l} ${dark.c} ${hue})`,
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
