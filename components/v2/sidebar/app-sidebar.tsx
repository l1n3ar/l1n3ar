'use client';
import { Fragment } from 'react';
import NextLink from 'next/link';
import { Search, Link as LinkIcon, FileText, Tag } from 'lucide-react';
import {
  Sidebar as SidebarPrimitive, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator, useSidebar,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ICON_STROKE } from '@/components/v2/constants';
import { FooterLinkIcon } from '@/components/v2/footer-link-icon';
import { initials } from '@/components/v2/initials';
import { iconForRoute } from '@/components/v2/nav-icons';
import { ScrambleLink } from '@/components/v2/scramble-link';
import { sectionHref } from '@/components/v2/section-routes';
import { useCommandPalette } from '@/components/v2/command-palette-context';
import { useSite } from '@/components/v2/site-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { useRelease } from '@/hooks/release';

const INSET = 'px-4';
const SEPARATOR_AFTER = ['/recommendations', '/deployments'];
const L1n3arIcon = iconForRoute('/l1n3ar');

const FOOTER_ICONS: Record<string, typeof LinkIcon> = {
  resume: FileText,
};

const FOOTER_LABELS: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  resume: 'Download resume',
};

export function AppSidebar({ currentPath }: { currentPath: string }) {
  const { site, navItems } = useSite();
  const { setOpen: setPaletteOpen } = useCommandPalette();
  const { data: release } = useRelease();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const ownerInitials = initials(site.name);
  const closeMobile = () => setOpenMobile(false);

  return (
    <SidebarPrimitive collapsible="offcanvas">
      <SidebarHeader className={`gap-2 pt-4 ${INSET}`}>
        <NextLink href={sectionHref('home')} onClick={closeMobile} className="flex items-start gap-2 min-w-0">
          <Avatar size="sm" className="rounded-md bg-primary after:rounded-md shrink-0">
            <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-0_6">
              {ownerInitials}
            </AvatarFallback>
          </Avatar>
          <span className="flex flex-col min-w-0 text-left">
            <span className="text-0_7 font-medium truncate text-foreground">{site.name}</span>
            <span className="text-0_6 text-sidebar-foreground/55 line-clamp-2">{site.about}</span>
          </span>
        </NextLink>
      </SidebarHeader>

      <SidebarContent className={`gap-0 py-3 ${INSET} gz-scroll`}>
        <SidebarMenu className="gap-1">
          {navItems.map((item) => {
            const Icon = iconForRoute(item.href);
            return (
              <Fragment key={item.href}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    size="sm"
                    isActive={currentPath === item.href}
                    onClick={closeMobile}
                    render={<NextLink href={item.href} />}
                    className="text-0_7 gap-2 text-sidebar-foreground/70 data-[active]:text-sidebar-foreground"
                  >
                    <Icon strokeWidth={ICON_STROKE} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {SEPARATOR_AFTER.includes(item.href) && (
                  <SidebarSeparator className="mx-0 my-2" />
                )}
              </Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className={`gap-3 pt-3 ${isMobile ? 'pb-6' : 'pb-3'} ${INSET}`}>
        <ScrambleLink
          href={sectionHref('l1n3ar')}
          text="l1n3ar"
          icon={<L1n3arIcon strokeWidth={ICON_STROKE} />}
          onClick={closeMobile}
          className="flex w-full items-center gap-2 rounded-md h-7 p-2 text-0_7 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors [&_svg]:size-icon-xs [&_svg]:shrink-0"
        />

        <SidebarSeparator className="mx-0" />

        <div className="flex items-center justify-between gap-2">
          {release ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={release.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 min-w-0 text-0_6 font-mono text-foreground"
                  />
                }
              >
                <Tag className="size-icon-xs shrink-0" strokeWidth={ICON_STROKE} />
                <span className="truncate">{release.tag}</span>
              </TooltipTrigger>
              <TooltipContent className="text-0_6 font-sans not-italic">Latest Release</TooltipContent>
            </Tooltip>
          ) : <span />}

          <div className="flex gap-2 shrink-0">
            {site.footerLinks.map((l) => {
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
                    <FooterLinkIcon label={l.label} fallback={Icon} className="size-icon-xs" />
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
