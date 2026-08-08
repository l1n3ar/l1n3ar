'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ICON_STROKE } from '@/components/v2/constants';
import { projectIcon } from '@/components/v2/projects/project-icons';
import { BRAND_ICONS } from '@/components/v2/tech-icons';
import { keyedPastelChipStyle } from '@/lib/pastel';
import { cn } from '@/lib/utils';
import type { Project } from '@/lib/types';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';

export function ProjectCard({ project, showCategory }: { project: Project; showCategory?: boolean }) {
  const router = useRouter();
  const Icon = projectIcon(project.id);
  const chipStyle = keyedPastelChipStyle(project.id);
  const hasLinks = Boolean(project.github || project.demo);
  const [showDescription, setShowDescription] = useState(false);
  const isMobile = useIsMobile()

  const openLink = (e: React.MouseEvent, href: string) => {
    e.stopPropagation();
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const toggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDescription((v) => !v);
  };

  return (
    <button
      type="button"
      onClick={() => router.push(`/projects/${project.id}`)}
      className="group relative flex flex-col text-left border border-border rounded-lg bg-card overflow-hidden shadow-sm"
    >
      {!isMobile && (
        <div className="relative w-full h-40 shrink-0 overflow-hidden">
          <Image src={`/images/projects/${project.id}.png`} alt="" fill className="object-cover opacity-60"  />
          <div
            className="pastel-chip absolute inset-0 opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity mix-blend-color"
            style={chipStyle}
          />
        </div>
      )}

      <div className="relative flex-1 flex flex-col gap-2 p-3.5">
        <div className="flex items-start justify-between">
          <div className="pastel-chip size-icon-2xl rounded-lg flex items-center justify-center" style={chipStyle}>
            <Icon className="size-icon-sm" strokeWidth={ICON_STROKE} />
          </div>
          <div className="flex items-start gap-1 shrink-0 mt-1">
            <div className="text-right">
              <span className="text-0_6 text-muted-foreground block">{project.year}</span>
              {showCategory && (
                <span className="text-0_6 capitalize text-muted-foreground/70 block">{project.category}</span>
              )}
            </div>
            <button
              type="button"
              onClick={toggleDescription}
              aria-label={showDescription ? 'hide description' : 'show description'}
              className="relative z-30 [@media(hover:hover)]:hidden -mr-1 size-icon-lg shrink-0 rounded-md flex items-start justify-center pt-0.5 text-muted-foreground hover:bg-muted"
            >
              <Info className="size-icon-xs" strokeWidth={ICON_STROKE} />
            </button>
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
      </div>

      <div
        className={cn(
          'pastel-chip absolute inset-0 z-20 opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity flex items-center justify-center text-center p-4',
          showDescription && 'opacity-100',
        )}
        style={chipStyle}
      >
        <p className="text-0_7 leading-relaxed">{project.description}</p>
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
