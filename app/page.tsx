import { App } from '@/components/v2/app';
import {
  getAllProjects, getWorkHistory, getRecommendations, getSiteConfig, getOffTheClock, getNavItems,
} from '@/lib/content';

export default async function Page() {
  const [site, workHistory, recommendations, projects, offTheClock, navItems] = await Promise.all([
    getSiteConfig(),
    getWorkHistory(),
    getRecommendations(),
    getAllProjects(),
    getOffTheClock(),
    getNavItems(),
  ]);

  return (
    <App
      site={site}
      workHistory={workHistory}
      recommendations={recommendations}
      projects={projects}
      offTheClock={offTheClock}
      navItems={navItems}
    />
  );
}
