import { ArrowUpRight } from 'lucide-react';
import { ICON_STROKE } from '@/components/v2/constants';

/** Swap this out whenever there's a new project to spotlight. */
const CURRENT_PROJECT = {
  name: 'shadcn n-way switch',
  tagline: 'A multi-state switch component built on shadcn/ui',
  url: 'https://shadcn-nway-switch.vercel.app/',
};

export function CurrentProjectBanner() {
  return (
    <a
      href={CURRENT_PROJECT.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-fit items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-left text-foreground shadow-sm hover:bg-muted"
    >
      <span className="text-0_7 font-semibold text-foreground shrink-0">{CURRENT_PROJECT.name}</span>
      <span className="text-0_7 text-muted-foreground truncate">— {CURRENT_PROJECT.tagline}</span>
      <ArrowUpRight
        className="size-icon-xs shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={ICON_STROKE}
      />
    </a>
  );
}
