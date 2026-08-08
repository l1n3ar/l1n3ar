import { TimelineDot } from '@/components/v2/timeline-dot';
import type { WorkHistoryEntry } from '@/lib/types';

export function WorkHistory({ entries }: { entries: WorkHistoryEntry[] }) {
  return (
    <div>
      <h1 className="text-0_9 font-semibold mb-3.5">Work experience</h1>

      <div>
        {entries.map((entry, i) => {
          const isCurrent = entry.range.toLowerCase().includes('now');
          const isLast = i === entries.length - 1;
          return (
            <div key={entry.org} className="flex gap-3">
              <TimelineDot isLast={isLast} dotClassName={isCurrent ? 'bg-green-700' : 'bg-foreground'} />
              <div className="flex-1 pb-5 min-w-0">
                <div className="flex items-baseline justify-between gap-1.5 flex-wrap">
                  <span className="text-0_8 font-semibold">{entry.org}</span>
                  <span className="text-0_7 text-muted-foreground shrink-0">{entry.range}</span>
                </div>
                <div className="text-0_7 text-muted-foreground mt-0.5">{entry.role}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
