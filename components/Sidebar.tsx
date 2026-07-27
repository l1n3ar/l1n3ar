'use client';
import { useRef } from 'react';
import { RecDialog, type RecDialogHandle } from './rec-dialog';
import type { WorkHistoryEntry, Recommendation } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { kicker, metaItalic } from '@/lib/typography';

const REC_PREVIEW_LEN = 90;

export function Sidebar({ about, history, recs }: { about: string; history: WorkHistoryEntry[]; recs: Recommendation[] }) {
  const recDialogRef = useRef<RecDialogHandle>(null);

  return (
    <div className="gz-scroll border-r border-g py-4 px-6 flex flex-col min-h-0 overflow-auto">
      <div className={`${kicker} mb-1.5`}>about</div>
      <p className="text-0_8 leading-relaxed mb-4 pb-3.5 border-b border-g/25">{about}</p>

      <div className={`${kicker} mb-1.5`}>history</div>
      <div>
        {history.map((w) => (
          <div key={w.org} className="py-1.5 border-b border-g/14">
            <div className="flex justify-between gap-2.5">
              <span className="text-0_9 leading-tight">{w.org}</span>
              <span className={`${metaItalic} text-ink/48 whitespace-nowrap shrink-0`}>{w.range}</span>
            </div>
            <div className={kicker}>{w.role}</div>
          </div>
        ))}
      </div>

      <div className={`${kicker} mt-4 mb-1.5 pt-3 border-t border-g/25`}>recommendations</div>
      <div className="gz-scroll flex-1 min-h-20 overflow-auto pr-0.5">
        {recs.map((r) => {
          const long = r.quote.length > REC_PREVIEW_LEN;
          const short = long ? r.quote.slice(0, REC_PREVIEW_LEN) + '…' : r.quote;
          return (
            <div key={r.who} className="mb-3 pb-2.5 border-b border-g/12">
              <p className="font-heading italic text-sm leading-snug mb-1">&ldquo;{short}&rdquo;</p>
              <div className="flex items-baseline gap-2.5">
                <span className={`${metaItalic} text-ink/50`}>— {r.who}</span>
                {long && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-0_7 underline"
                    onClick={() => recDialogRef.current?.open(r.quote, r.who)}
                  >
                    read more
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <RecDialog ref={recDialogRef} />
    </div>
  );
}
