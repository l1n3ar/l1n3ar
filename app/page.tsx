import { PortfolioApp } from '@/components/portfolio-app';
import { getAllProjects, getWorkHistory, getRecommendations, getSiteConfig } from '@/lib/content';

export default async function Page() {
  return (
    <PortfolioApp
      site={getSiteConfig()}
      workHistory={getWorkHistory()}
      recommendations={getRecommendations()}
      projects={getAllProjects()}
    />
  );
}
