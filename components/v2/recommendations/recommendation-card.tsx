import { initials } from '@/components/v2/initials';
import { splitWho } from '@/components/v2/recommendations/recommendation-utils';
import { keyedPastelChipStyle } from '@/lib/pastel';
import type { Recommendation } from '@/lib/types';

const PREVIEW_LEN = 220;

export function RecommendationCard({ rec, onReadMore }: { rec: Recommendation; onReadMore: () => void }) {
  const { name, role } = splitWho(rec.who);
  const chipStyle = keyedPastelChipStyle(rec.who);
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
