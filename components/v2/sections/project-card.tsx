'use client';
import { useRouter } from 'next/navigation';
import {
  Terminal, Code2, Activity, GitCommit, MessageSquare, Tag, FolderKanban, Music2, User,
  Link as GithubIcon, ExternalLink, type LucideIcon,
} from 'lucide-react';
import { hueForKey, pastelChipStyle } from '@/lib/pastel';
import type { Project } from '@/lib/types';

const ICON_STROKE = 1.75;

// Cycled by the project's position in the full (unfiltered) list, so a project's icon
// stays stable regardless of which category tab is active.
const PROJECT_ICONS: LucideIcon[] = [Terminal, Code2, Activity, GitCommit, MessageSquare, Tag, FolderKanban, Music2, User];

export function ProjectCard({
  project, index, view,
}: {
  project: Project; index: number; view: 'grid' | 'list';
}) {
  const router = useRouter();
  const Icon = PROJECT_ICONS[index % PROJECT_ICONS.length];
  const chipStyle = pastelChipStyle(hueForKey(project.id));

  const openLink = (e: React.MouseEvent, href: string) => {
    e.stopPropagation();
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const links = (
    <>
      {project.github && (
        <button
          type="button"
          onClick={(e) => openLink(e, project.github!)}
          aria-label="code"
          className="size-5 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <GithubIcon className="size-3" strokeWidth={ICON_STROKE} />
        </button>
      )}
      {project.demo && (
        <button
          type="button"
          onClick={(e) => openLink(e, project.demo!)}
          aria-label="demo"
          className="size-5 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <ExternalLink className="size-3" strokeWidth={ICON_STROKE} />
        </button>
      )}
    </>
  );

  const techChips = (
    <div className="flex items-center gap-1.5 flex-wrap">
      {project.tech.map((t) => (
        <span key={t} className="text-0_6 px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t}</span>
      ))}
    </div>
  );

  if (view === 'list') {
    return (
      <button
        type="button"
        onClick={() => router.push(`/projects/${project.id}`)}
        className="group relative flex items-stretch text-left border-b border-border py-2.5 gap-2"
      >
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <div className="pastel-chip size-6 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={chipStyle}>
            <Icon className="size-3.5" strokeWidth={ICON_STROKE} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-1.5">
              <span className="text-0_8 font-semibold">{project.name}</span>
              <span className="text-0_6 text-muted-foreground shrink-0">{project.year}</span>
            </div>
            <p className="text-0_7 text-muted-foreground leading-snug">{project.line}</p>
            <div className="mt-1.5">{techChips}</div>
          </div>
          <div className="absolute inset-0 rounded-lg bg-card/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center px-4">
            <p className="text-0_7 leading-relaxed">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 border-l border-border pl-2.5 ml-1">{links}</div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.push(`/projects/${project.id}`)}
      className="group relative flex flex-col text-left border border-border rounded-lg bg-card overflow-hidden"
    >
      <div className="relative flex-1 flex flex-col gap-2 p-3.5">
        <div className="pastel-chip size-7 rounded-lg flex items-center justify-center" style={chipStyle}>
          <Icon className="size-3.5" strokeWidth={ICON_STROKE} />
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-1.5">
            <span className="text-0_8 font-semibold">{project.name}</span>
            <span className="text-0_6 text-muted-foreground shrink-0">{project.year}</span>
          </div>
          <p className="text-0_7 text-muted-foreground leading-snug mt-0.5">{project.line}</p>
        </div>
        <div className="mt-auto">{techChips}</div>
        <div className="absolute inset-0 bg-card/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center p-4">
          <p className="text-0_7 leading-relaxed">{project.description}</p>
        </div>
      </div>
      <div className="border-t border-border p-2 flex gap-1.5">{links}</div>
    </button>
  );
}
