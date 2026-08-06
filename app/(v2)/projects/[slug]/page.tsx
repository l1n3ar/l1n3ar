import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/v2/sections/project-detail';
import { getAllProjects, getSiteConfig } from '@/lib/content';

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [projects, site] = await Promise.all([getAllProjects(), getSiteConfig()]);
  const project = projects.find((p) => p.id === slug);
  if (!project) notFound();

  return <ProjectDetail project={project} siteName={site.name} />;
}
