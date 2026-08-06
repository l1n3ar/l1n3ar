import { Recommendations } from '@/components/v2/sections/recommendations';
import { getRecommendations } from '@/lib/content';

export default async function RecommendationsPage() {
  const recommendations = await getRecommendations();
  return <Recommendations recommendations={recommendations} />;
}
