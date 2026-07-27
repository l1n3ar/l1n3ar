import { PortfolioApp } from '@/components/portfolio-app';
import { getAllProjects, getWorkHistory, getRecommendations, getSiteConfig } from '@/lib/content';

export default async function Page() {
  const [site, workHistory, recommendations, projects] = await Promise.all([
    Promise.resolve(getSiteConfig()),
    Promise.resolve(getWorkHistory()),
    Promise.resolve(getRecommendations()),
    getAllProjects(),
  ]);

  return (
    <PortfolioApp
      site={site}
      workHistory={workHistory}
      recommendations={recommendations}
      projects={projects}
    />
  );
}
