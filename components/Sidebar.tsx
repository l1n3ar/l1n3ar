'use client';
import { useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { RecDialog, type RecDialogHandle } from './rec-dialog';
import type { WorkHistoryEntry, Recommendation } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { kicker, metaItalic, linkButtonClass } from '@/lib/typography';
import { cn } from '@/lib/utils';

const REC_PREVIEW_LEN = 90;
const REC_INITIAL_COUNT = 3;

function SectionHeader({
  label, open, onToggle, className,
}: { label: string; open: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(kicker, 'flex items-center gap-1 w-full text-left', className)}
    >
      {label}
      <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', open ? '' : '-rotate-90')} />
    </button>
  );
}

export function Sidebar({
  about, history, recs, open, onToggleOpen,
}: { about: string; history: WorkHistoryEntry[]; recs: Recommendation[]; open: boolean; onToggleOpen: () => void }) {
  const recDialogRef = useRef<RecDialogHandle>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recsOpen, setRecsOpen] = useState(false);
  const [recsExpanded, setRecsExpanded] = useState(false);

  if (!open) {
    return (
      <div className="border-r border-g flex flex-col items-center pt-4">
        <Button variant="ghost" size="icon" aria-label="expand sidebar" onClick={onToggleOpen}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const visibleRecs = recsExpanded ? recs : recs.slice(0, REC_INITIAL_COUNT);

  return (
    <div className="gz-scroll border-r border-g py-4 px-6 flex flex-col min-h-0 min-w-0 overflow-y-auto overflow-x-hidden scroll-smooth">
      <div className="flex justify-end mb-1">
        <Button variant="ghost" size="icon" aria-label="collapse sidebar" onClick={onToggleOpen}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className={`${kicker} mb-1.5`}>about</div>
      <p className="text-0_8 leading-relaxed mb-4 pb-3.5 border-b border-g/25 break-words">{about}</p>

      <SectionHeader label="work experience" open={historyOpen} onToggle={() => setHistoryOpen((o) => !o)} className="mb-1.5" />
      {historyOpen && (
        <div className="mb-4 pb-3.5 border-b border-g/25">
          {history.map((w) => (
            <div key={w.org} className="py-1.5 border-b border-g/14 last:border-b-0">
              <div className="flex justify-between gap-2.5">
                <span className="text-0_9 leading-tight break-words">{w.org}</span>
                <span className={`${metaItalic} text-ink/48 whitespace-nowrap shrink-0`}>{w.range}</span>
              </div>
              <div className={kicker}>{w.role}</div>
            </div>
          ))}
        </div>
      )}

      <SectionHeader label="recommendations" open={recsOpen} onToggle={() => setRecsOpen((o) => !o)} />
      {recsOpen && (
        <div className="gz-scroll flex-1 min-h-20 overflow-y-auto overflow-x-hidden scroll-smooth pr-0.5 mt-1.5">
          {visibleRecs.map((r) => {
            const long = r.quote.length > REC_PREVIEW_LEN;
            const short = long ? r.quote.slice(0, REC_PREVIEW_LEN) + '…' : r.quote;
            return (
              <div key={r.who} className="mb-3 pb-2.5 border-b border-g/12">
                <p className="font-heading italic text-sm leading-snug mb-1 break-words">&ldquo;{short}&rdquo;</p>
                <div className="flex items-baseline gap-2.5">
                  <span className={`${metaItalic} text-ink/50`}>— {r.who}</span>
                  {long && (
                    <Button
                      variant="link"
                      className={linkButtonClass}
                      onClick={() => recDialogRef.current?.open(r.quote, r.who)}
                    >
                      read more
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {!recsExpanded && recs.length > REC_INITIAL_COUNT && (
            <Button variant="link" className={`${linkButtonClass} block mx-auto`} onClick={() => setRecsExpanded(true)}>
              load more ({recs.length - REC_INITIAL_COUNT} more)
            </Button>
          )}
        </div>
      )}

      <RecDialog ref={recDialogRef} />
    </div>
  );
}
