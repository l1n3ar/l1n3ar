'use client';
import { Fragment } from 'react';
import NextLink from 'next/link';
import { Search, Link as LinkIcon, FileText, Tag } from 'lucide-react';
import {
  Sidebar as SidebarPrimitive, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { NAV_ICONS } from '@/components/v2/nav-icons';
import { sectionHref } from '@/components/v2/section-routes';
import { useRelease } from '@/hooks/release';
import type { NavItem, V2Section } from '@/lib/types';
import type { SiteConfig } from '@/lib/types';

// Base icon weight for this UI — see Global look / Icons in the design handoff.
const ICON_STROKE = 1.75;

// One consistent horizontal inset for every row in the sidebar (header, search, nav,
// footer) so separators — which sit flush with no margin of their own — line up with
// everything above and below them instead of appearing narrower/wider at each nesting depth.
const INSET = 'px-3';

// Nav items render as one flat list — a separator marks the end of "explore" (after
// off the clock) and the end of "live status" (after deployments), without group labels.
const SEPARATOR_AFTER: V2Section[] = ['offclock', 'deployments'];

// Placeholder icons until real brand marks are dropped in — see FOOTER_ICONS usage below.
const FOOTER_ICONS: Record<string, typeof LinkIcon> = {
  github: LinkIcon,
  linkedin: LinkIcon,
  resume: FileText,
};

export function AppSidebar({
  site, navItems, section,
}: {
  site: SiteConfig; navItems: NavItem[]; section: V2Section;
}) {
  const { data: release } = useRelease();

  return (
    <SidebarPrimitive collapsible="offcanvas">
      <SidebarHeader className={`gap-2 pt-3 pb-2 ${INSET}`}>
        <NextLink href={sectionHref('home')} className="flex items-start gap-2 min-w-0">
          <span className="flex flex-col min-w-0 text-left">
            <span className="text-0_7 font-medium truncate">{site.name}</span>
            <span className="text-0_6 text-sidebar-foreground/55 line-clamp-2">{site.about}</span>
          </span>
        </NextLink>
      </SidebarHeader>



      <div className={`py-2 ${INSET}`}>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-sidebar-foreground/55">
          <Search className="size-3 shrink-0" strokeWidth={ICON_STROKE} />
          <span className="text-0_7">Search</span>
          <kbd className="ml-auto text-0_6 font-mono text-sidebar-foreground/40">⌘K</kbd>
        </Button>
      </div>



      <SidebarContent className={`gap-0 py-2 ${INSET} gz-scroll p-2`}>
        <SidebarMenu className="gap-0.2">
          {navItems.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            return (
              <Fragment key={item.section}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="sm"
                    isActive={section === item.section}
                    render={<NextLink href={sectionHref(item.section)} />}
                    className="text-0_7 gap-2 text-sidebar-foreground/70 data-active:text-sidebar-foreground"
                  >
                    <Icon strokeWidth={ICON_STROKE} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {SEPARATOR_AFTER.includes(item.section) && (
                  <SidebarSeparator className="mx-0 my-1.5" />
                )}
              </Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator className="mx-0" />

      <SidebarFooter className={`gap-2 pt-2 ${INSET}`}>
        {release && (
          <a
            href={release.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-0_6 font-mono text-sidebar-foreground/40 hover:text-sidebar-foreground/70"
          >
            <Tag className="size-3" strokeWidth={ICON_STROKE} />
            {release.tag}
          </a>
        )}
        <div className="flex gap-1.5">
          {site.footerLinks.map((l) => {
            const key = Object.keys(FOOTER_ICONS).find((k) => l.label.toLowerCase().includes(k));
            const Icon = key ? FOOTER_ICONS[key] : FileText;
            return (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-6 items-center justify-center rounded-md text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                aria-label={l.label}
              >
                <Icon className="size-3" strokeWidth={ICON_STROKE} />
              </a>
            );
          })}
        </div>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
