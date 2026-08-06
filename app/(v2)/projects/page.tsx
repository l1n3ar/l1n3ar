import { Projects } from '@/components/v2/sections/projects';
import { getAllProjects } from '@/lib/content';

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  return <Projects projects={projects} />;
}
