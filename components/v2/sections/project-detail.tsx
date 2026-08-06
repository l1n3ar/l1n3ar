'use client';
import { ExternalLink } from 'lucide-react';
import { AskChat } from '@/components/v2/sections/ask-chat';
import { CaseStudyBody } from '@/components/v2/sections/case-study-body';
import { BRAND_ICONS } from '@/components/v2/tech-icons';
import { useSplitResize } from '@/hooks/use-split-resize';
import { hueForKey, tilePastel } from '@/lib/pastel';
import { hasCaseStudy, type Project } from '@/lib/types';

const ICON_STROKE = 1.75;

export function ProjectDetail({ project, siteName }: { project: Project; siteName: string }) {
  const { containerRef, leftPercent, startResize, onResizeMove, endResize } = useSplitResize();
  const accentColor = tilePastel(hueForKey(project.id)).fg;

  return (
    <div
      ref={containerRef}
      className="h-full min-h-0 flex"
      onPointerMove={onResizeMove}
      onPointerUp={endResize}
      onPointerCancel={endResize}
    >
      <div
        className="min-w-0 overflow-y-auto border border-border rounded-lg p-4 thin-scroll"
        style={{ width: `${leftPercent}%` }}
      >
        <h1 className="text-1_2 font-semibold mb-1">{project.name}</h1>
        <div className="text-0_7 text-muted-foreground mb-3.5">
          {project.org} · {project.year} · {project.role}
        </div>
        <p className="text-0_8 leading-relaxed mb-3.5">{project.description}</p>

             <div className="flex gap-1.5 flex-wrap mb-4">
          {project.tech.map((t) => (
            <span key={t} className="text-0_6 capitalize px-2 py-0.5 rounded-full bg-muted text-foreground">{t}</span>
          ))}
        </div>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-0_7 text-foreground px-2.5 py-1.5 rounded-md border border-border bg-card flex items-center gap-1.5"
            >
              <BRAND_ICONS.github className="size-icon-xs" color="currentColor" /> Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-0_7 text-foreground px-2.5 py-1.5 rounded-md border border-border bg-card flex items-center gap-1.5"
            >
              <ExternalLink className="size-icon-xs" strokeWidth={ICON_STROKE} /> View demo
            </a>
          )}
        </div>



        {hasCaseStudy(project) && (
          <div className="border-t border-border pt-4 overflow-y-auto">
            {/* <div className="w-10 h-[3px] rounded-full mb-4" style={{ backgroundColor: accentColor }} /> */}
            <CaseStudyBody body={project.body} />
          </div>
        )}
      </div>

      <div
        onPointerDown={startResize}
        className="w-2.5 shrink-0 cursor-col-resize flex items-center justify-center group"
      >
        <div className="w-px h-8 bg-muted-foreground/40 group-hover:bg-muted-foreground/50" />
      </div>

      <AskChat
        siteName={siteName}
        title={`Ask about ${project.name}`}
        suggestions={project.asks}
        apiBody={{ projectId: project.id, projectName: project.name }}
        inputPosition="bottom"
        className="shrink-0"
        style={{ width: `${100 - leftPercent}%` }}
      />
    </div>
  );
}
