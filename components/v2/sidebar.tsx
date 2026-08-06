'use client';
import { Search, Github, Linkedin, FileText, Tag } from 'lucide-react';
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { NAV_ICONS } from '@/components/v2/nav-icons';
import { useRelease } from '@/hooks/release';
import type { NavGroupName, NavItem, V2Section } from '@/lib/types';
import type { SiteConfig } from '@/lib/types';

const FOOTER_ICONS: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  resume: FileText,
};

export function V2Sidebar({
  site, navItems, section, onSectionChange,
}: {
  site: SiteConfig; navItems: NavItem[]; section: V2Section; onSectionChange: (s: V2Section) => void;
}) {
  const { data: release } = useRelease();
  const groups = groupBy(navItems);

  return (
    <Sidebar collapsible="offcanvas" className="w-[204px]">
      <SidebarHeader className="h-11 flex-row items-center justify-between border-b border-sidebar-border px-3">
        <button type="button" onClick={() => onSectionChange('home')} className="text-sm font-medium truncate">
          {site.name}
        </button>
        <ThemeToggle />
      </SidebarHeader>

      <div className="px-3 py-2.5 border-b border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/65 line-clamp-2">{site.about}</p>
      </div>

      <div className="px-3 py-2 border-b border-sidebar-border">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-sidebar-foreground/60">
          <Search className="h-3.5 w-3.5" />
          Search
          <kbd className="ml-auto text-[0.65rem] font-mono">⌘K</kbd>
        </Button>
      </div>

      <SidebarContent className="gap-0">
        {groups.map(([group, items]) => (
          <SidebarGroup key={group} className="border-b border-sidebar-border py-2.5">
            <SidebarGroupLabel className="text-[9.5px] uppercase tracking-wide">{group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const Icon = NAV_ICONS[item.icon];
                  return (
                    <SidebarMenuItem key={item.section}>
                      <SidebarMenuButton isActive={section === item.section} onClick={() => onSectionChange(item.section)}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="gap-2 border-t border-sidebar-border">
        {release && (
          <a
            href={release.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[0.65rem] font-mono text-sidebar-foreground/45 hover:text-sidebar-foreground/80 px-1"
          >
            <Tag className="h-3 w-3" />
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
                className="flex size-7 items-center justify-center rounded-md border border-sidebar-border text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                aria-label={l.label}
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            );
          })}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

function groupBy(items: NavItem[]): [NavGroupName, NavItem[]][] {
  const map = new Map<NavGroupName, NavItem[]>();
  for (const item of items) {
    const list = map.get(item.group) ?? [];
    list.push(item);
    map.set(item.group, list);
  }
  return Array.from(map.entries());
}
