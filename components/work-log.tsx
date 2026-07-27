'use client';
import type { Project } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { kicker, metaItalic } from '@/lib/typography';

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
          variant="ghost"
          size="sm"
          onClick={onOpenIndex}
          className="p-0 h-auto text-g hover:text-g/80 border-b border-g/40 rounded-none ml-auto whitespace-nowrap shrink-0"
        >
          view full index →
        </Button>
      </div>
      <div className="flex-[1.3] min-h-0 px-8 pb-3 overflow-auto gz-scroll">
        {shown.map((p) => (
          <Button
            key={p.id}
            variant="ghost"
            onClick={() => onSelect(p.id)}
            className="block w-full text-ink text-left h-auto rounded-none border-0 border-b border-g/16 py-2.5 px-2.5 hover:bg-g/7"
          >
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-1_2">{p.name}</span>
              <span className={`${metaItalic} text-ink/42 ml-auto`}>{p.year}</span>
            </div>
            <div className="text-0_8 leading-snug text-ink/68 mt-0.5">{p.line}</div>
          </Button>
        ))}
      </div>
    </>
  );
}
