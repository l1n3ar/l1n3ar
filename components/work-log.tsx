'use client';
import type { Project } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { ProjectRow } from './project-row';
import { kicker, linkButtonClass } from '@/lib/typography';

export function WorkLog({
  projects, onSelect, onOpenIndex,
}: { projects: Project[]; onSelect: (id: string) => void; onOpenIndex: () => void }) {
  const shown = projects.filter((p) => p.featured);
  return (
    <>
      <div className="px-8 pt-5 pb-1.5 flex items-baseline gap-2.5 shrink-0">
        <div className={kicker}>work</div>
        <span className="font-heading italic text-xs text-ink/45 whitespace-nowrap shrink-0">{shown.length} of {projects.length}</span>
        <Button
          variant="link"
          onClick={onOpenIndex}
          className={`${linkButtonClass} ml-auto whitespace-nowrap shrink-0`}
        >
          view full index →
        </Button>
      </div>
      <div className="flex-[1.3] min-h-0 px-8 pb-3 overflow-y-auto overflow-x-hidden gz-scroll">
        {shown.map((p) => <ProjectRow key={p.id} project={p} onSelect={onSelect} variant="primary" />)}
      </div>
    </>
  );
}
