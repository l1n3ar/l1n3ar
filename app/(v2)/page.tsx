import { Home } from '@/components/v2/sections/home';
import { getWorkHistory, getHomeTiles } from '@/lib/content';

export default async function HomePage() {
  const [workHistory, homeTiles] = await Promise.all([getWorkHistory(), getHomeTiles()]);
  return <Home tiles={homeTiles} workHistory={workHistory} />;
}
