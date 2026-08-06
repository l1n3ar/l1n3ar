'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, FileDown, FolderGit2, Link as LinkIcon, Mail, SunMoon } from 'lucide-react';
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
} from '@/components/ui/command';
import { NAV_ICONS } from '@/components/v2/nav-icons';
import { useCommandPalette } from '@/components/v2/command-palette-context';
import { sectionHref } from '@/components/v2/section-routes';
import { useSite } from '@/components/v2/site-context';
import { toggleTheme } from '@/lib/theme';
import { hasCaseStudy } from '@/lib/types';

const ICON_STROKE = 1.75;

const LINK_ICONS: Record<string, typeof FolderGit2> = {
  github: FolderGit2,
  linkedin: LinkIcon,
  'resume.pdf': FileDown,
  email: Mail,
};

const ITEM_CLASS = 'text-0_7 text-foreground data-[selected=true]:bg-muted data-[selected=true]:border-l-foreground data-[selected=true]:text-foreground [&_svg]:text-muted-foreground data-[selected=true]:*:[svg]:text-foreground';
const GROUP_CLASS = 'text-foreground [&_[cmdk-group-heading]]:font-sans [&_[cmdk-group-heading]]:not-italic [&_[cmdk-group-heading]]:text-0_6 [&_[cmdk-group-heading]]:text-muted-foreground';

export function CommandPalette() {
  const { site, navItems, projects } = useSite();
  const { open, setOpen } = useCommandPalette();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, setOpen]);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command palette"
      description="Jump to a section, a project, toggle theme, or view links"
      className="rounded-lg border-border max-w-lg font-sans not-italic"
    >
      <CommandInput
        autoFocus
        placeholder="Jump to a section, a project, toggle theme…"
        className="text-0_8 text-foreground placeholder:text-0_7 placeholder:text-muted-foreground"
        wrapperClassName="border-border focus-within:border-foreground/40"
      />
      <CommandList className="gz-scroll">
        <CommandEmpty className="text-0_7 text-muted-foreground font-sans not-italic">No results.</CommandEmpty>

        <CommandGroup heading="Go to" className={GROUP_CLASS}>
          {navItems.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            return (
              <CommandItem
                key={item.section}
                value={item.label}
                onSelect={() => run(() => router.push(sectionHref(item.section)))}
                className={ITEM_CLASS}
              >
                <Icon strokeWidth={ICON_STROKE} />
                {item.label}
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandGroup heading="Projects" className={GROUP_CLASS}>
          {projects.filter(hasCaseStudy).map((p) => (
            <CommandItem
              key={p.id}
              value={`project ${p.name}`}
              onSelect={() => run(() => router.push(`/projects/${p.id}`))}
              className={ITEM_CLASS}
            >
              <BookOpen strokeWidth={ICON_STROKE} />
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Actions" className={GROUP_CLASS}>
          <CommandItem
            value="toggle theme dark light mode"
            onSelect={() => run(toggleTheme)}
            className={ITEM_CLASS}
          >
            <SunMoon strokeWidth={ICON_STROKE} />
            Toggle dark / light mode
          </CommandItem>
          {site.footerLinks.map((l) => {
            const Icon = LINK_ICONS[l.label] ?? FileDown;
            return (
              <CommandItem
                key={l.label}
                value={l.label}
                onSelect={() => run(() => window.open(l.href, '_blank', 'noopener,noreferrer'))}
                className={ITEM_CLASS}
              >
                <Icon strokeWidth={ICON_STROKE} />
                {l.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
