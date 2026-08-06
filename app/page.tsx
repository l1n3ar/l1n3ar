import { App } from '@/components/v2/app';
import {
  getAllProjects, getWorkHistory, getRecommendations, getSiteConfig, getOffTheClock, getNavItems, getHomeTiles,
} from '@/lib/content';

export default async function Page() {
  const [site, workHistory, recommendations, projects, offTheClock, navItems, homeTiles] = await Promise.all([
    getSiteConfig(),
    getWorkHistory(),
    getRecommendations(),
    getAllProjects(),
    getOffTheClock(),
    getNavItems(),
    getHomeTiles(),
  ]);

  return (
    <App
      site={site}
      workHistory={workHistory}
      recommendations={recommendations}
      projects={projects}
      offTheClock={offTheClock}
      navItems={navItems}
      homeTiles={homeTiles}
    />
  );
}
