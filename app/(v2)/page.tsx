import { Home } from '@/components/v2/home/home';
import { getWorkHistory, getHomeTiles, getRecommendations } from '@/lib/content';

export default async function HomePage() {
  const [workHistory, homeTiles, recommendations] = await Promise.all([
    getWorkHistory(), getHomeTiles(), getRecommendations(),
  ]);
  return <Home tiles={homeTiles} workHistory={workHistory} recommendations={recommendations} />;
}
