'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/v2/sidebar/app-sidebar';
import { CommandPalette } from '@/components/v2/command-palette';
import { CommandPaletteProvider } from '@/components/v2/command-palette-context';
import { Navbar } from '@/components/v2/navbar';
import { sectionHref, topLevelPath } from '@/components/v2/section-routes';
import { SiteProvider } from '@/components/v2/site-context';
import { useIsMobile } from '@/hooks/use-mobile';
import type { SiteConfig, NavItem, Project } from '@/lib/types';

const PROJECT_DETAIL = /^\/projects\/([^/]+)$/;

export function AppShell({
  site, navItems, projects, children,
}: {
  site: SiteConfig; navItems: NavItem[]; projects: Project[]; children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    document.documentElement.classList.add('v2');
    document.body.classList.add('v2');
    return () => {
      document.documentElement.classList.remove('v2');
      document.body.classList.remove('v2');
    };
  }, []);

  const currentPath = topLevelPath(pathname);
  const projectSlug = pathname.match(PROJECT_DETAIL)?.[1];
  const project = projectSlug ? projects.find((p) => p.id === projectSlug) : undefined;
  const title = project?.name ?? navItems.find((i) => i.href === currentPath)?.label ?? currentPath;
  const onBack = projectSlug ? () => router.push(sectionHref('projects')) : undefined;
  const resumeHref = site.footerLinks.find((l) => l.label.toLowerCase().includes('resume'))?.href;

  return (
    <SiteProvider site={site} navItems={navItems} projects={projects}>
      <CommandPaletteProvider>
        <div className="v2 font-sans">
          <SidebarProvider style={{ '--sidebar-width': 'clamp(14rem, 18vw, 18rem)' } as React.CSSProperties}>
            <AppSidebar currentPath={currentPath} />
            <SidebarInset className="h-screen-safe">
              <Navbar title={title} onBack={onBack} resumeHref={resumeHref} />
              <div className="flex-1 min-h-0 bg-muted/20">
                <div className={`max-w-[100rem] mx-auto h-full overflow-y-auto gz-scroll px-5 py-3 ${isMobile ? 'pb-6' : ''} flex flex-col`}>
                  {children}
                </div>
              </div>
            </SidebarInset>
          </SidebarProvider>
          <CommandPalette />
        </div>
      </CommandPaletteProvider>
    </SiteProvider>
  );
}
