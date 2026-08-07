'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ICON_STROKE } from '@/components/v2/constants';
import { TimelineDot } from '@/components/v2/timeline-dot';
import { cn, slugify } from '@/lib/utils';
import type { Project } from '@/lib/types';

export function SectionToc({ project }: { project: Project }) {
  const [open, setOpen] = useState(true);
  const sections = (project.body ?? [])
    .filter((b) => b._type === 'caseSection')
    .map((b) => ({ id: slugify(b.heading), heading: b.heading }));
  if (sections.length < 2) return null;

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sticky top-0 z-10 mb-4 bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 py-1 text-0_6 font-semibold text-muted-foreground uppercase tracking-wide"
      >
        Jump to a section
        <ChevronDown className={cn('size-icon-xs transition-transform', open && 'rotate-180')} strokeWidth={ICON_STROKE} />
      </button>

      <div className={cn('grid transition-[grid-template-rows] duration-200 ease-out', open ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">
          <ol className="bg-muted text-foreground rounded-lg p-3">
            {sections.map((s, i) => {
              const isLast = i === sections.length - 1;
              return (
                <li key={s.id} className="flex gap-2.5">
                  <TimelineDot isLast={isLast} dotClassName="bg-foreground/60" />
                  <button
                    type="button"
                    onClick={() => jumpTo(s.id)}
                    className="flex-1 min-w-0 text-left text-0_7 capitalize text-foreground/80 truncate pb-2.5 hover:text-foreground"
                  >
                    {s.heading}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
