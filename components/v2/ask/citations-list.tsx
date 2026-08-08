import { Progress } from '@/components/ui/progress';
import type { Citation } from '@/lib/citations';

export function CitationsList({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;
  return (
    <div className="w-full min-w-0 max-w-[85%] ml-8 border-l-2 border-border pl-2 py-1 mb-4">
      <div className="flex items-center gap-2 min-w-0 text-0_625 text-muted-foreground/70 uppercase tracking-wide px-1 pb-1 mb-1 border-b border-border">
        <span className="flex-1 min-w-0">source</span>
        <span className="w-14 shrink-0 text-right">confidence</span>
      </div>
      <div className="flex flex-col gap-0.5 min-w-0 max-h-24 overflow-y-auto overflow-x-hidden gz-scroll">
        {citations.map((c) => {
          const pct = Math.round(c.score * 100);
          return (
            <div key={c.source} className="flex items-center gap-2 min-w-0 text-0_65 text-muted-foreground px-1 font-light">
              <span className="truncate min-w-0 flex-1">{c.label}</span>
              <Progress value={pct} className="w-10 shrink-0" indicatorClassName="bg-green-700 dark:bg-green-500" />
              <span className="text-muted-foreground/70 shrink-0 font-mono w-6 text-right">{pct}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
