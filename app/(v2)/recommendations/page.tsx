import { Recommendations } from '@/components/v2/recommendations/recommendations';
import { getRecommendations } from '@/lib/content';

export default async function RecommendationsPage() {
  const recommendations = await getRecommendations();
  return <Recommendations recommendations={recommendations} />;
}
