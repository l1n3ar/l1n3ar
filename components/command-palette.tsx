'use client';
import { useEffect, useState } from 'react';
import { BookOpen, SunMoon, FolderGit2, Link, FileDown, Mail } from 'lucide-react';
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
} from '@/components/ui/command';
import type { Project, SiteConfig } from '@/lib/schema';

const LINK_ICONS: Record<string, typeof FolderGit2> = {
  github: FolderGit2,
  linkedin: Link,
  'resume.pdf': FileDown,
  email: Mail,
};

function toggleTheme() {
  const next = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', next);
  localStorage.setItem('theme', next ? 'dark' : 'light');
}

export function CommandPalette({
  projects, site, onSelectProject, onOpenCase,
}: {
  projects: Project[];
  site: SiteConfig;
  onSelectProject: (id: string) => void;
  onOpenCase: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="command palette" description="jump to a project, toggle theme, view links">
      <CommandInput autoFocus placeholder="jump to a project, toggle theme, view links…" />
      <CommandList>
        <CommandEmpty>no results.</CommandEmpty>

        {/* <CommandGroup heading="projects">
          {projects.map((p) => (
            <CommandItem
              key={p.id}
              value={`project ${p.name} ${p.line}`}
              onSelect={() => run(() => onSelectProject(p.id))}
            >
              <FileText />
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup> */}

        <CommandGroup heading="read the full case">
          {projects.filter((p) => p.body && p.body.length > 0).map((p) => (
            <CommandItem
              key={p.id}
              value={`case study ${p.name}`}
              onSelect={() => run(() => onOpenCase(p.id))}
            >
              <BookOpen />
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="actions">
          <CommandItem value="toggle theme dark light mode" onSelect={() => run(toggleTheme)}>
            <SunMoon />
            toggle dark / light mode
          </CommandItem>
          {site.footerLinks.map((l) => {
            const Icon = LINK_ICONS[l.label] ?? FileDown;
            return (
              <CommandItem
                key={l.label}
                value={l.label}
                onSelect={() => run(() => window.open(l.href, '_blank', 'noopener,noreferrer'))}
              >
                <Icon />
                {l.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
