import { PortfolioApp } from '@/components/portfolio-app';
import { getAllProjects, getWorkHistory, getRecommendations, getSiteConfig } from '@/lib/content';
import { getBuildInfo } from '@/lib/utils';

export default async function Page({
  searchParams,
}: {
  searchParams: { project?: string };
}) {
  return (
    <PortfolioApp
      site={getSiteConfig()}
      workHistory={getWorkHistory()}
      recommendations={getRecommendations()}
      projects={getAllProjects()}
      initialProjectId={searchParams.project}
      buildInfo={getBuildInfo()}
    />
  );
}
