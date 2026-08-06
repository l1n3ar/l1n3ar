'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/v2/sidebar';
import { CommandPalette } from '@/components/v2/command-palette';
import { CommandPaletteProvider } from '@/components/v2/command-palette-context';
import { Navbar } from '@/components/v2/navbar';
import { sectionFromPathname, sectionHref } from '@/components/v2/section-routes';
import { SiteProvider } from '@/components/v2/site-context';
import type { SiteConfig, NavItem, Project } from '@/lib/types';

const PROJECT_DETAIL = /^\/projects\/([^/]+)$/;

export function AppShell({
  site, navItems, projects, children,
}: {
  site: SiteConfig; navItems: NavItem[]; projects: Project[]; children: React.ReactNode;
}) {
  // Popover/Tooltip/Dialog content portals to document.body, outside the .v2 wrapper
  // div below — without this, those overlays fall back to v1's :root tokens instead
  // of v2's. Adding .v2 to <html> too means portaled content (still a DOM descendant
  // of <html>) inherits the right CSS variables regardless of where it's mounted.
  useEffect(() => {
    document.documentElement.classList.add('v2');
    return () => document.documentElement.classList.remove('v2');
  }, []);

  const pathname = usePathname();
  const router = useRouter();
  const section = sectionFromPathname(pathname);
  const projectSlug = pathname.match(PROJECT_DETAIL)?.[1];
  const project = projectSlug ? projects.find((p) => p.id === projectSlug) : undefined;
  const title = project?.name ?? navItems.find((i) => i.section === section)?.label ?? section;
  const onBack = projectSlug ? () => router.push(sectionHref('projects')) : undefined;

  return (
    <SiteProvider site={site} navItems={navItems} projects={projects}>
      <CommandPaletteProvider>
        <div className="v2 font-sans">
          <SidebarProvider style={{ '--sidebar-width': 'clamp(14rem, 18vw, 18rem)' } as React.CSSProperties}>
            <AppSidebar section={section} />
            <SidebarInset className="h-screen-safe">
              <Navbar title={title} onBack={onBack} />
              <div className="flex-1 min-h-0 overflow-y-auto gz-scroll bg-muted/20">
                <div className="max-w-[90rem] mx-auto p-5 h-full">{children}</div>
              </div>
            </SidebarInset>
          </SidebarProvider>
          <CommandPalette />
        </div>
      </CommandPaletteProvider>
    </SiteProvider>
  );
}
