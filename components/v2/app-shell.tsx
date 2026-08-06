'use client';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/v2/sidebar';
import { Navbar } from '@/components/v2/navbar';
import { sectionFromPathname, sectionHref } from '@/components/v2/section-routes';
import type { SiteConfig, NavItem } from '@/lib/types';

const PROJECT_DETAIL = /^\/projects\/[^/]+$/;

export function AppShell({
  site, navItems, children,
}: {
  site: SiteConfig; navItems: NavItem[]; children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const section = sectionFromPathname(pathname);
  const title = navItems.find((i) => i.section === section)?.label ?? section;
  const onBack = PROJECT_DETAIL.test(pathname) ? () => router.push(sectionHref('projects')) : undefined;

  return (
    <div className="v2 font-sans">
      <SidebarProvider style={{ '--sidebar-width': 'clamp(12rem, 15vw, 15rem)' } as React.CSSProperties}>
        <AppSidebar site={site} navItems={navItems} section={section} />
        <SidebarInset className="h-screen-safe">
          <Navbar title={title} feedbackEmail={site.email} onBack={onBack} />
          <div className="flex-1 min-h-0 overflow-y-auto gz-scroll">
            <div className="max-w-[90rem] mx-auto p-5 h-full">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
