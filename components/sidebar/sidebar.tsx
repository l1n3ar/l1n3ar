'use client';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RecDialog, type RecDialogHandle } from '../dialogs/rec-dialog';
import { PracticePopover } from './practice-popover';
import { OffTheClockPopover } from './off-the-clock-popover';
import { SectionHeader } from '../section-header';
import type { WorkHistoryEntry, Recommendation, CodingProfiles, OffTheClock } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { kicker, metaItalic, linkButtonClass } from '@/lib/typography';

const REC_PREVIEW_LEN = 90;
const REC_INITIAL_COUNT = 3;

export function Sidebar({
  about, history, recs, open, onToggleOpen, collapsible = true, codingProfiles, offTheClock, onTriggerSiu,
}: {
  about: string; history: WorkHistoryEntry[]; recs: Recommendation[]; open: boolean; onToggleOpen: () => void;
  collapsible?: boolean; codingProfiles?: CodingProfiles; offTheClock: OffTheClock; onTriggerSiu: () => void;
}) {
  const recDialogRef = useRef<RecDialogHandle>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [recsOpen, setRecsOpen] = useState(false);
  const [recsExpanded, setRecsExpanded] = useState(false);

  if (collapsible && !open) {
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
    <div className="flex-1 relative border-r border-g flex flex-col min-h-0 min-w-0">
      {collapsible && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="collapse sidebar"
          onClick={onToggleOpen}
          className="absolute top-4 right-4 z-10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div className="gz-scroll flex-1 min-h-0 pt-4 pb-4 px-6 flex flex-col overflow-y-auto overflow-x-hidden scroll-smooth">
        <div className={`${kicker} mb-1.5`}>about</div>
        <p className="text-0_8 leading-relaxed mb-4 pb-3.5 border-b border-g/25 break-words">{about}</p>

        <SectionHeader label="work experience" open={historyOpen} onToggle={() => setHistoryOpen((o) => !o)} className="mb-1.5" />
        {historyOpen && (
          <div className="mb-4 pb-3.5 border-b border-g/25">
            {history.map((w) => (
              <div key={w.org} className="py-1.5 border-b border-g/14 last:border-b-0">
                <div className="flex items-baseline justify-between gap-2.5">
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
                    <span className={`${metaItalic} text-ink/50`}>· {r.who}</span>
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
      </div>
      <PracticePopover profiles={codingProfiles} />
      <OffTheClockPopover content={offTheClock} onTriggerSiu={onTriggerSiu} />


      <RecDialog ref={recDialogRef} />
    </div>
  );
}
