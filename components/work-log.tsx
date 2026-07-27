'use client';
import type { Project } from '@/lib/schema';

export function WorkLog({
  projects, onSelect, onOpenIndex,
}: { projects: Project[]; onSelect: (id: string) => void; onOpenIndex: () => void }) {
  const shown = projects.filter((p) => p.featured);
  return (
    <>
      <div className="px-8 pt-5 pb-1.5 flex items-baseline gap-2.5 shrink-0">
        <div className="font-heading italic text-0_8 text-g">work</div>
        <span className="font-heading italic text-xs text-ink/45 whitespace-nowrap shrink-0">{shown.length} of {projects.length}</span>
        <button type="button" onClick={onOpenIndex} className="font-heading italic text-xs text-g border-b border-g/40 ml-auto whitespace-nowrap shrink-0">
          view full index →
        </button>
      </div>
      <div className="flex-[1.3] min-h-0 px-8 pb-3 overflow-auto gz-scroll">
        {shown.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className="block w-full text-left bg-transparent border-0 border-b border-g/16 py-2.5 px-2.5 cursor-pointer hover:bg-g/7"
          >
            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-1_2">{p.name}</span>
              <span className="font-heading italic text-0_7 text-ink/42 ml-auto">{p.year}</span>
            </div>
            <div className="text-0_8 leading-snug text-ink/68 mt-0.5">{p.line}</div>
          </button>
        ))}
      </div>
    </>
  );
}
