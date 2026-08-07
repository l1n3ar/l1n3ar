import { initials } from '@/components/v2/initials';
import { splitWho } from '@/components/v2/recommendations/recommendation-utils';
import { keyedPastelChipStyle } from '@/lib/pastel';
import type { Recommendation } from '@/lib/types';

export function MiniRecommendations({ description, recommendations }: { description?: string; recommendations: Recommendation[] }) {
  const shown = recommendations.slice(0, 3);

  return (
    <div className="flex flex-col">
      {description && <p className="text-0_6 text-muted-foreground leading-snug">{description}</p>}
      {shown.length > 0 && (
        <div className="mt-6 flex flex-col gap-2 min-h-0 overflow-y-auto gz-scroll">
          {shown.map((r) => {
            const { name } = splitWho(r.who);
            const chipStyle = keyedPastelChipStyle(r.who);
            return (
              <div key={r.who} className="flex items-start gap-2">
                <div
                  className="pastel-chip size-icon-md rounded-sm flex items-center justify-center text-0_6 font-semibold shrink-0"
                  style={chipStyle}
                >
                  {initials(name)}
                </div>
                <p className="text-0_6 text-muted-foreground leading-snug line-clamp-2 min-w-0">
                  <span className="font-semibold text-foreground/80">{name}</span> — {r.quote}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
