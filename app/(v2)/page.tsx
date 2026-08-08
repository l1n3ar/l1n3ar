import { Home } from '@/components/v2/home/home';
import { getRecommendations } from '@/lib/content';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const recommendations = await getRecommendations();
  const recommendation = recommendations.length > 0
    ? recommendations[Math.floor(Math.random() * recommendations.length)]
    : undefined;
  return <Home recommendation={recommendation} />;
}
