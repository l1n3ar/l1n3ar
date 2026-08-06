'use client';
import { Progress } from '@/components/ui/progress';
import { getCitations, type Citation } from '@/lib/citations';

export { getCitations, type Citation };

export function CitationsMarker({ citations }: { citations: Citation[] }) {


  return (
    <div className="relative max-w-[80%] ml-7 rounded-sm py-1 pl-2 border-l-2 border-g">
      <div className="flex items-center gap-2 text-0_6 text-ink/35 not-italic uppercase tracking-wide px-1.5 pb-1 mb-1 border-b border-g/20">
        <span className="flex-1">source</span>
        <span className="w-16 shrink-0 text-right">confidence</span>
      </div>

      <div
        className="flex flex-col max-h-28 overflow-y-auto gz-scroll">
        {citations.map((c) => {
          const pct = Math.round(c.score * 100);
          return (
            <div key={c.source} className="flex items-center gap-2 text-0_6 text-ink/50 italic rounded-sm px-1.5 py-0.5">
              <span className="truncate flex-1">{c.label}</span>
              <Progress value={pct} className="w-10 shrink-0" />
              <span className="text-ink/35 shrink-0 font-mono not-italic w-6 text-right">{pct}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
