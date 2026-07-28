import { PortfolioApp } from '@/components/portfolio-app';
import { getAllProjects, getWorkHistory, getRecommendations, getSiteConfig } from '@/lib/content';
import { getLatestRelease } from '@/actions/release';

export default async function Page({
  searchParams,
}: {
  searchParams: { project?: string };
}) {
  const releaseResult = await getLatestRelease();

  return (
    <PortfolioApp
      site={getSiteConfig()}
      workHistory={getWorkHistory()}
      recommendations={getRecommendations()}
      projects={getAllProjects()}
      initialProjectId={searchParams.project}
      release={releaseResult.ok ? releaseResult.release : undefined}
    />
  );
}
