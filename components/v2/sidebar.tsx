'use client';
import { Fragment } from 'react';
import NextLink from 'next/link';
import { Search, Link as LinkIcon, FileText, Tag } from 'lucide-react';
import {
  Sidebar as SidebarPrimitive, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { NAV_ICONS } from '@/components/v2/nav-icons';
import { BRAND_ICONS } from '@/components/v2/tech-icons';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { sectionHref } from '@/components/v2/section-routes';
import { useCommandPalette } from '@/components/v2/command-palette-context';
import { useSite } from '@/components/v2/site-context';
import { useRelease } from '@/hooks/release';
import type { V2Section } from '@/lib/types';

// Base icon weight for this UI — see Global look / Icons in the design handoff.
const ICON_STROKE = 1.75;

// One consistent horizontal inset for every row in the sidebar (header, search, nav,
// footer) so separators — which sit flush with no margin of their own — line up with
// everything above and below them instead of appearing narrower/wider at each nesting depth.
const INSET = 'px-4';

// Nav items render as one flat list — a separator marks the end of "explore" (after
// off the clock) and the end of "live status" (after deployments), without group labels.
const SEPARATOR_AFTER: V2Section[] = ['l1n3ar', 'deployments'];

// GitHub gets its real Simple Icons brand mark (see BRAND_ICONS, rendered separately below);
// LinkedIn isn't in Simple Icons (removed after a trademark takedown request), so it uses
// a dropped-in PNG asset (public/images/tiles/linkedin.png, rendered separately below) instead.
// FOOTER_ICONS.linkedin below is unused for rendering but keeps the tooltip-label lookup working.
const FOOTER_ICONS: Record<string, typeof LinkIcon> = {
  linkedin: LinkIcon,
  resume: FileText,
};

const FOOTER_LABELS: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  resume: 'Download resume',
};

export function AppSidebar({ section }: { section: V2Section }) {
  const { site, navItems } = useSite();
  const { setOpen: setPaletteOpen } = useCommandPalette();
  const { data: release } = useRelease();
  const initials = site.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <SidebarPrimitive collapsible="offcanvas">
      <SidebarHeader className={`gap-2 pt-4 ${INSET}`}>
        <NextLink href={sectionHref('home')} className="flex items-start gap-2 min-w-0">
          <Avatar size="sm" className="rounded-md bg-primary after:rounded-md shrink-0">
            <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-0_6">
              {initials}
            </AvatarFallback>
          </Avatar>
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
          <Input
            readOnly
            placeholder="Search…"
            onClick={() => setPaletteOpen(true)}
            className="pl-7 pr-9 text-0_7 cursor-pointer"
          />
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
              const isGithub = l.label.toLowerCase().includes('github');
              const isLinkedin = l.label.toLowerCase().includes('linkedin');
              const key = Object.keys(FOOTER_ICONS).find((k) => l.label.toLowerCase().includes(k));
              const Icon = key ? FOOTER_ICONS[key] : FileText;
              const tooltipLabel = key ? FOOTER_LABELS[key] : l.label;
              return (
                <Tooltip key={l.label}>
                  <TooltipTrigger
                    render={
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex size-icon-xl items-center justify-center rounded-md text-foreground hover:bg-muted"
                        aria-label={tooltipLabel}
                      />
                    }
                  >
                    {isGithub ? (
                      <BRAND_ICONS.github className="size-icon-xs" color="currentColor" />
                    ) : isLinkedin ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src="/images/tiles/linkedin.png" alt="" className="size-icon-xs object-contain" />
                    ) : (
                      <Icon className="size-icon-xs" strokeWidth={ICON_STROKE} />
                    )}
                  </TooltipTrigger>
                  <TooltipContent className="text-0_6 font-sans not-italic">{tooltipLabel}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
