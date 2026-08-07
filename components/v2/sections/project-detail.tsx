'use client';
import { ExternalLink } from 'lucide-react';
import { AskChat } from '@/components/v2/sections/ask-chat';
import { CaseStudyBody } from '@/components/v2/sections/case-study-body';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BRAND_ICONS } from '@/components/v2/tech-icons';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSplitResize } from '@/hooks/use-split-resize';
import { hasCaseStudy, type Project } from '@/lib/types';

const ICON_STROKE = 1.75;

export function ProjectDetail({ project }: { project: Project }) {
  const { containerRef, leftPercent, startResize, onResizeMove, endResize } = useSplitResize();
  const isMobile = useIsMobile();
  const askTitle = `Ask about ${project.name}`;

  const caseStudyContent = (
    <>
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
          <CaseStudyBody body={project.body} />
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Tabs defaultValue="case-study" className="flex-1 min-h-0 flex flex-col">
        <TabsList variant="line" className="mb-3 shrink-0">
          <TabsTrigger value="case-study" className="text-0_7">Case study</TabsTrigger>
          <TabsTrigger value="ask" className="text-0_7">{askTitle}</TabsTrigger>
        </TabsList>
        <TabsContent value="case-study" className="min-h-0 flex-1 overflow-y-auto border border-border rounded-lg p-4 thin-scroll">
          {caseStudyContent}
        </TabsContent>
        <TabsContent value="ask" className="min-h-0 flex-1 flex flex-col">
          <AskChat
            project={project}
            inputPosition="bottom"
            className="flex-1 min-h-0"
          />
        </TabsContent>
      </Tabs>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 min-h-0 flex"
      onPointerMove={onResizeMove}
      onPointerUp={endResize}
      onPointerCancel={endResize}
    >
      <div className="min-w-0 overflow-y-auto border border-border rounded-lg p-4 thin-scroll" style={{ width: `${leftPercent}%` }}>
        {caseStudyContent}
      </div>

      <div
        onPointerDown={startResize}
        className="w-2.5 shrink-0 cursor-col-resize flex items-center justify-center group"
      >
        <div className="w-px h-8 bg-muted-foreground/40 group-hover:bg-muted-foreground/50" />
      </div>

      <AskChat
        project={project}
        inputPosition="bottom"
        className="shrink-0"
        style={{ width: `${100 - leftPercent}%` }}
      />
    </div>
  );
}
