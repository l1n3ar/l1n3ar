'use client';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { initials } from '@/components/v2/initials';
import { RecommendationCard } from '@/components/v2/recommendations/recommendation-card';
import { splitWho } from '@/components/v2/recommendations/recommendation-utils';
import { keyedPastelChipStyle } from '@/lib/pastel';
import type { Recommendation } from '@/lib/types';

export function Recommendations({ recommendations }: { recommendations: Recommendation[] }) {
  const [open, setOpen] = useState<Recommendation | null>(null);
  const openInfo = open ? splitWho(open.who) : null;
  const chipStyle = open ? keyedPastelChipStyle(open.who) : undefined;

  return (
    <div>
      <h1 className="text-0_9 font-semibold mb-3.5">Recommendations</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {recommendations.map((r) => (
          <RecommendationCard key={r.who} rec={r} onReadMore={() => setOpen(r)} />
        ))}
      </div>

      <Dialog open={Boolean(open)} onOpenChange={(next) => !next && setOpen(null)}>
        <DialogContent className="max-w-dialog-sm rounded-lg font-sans not-italic">
          {open && openInfo && (
            <>
              <div className="flex items-center gap-2.5">
                <div
                  className="pastel-chip size-icon-lg rounded-md flex items-center justify-center text-0_6 font-semibold shrink-0"
                  style={chipStyle}
                >
                  {initials(openInfo.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-0_8 font-semibold">{openInfo.name}</div>
                  {openInfo.role && <div className="text-0_7 text-muted-foreground">{openInfo.role}</div>}
                </div>
              </div>
              <p className="text-0_75 leading-relaxed text-foreground/85">&quot;{open.quote}&quot;</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
