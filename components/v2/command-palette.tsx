'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, FileText, Mail, SunMoon } from 'lucide-react';
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
} from '@/components/ui/command';
import { ICON_STROKE } from '@/components/v2/constants';
import { FooterLinkIcon } from '@/components/v2/footer-link-icon';
import { iconForRoute } from '@/components/v2/nav-icons';
import { useCommandPalette } from '@/components/v2/command-palette-context';
import { useSite } from '@/components/v2/site-context';
import { getTheme, toggleTheme, THEME_CHANGE_EVENT } from '@/lib/theme';
import { hasCaseStudy } from '@/lib/types';

const FOOTER_ICONS: Record<string, typeof FileText> = {
  resume: FileText,
};

const ITEM_CLASS = 'text-0_7 text-foreground data-[selected=true]:bg-muted data-[selected=true]:border-l-foreground data-[selected=true]:text-foreground [&_svg]:text-muted-foreground data-[selected=true]:*:[svg]:text-foreground';
const GROUP_CLASS = 'text-foreground [&_[cmdk-group-heading]]:font-sans [&_[cmdk-group-heading]]:not-italic [&_[cmdk-group-heading]]:text-0_6 [&_[cmdk-group-heading]]:text-muted-foreground';

export function CommandPalette() {
  const { site, navItems, projects } = useSite();
  const { open, setOpen } = useCommandPalette();
  const router = useRouter();
  const [dark, setDark] = useState<boolean | null>(null);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(getTheme() === 'dark');
    const onChange = () => setDark(getTheme() === 'dark');
    window.addEventListener(THEME_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command palette"
      description="Jump to a section, a project or view links"
      className="rounded-lg border-border max-w-dialog-md font-sans not-italic"
      commandClassName="bg-popover text-foreground font-sans"
    >
      <CommandInput
        autoFocus
        placeholder="Jump to a section, a project, toggle theme…"
        className="font-sans not-italic text-0_8 text-foreground placeholder:text-0_7 placeholder:text-muted-foreground"
        wrapperClassName="border-border focus-within:border-foreground/40"
      />
      <CommandList className="gz-scroll">
        <CommandEmpty className="text-0_7 text-muted-foreground font-sans not-italic">No results.</CommandEmpty>

        <CommandGroup heading="Go to" className={GROUP_CLASS}>
          {navItems.map((item) => {
            const Icon = iconForRoute(item.href);
            return (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => run(() => router.push(item.href))}
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
            {dark ? 'Switch to light mode' : 'Switch to dark mode'}
          </CommandItem>
          {site.footerLinks.map((l) => {
            const key = Object.keys(FOOTER_ICONS).find((k) => l.label.toLowerCase().includes(k));
            const Icon = key ? FOOTER_ICONS[key] : Mail;
            return (
              <CommandItem
                key={l.label}
                value={l.label}
                onSelect={() => run(() => window.open(l.href, '_blank', 'noopener,noreferrer'))}
                className={ITEM_CLASS}
              >
                <FooterLinkIcon label={l.label} fallback={Icon} className="size-icon-xs" />
                {l.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
