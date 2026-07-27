import type { TechIconMap } from './schema';

export type ResolvedIcon =
  | { type: 'img'; src: string; label: string }
  | { type: 'mono'; mark: string; label: string };

/**
 * Resolves a tech name to a real brand icon (via simpleicons.org) using the
 * tech-icons.json config, or a monogram fallback if unmapped. Never
 * hardcode tech->slug pairs in a component — edit content/tech-icons.json.
 */
export function resolveIcon(tech: string, iconMap: TechIconMap): ResolvedIcon {
  const entry = iconMap[tech.toLowerCase()];
  if (entry?.slug) {
    return { type: 'img', label: tech, src: `https://cdn.simpleicons.org/${entry.slug}/0b3d2e` };
  }
  return { type: 'mono', label: tech, mark: tech.slice(0, 2).toUpperCase() };
}
