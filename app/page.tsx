
import { PortfolioApp } from '@/components/portfolio-app';
import { getAllProjects, getWorkHistory, getRecommendations, getSiteConfig, getOffTheClock } from '@/lib/content';

export default async function Page(
  props: {
    searchParams: Promise<{ project?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const [site, workHistory, recommendations, projects, offTheClock] = await Promise.all([
    getSiteConfig(),
    getWorkHistory(),
    getRecommendations(),
    getAllProjects(),
    getOffTheClock(),
  ]);

  return (
    <PortfolioApp
      site={site}
      workHistory={workHistory}
      recommendations={recommendations}
      projects={projects}
      initialProjectId={searchParams.project}
      offTheClock={offTheClock}
    />
  );
}
