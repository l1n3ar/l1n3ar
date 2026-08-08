import { initials } from '@/components/v2/initials';
import { splitWho } from '@/components/v2/recommendations/recommendation-utils';
import { keyedPastelChipStyle } from '@/lib/pastel';
import type { Recommendation } from '@/lib/types';

export function RecommendationCard({ rec }: { rec: Recommendation }) {
  const { name, role } = splitWho(rec.who);
  const chipStyle = keyedPastelChipStyle(rec.who);

  return (
    <div className="h-full border border-border rounded-lg p-4 bg-card flex flex-col">
      <p className="text-0_7 leading-relaxed text-foreground/85">&quot;{rec.quote}&quot;</p>
      <div className="flex items-start gap-2.5 mt-auto pt-3">
        <div
          className="pastel-chip size-icon-lg rounded-md flex items-center justify-center text-0_6 font-semibold shrink-0"
          style={chipStyle}
        >
          {initials(name)}
        </div>
        <div className="min-w-0">
          <span className="text-0_8 font-semibold block">{name}</span>
          {role && <p className="text-0_7 text-muted-foreground leading-snug">{role}</p>}
        </div>
      </div>
    </div>
  );
}
