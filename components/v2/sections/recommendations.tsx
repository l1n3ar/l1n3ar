'use client';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { hueForKey, pastelChipStyle } from '@/lib/pastel';
import type { Recommendation } from '@/lib/types';

const PREVIEW_LEN = 220;

function splitWho(who: string): { name: string; role?: string } {
  const [name, ...rest] = who.split('·').map((s) => s.trim());
  return { name, role: rest.length > 0 ? rest.join(' · ') : undefined };
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function RecommendationCard({ rec, onReadMore }: { rec: Recommendation; onReadMore: () => void }) {
  const { name, role } = splitWho(rec.who);
  const chipStyle = pastelChipStyle(hueForKey(rec.who));
  const isLong = rec.quote.length > PREVIEW_LEN;
  const preview = isLong ? `${rec.quote.slice(0, PREVIEW_LEN)}…` : rec.quote;

  return (
    <div className="border border-border rounded-lg p-4 bg-card flex gap-2.5">
      <div
        className="pastel-chip size-icon-lg rounded-md flex items-center justify-center text-0_6 font-semibold shrink-0"
        style={chipStyle}
      >
        {initials(name)}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-0_8 font-semibold block">{name}</span>
        {role && <p className="text-0_7 text-muted-foreground leading-snug mt-0.5 mb-1.5">{role}</p>}
        <p className={`text-0_7 leading-relaxed text-foreground/85 ${role ? '' : 'mt-1.5'} mb-1.5`}>&quot;{preview}&quot;</p>
        {isLong && (
          <button
            type="button"
            onClick={onReadMore}
            className="text-0_7 font-semibold underline decoration-border hover:decoration-foreground"
          >
            Read more →
          </button>
        )}
      </div>
    </div>
  );
}

export function Recommendations({ recommendations }: { recommendations: Recommendation[] }) {
  const [open, setOpen] = useState<Recommendation | null>(null);
  const openInfo = open ? splitWho(open.who) : null;
  const chipStyle = open ? pastelChipStyle(hueForKey(open.who)) : undefined;

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
