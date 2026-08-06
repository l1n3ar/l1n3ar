'use client';
import { Fragment } from 'react';
import NextLink from 'next/link';
import { Search, Link as LinkIcon, FileText, Tag } from 'lucide-react';
import {
  Sidebar as SidebarPrimitive, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
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
const INSET = 'px-4';

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
      <SidebarHeader className={`gap-2 pt-4 pb-3 ${INSET}`}>
        <NextLink href={sectionHref('home')} className="flex items-start gap-2 min-w-0">
          <span className="flex flex-col min-w-0 text-left">
            <span className="text-0_7 font-medium truncate text-foreground">{site.name}</span>
            <span className="text-0_6 text-sidebar-foreground/55 line-clamp-2">{site.about}</span>
          </span>
        </NextLink>
      </SidebarHeader>

      {/* <SidebarSeparator className="mx-0" /> */}

      <SidebarContent className={`gap-0 py-3 ${INSET} gz-scroll`}>
        <SidebarMenu className="gap-1">
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
                  <SidebarSeparator className="mx-0 my-2" />
                )}
              </Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* <SidebarSeparator className="mx-0" /> */}

      <SidebarFooter className={`gap-3 pt-3 pb-3 ${INSET}`}>
        <div className="relative">
          <Search
            className="size-icon-xs absolute left-2.5 top-1/2 -translate-y-1/2 text-sidebar-foreground/40 pointer-events-none"
            strokeWidth={ICON_STROKE}
          />
          <Input readOnly placeholder="Search…" className="pl-7 pr-9 text-0_7 cursor-pointer" />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-0_6 font-mono text-sidebar-foreground/40">
            ⌘K
          </kbd>
        </div>

        <SidebarSeparator className="mx-0" />

        <div className="flex items-center justify-between">
          {release ? (
            <a
              href={release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-0_6 font-mono text-foreground"
            >
              <Tag className="size-icon-xs" strokeWidth={ICON_STROKE} />
              {release.tag}
            </a>
          ) : <span />}

          <div className="flex gap-2">
            {site.footerLinks.map((l) => {
              const key = Object.keys(FOOTER_ICONS).find((k) => l.label.toLowerCase().includes(k));
              const Icon = key ? FOOTER_ICONS[key] : FileText;
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-icon-xl items-center justify-center rounded-md text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  aria-label={l.label}
                >
                  <Icon className="size-icon-xs" strokeWidth={ICON_STROKE} />
                </a>
              );
            })}
          </div>
        </div>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
