import type { WorkHistoryEntry } from '@/lib/types';

export function WorkHistoryTimeline({ entries }: { entries: WorkHistoryEntry[] }) {
  return (
    <div className="mt-4">
      {entries.map((entry, i) => {
        const isCurrent = entry.range.toLowerCase().includes('now');
        const isLast = i === entries.length - 1;
        return (
          <div key={entry.org} className="flex gap-2.5">
            <div className="flex flex-col items-center w-2.5 shrink-0">
              <span
                className={`size-dot rounded-full mt-1 shrink-0 ${
                  isCurrent ? 'bg-green-700' : 'bg-foreground'
                }`}
              />
              {!isLast && <span className="w-px flex-1 bg-foreground/25 mt-0.5" />}
            </div>
            <div className="flex-1 pb-2.5 min-w-0 overflow-hidden">
              <div className="flex items-baseline justify-between gap-1.5">
                <span className="text-0_7 font-semibold truncate">{entry.org}</span>
                <span className="text-0_6 text-muted-foreground shrink-0">{entry.range}</span>
              </div>
              <div className="text-0_6 text-muted-foreground mt-0.5 truncate">{entry.role}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
