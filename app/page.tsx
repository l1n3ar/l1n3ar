
import { generateEmbeddings } from '@/actions/embeddings';
import { PortfolioApp } from '@/components/portfolio-app';
import { getAllProjects, getWorkHistory, getRecommendations, getSiteConfig, getOffTheClock } from '@/lib/content';

export default async function Page({
  searchParams,
}: {
  searchParams: { project?: string };
}) {
  const data = await generateEmbeddings()
  console.log({data})
  return (
    <PortfolioApp
      site={getSiteConfig()}
      workHistory={getWorkHistory()}
      recommendations={getRecommendations()}
      projects={getAllProjects()}
      initialProjectId={searchParams.project}
      offTheClock={getOffTheClock()}
    />
  );
}
