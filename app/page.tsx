import { PortfolioApp } from '@/components/PortfolioApp';
import { getAllProjects, getWorkHistory, getRecommendations, getTechIconMap, getSiteConfig } from '@/lib/content';

export default async function Page() {
  const [site, workHistory, recommendations, projects, iconMap] = await Promise.all([
    Promise.resolve(getSiteConfig()),
    Promise.resolve(getWorkHistory()),
    Promise.resolve(getRecommendations()),
    getAllProjects(),
    Promise.resolve(getTechIconMap()),
  ]);

  return (
    <PortfolioApp
      site={site}
      workHistory={workHistory}
      recommendations={recommendations}
      projects={projects}
      iconMap={iconMap}
    />
  );
}
