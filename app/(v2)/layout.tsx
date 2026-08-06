import { AppShell } from '@/components/v2/app-shell';
import { getSiteConfig, getNavItems, getAllProjects } from '@/lib/content';

export default async function V2Layout({ children }: { children: React.ReactNode }) {
  const [site, navItems, projects] = await Promise.all([getSiteConfig(), getNavItems(), getAllProjects()]);

  return <AppShell site={site} navItems={navItems} projects={projects}>{children}</AppShell>;
}
