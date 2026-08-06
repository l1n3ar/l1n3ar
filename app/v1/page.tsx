import { PortfolioApp } from '@/components/portfolio-app';
import { V1MigrationDialog } from '@/components/v1-migration-dialog';
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
      <V1MigrationDialog />
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
