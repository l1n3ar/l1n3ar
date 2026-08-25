import { AppShell } from '@/components/v2/app-shell';
import { getSiteConfig, getAllProjects } from '@/lib/content';

export default async function V2Layout({ children }: { children: React.ReactNode }) {
  const [site, projects] = await Promise.all([getSiteConfig(), getAllProjects()]);

  return <AppShell site={site} projects={projects}>{children}</AppShell>;
}
