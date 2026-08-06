'use client';
import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { projectIcon } from '@/components/v2/sections/project-icons';
import { BRAND_ICONS } from '@/components/v2/tech-icons';
import { hueForKey, pastelChipStyle } from '@/lib/pastel';
import type { Project } from '@/lib/types';

const ICON_STROKE = 1.75;

export function ProjectCard({ project, showCategory }: { project: Project; showCategory?: boolean }) {
  const router = useRouter();
  const Icon = projectIcon(project.id);
  const chipStyle = pastelChipStyle(hueForKey(project.id));
  const hasLinks = Boolean(project.github || project.demo);

  const openLink = (e: React.MouseEvent, href: string) => {
    e.stopPropagation();
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={() => router.push(`/projects/${project.id}`)}
      className="group relative flex flex-col text-left border border-border rounded-lg bg-card overflow-hidden shadow-sm"
    >
      <div className="relative flex-1 flex flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between">
          <div className="pastel-chip size-icon-2xl rounded-lg flex items-center justify-center" style={chipStyle}>
            <Icon className="size-icon-sm" strokeWidth={ICON_STROKE} />
          </div>
          <div className="text-right shrink-0 mt-1">
            <span className="text-0_6 text-muted-foreground block">{project.year}</span>
            {showCategory && (
              <span className="text-0_6 capitalize text-muted-foreground/70 block">{project.category}</span>
            )}
          </div>
        </div>
        <div>
          <span className="text-0_8 font-semibold">{project.name}</span>
          <p className="text-0_7 text-muted-foreground leading-snug mt-0.5">{project.line}</p>
        </div>
        <div className="mt-auto flex items-center gap-2 flex-wrap">
          {project.tech.map((t) => (
            <span key={t} className="text-0_6 capitalize px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        <div
          className="pastel-chip absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center p-4"
          style={chipStyle}
        >
          <p className="text-0_7 leading-relaxed">{project.description}</p>
        </div>
      </div>

      {hasLinks && (
        <div className="border-t border-border p-2 flex gap-1.5">
          {project.github && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={(e) => openLink(e, project.github!)}
                    aria-label="code"
                    className="size-icon-xl rounded-md border border-border flex items-center justify-center text-foreground hover:bg-muted"
                  />
                }
              >
                <BRAND_ICONS.github className="size-icon-xs" color="currentColor" />
              </TooltipTrigger>
              <TooltipContent className="text-0_6 font-sans not-italic">Code</TooltipContent>
            </Tooltip>
          )}
          {project.demo && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={(e) => openLink(e, project.demo!)}
                    aria-label="demo"
                    className="size-icon-xl rounded-md border border-border flex items-center justify-center text-foreground hover:bg-muted"
                  />
                }
              >
                <ExternalLink className="size-icon-xs" strokeWidth={ICON_STROKE} />
              </TooltipTrigger>
              <TooltipContent className="text-0_6 font-sans not-italic">View demo</TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
    </button>
  );
}
