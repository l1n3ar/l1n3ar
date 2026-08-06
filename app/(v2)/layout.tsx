import { AppShell } from '@/components/v2/app-shell';
import { getSiteConfig, getNavItems } from '@/lib/content';

export default async function V2Layout({ children }: { children: React.ReactNode }) {
  const [site, navItems] = await Promise.all([getSiteConfig(), getNavItems()]);

  return <AppShell site={site} navItems={navItems}>{children}</AppShell>;
}
