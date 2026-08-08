import { RecommendationCard } from '@/components/v2/recommendations/recommendation-card';
import type { Recommendation } from '@/lib/types';

export function Recommendations({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <div>
      <h1 className="text-0_9 font-semibold mb-3.5">Recommendations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
        {recommendations.map((r) => (
          <RecommendationCard key={r.who} rec={r} />
        ))}
      </div>
    </div>
  );
}
