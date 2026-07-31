
import { PortfolioApp } from '@/components/portfolio-app';
import { getAllProjects, getWorkHistory, getRecommendations, getSiteConfig, getOffTheClock } from '@/lib/content';

export default async function Page(
  props: {
    searchParams: Promise<{ project?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  return (
    <>

      <PortfolioApp
        site={getSiteConfig()}
        workHistory={getWorkHistory()}
        recommendations={getRecommendations()}
        projects={getAllProjects()}
        initialProjectId={searchParams.project}
        offTheClock={getOffTheClock()}
      />

    </>
  );
}
