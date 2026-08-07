import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/v2/projects/project-detail/project-detail';
import { getAllProjects } from '@/lib/content';

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projects = await getAllProjects();
  const project = projects.find((p) => p.id === slug);
  if (!project) notFound();

  return <ProjectDetail project={project} />;
}
