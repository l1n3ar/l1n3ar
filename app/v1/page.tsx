import { PortfolioApp } from '@/components/v1/portfolio-app';
import { MigrationDialog } from '@/components/v1/migration-dialog';
import { getAllProjects, getWorkHistory, getRecommendations, getSiteConfig, getOffTheClock } from '@/lib/content';

export default async function V1Page(
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
    <>
      <MigrationDialog />
      <PortfolioApp
        site={site}
        workHistory={workHistory}
        recommendations={recommendations}
        projects={projects}
        initialProjectId={searchParams.project}
        offTheClock={offTheClock}
      />
    </>
  );
}
