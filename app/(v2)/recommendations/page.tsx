import { SectionPlaceholder } from '@/components/v2/section-placeholder';
import { getRecommendations } from '@/lib/content';

export default async function RecommendationsPage() {
  const recommendations = await getRecommendations();
  return <SectionPlaceholder title="Recommendations" note={`${recommendations.length} recommendations loaded`} />;
}
