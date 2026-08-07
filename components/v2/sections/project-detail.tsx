'use client';
import { useState } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AskChat } from '@/components/v2/sections/ask-chat';
import { CaseStudyBody } from '@/components/v2/sections/case-study-body';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BRAND_ICONS } from '@/components/v2/tech-icons';
import { useSite } from '@/components/v2/site-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSplitResize } from '@/hooks/use-split-resize';
import { cn, slugify } from '@/lib/utils';
import { hasCaseStudy, type Project } from '@/lib/types';

const ICON_STROKE = 1.75;

function SectionToc({ project }: { project: Project }) {
  const [open, setOpen] = useState(true);
  const sections = (project.body ?? [])
    .filter((b) => b._type === 'caseSection')
    .map((b) => ({ id: slugify(b.heading), heading: b.heading }));
  if (sections.length < 2) return null;

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sticky top-0 z-10 mb-4 bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 py-1 text-0_6 font-semibold text-muted-foreground uppercase tracking-wide"
      >
        Jump to a section
        <ChevronDown className={cn('size-icon-xs transition-transform', open && 'rotate-180')} strokeWidth={ICON_STROKE} />
      </button>
  
      <div className={cn('grid transition-[grid-template-rows] duration-200 ease-out', open ? 'grid-rows-[1fr] mt-2' : 'grid-rows-[0fr]')}>
        <div className="overflow-hidden">
          <ol className="bg-muted text-foreground rounded-lg p-3">
            {sections.map((s, i) => {
              const isLast = i === sections.length - 1;
              return (
                <li key={s.id} className="flex gap-2.5">
                  <div className="flex flex-col items-center w-2.5 shrink-0">
                    <span className="w-[0.4375rem] h-[0.4375rem] rounded-full mt-1 shrink-0 bg-foreground/60" />
                    {!isLast && <span className="w-px flex-1 bg-foreground/25 mt-0.5" />}
                  </div>
                  <button
                    type="button"
                    onClick={() => jumpTo(s.id)}
                    className="flex-1 min-w-0 text-left text-0_7 capitalize text-foreground/80 truncate pb-2.5 hover:text-foreground"
                  >
                    {s.heading}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

function ProjectNav({ prev, next }: { prev?: Project; next?: Project }) {
  const router = useRouter();
  if (!prev && !next) return null;

  return (
    <div className="flex items-stretch gap-2.5 mt-6 pt-4 border-t border-border">
      {prev ? (
        <button
          type="button"
          onClick={() => router.push(`/projects/${prev.id}`)}
          className="flex-1 min-w-0 flex items-center gap-1.5 text-left px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted"
        >
          <ChevronLeft className="size-icon-xs shrink-0 text-muted-foreground" strokeWidth={ICON_STROKE} />
          <span className="min-w-0">
            <span className="block text-0_6 text-muted-foreground">Previous</span>
            <span className="block text-0_7 font-semibold truncate">{prev.name}</span>
          </span>
        </button>
      ) : <div className="flex-1" />}
      {next ? (
        <button
          type="button"
          onClick={() => router.push(`/projects/${next.id}`)}
          className="flex-1 min-w-0 flex items-center justify-end gap-1.5 text-right px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted"
        >
          <span className="min-w-0">
            <span className="block text-0_6 text-muted-foreground">Next</span>
            <span className="block text-0_7 font-semibold truncate">{next.name}</span>
          </span>
          <ChevronRight className="size-icon-xs shrink-0 text-muted-foreground" strokeWidth={ICON_STROKE} />
        </button>
      ) : <div className="flex-1" />}
    </div>
  );
}

export function ProjectDetail({ project }: { project: Project }) {
  const { containerRef, leftPercent, startResize, onResizeMove, endResize } = useSplitResize();
  const isMobile = useIsMobile();
  const { projects } = useSite();
  const askTitle = `Ask about ${project.name}`;

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : undefined;
  const nextProject = currentIndex >= 0 && currentIndex < projects.length - 1 ? projects[currentIndex + 1] : undefined;

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
          <SectionToc project={project} />
          <CaseStudyBody body={project.body} />
        </div>
      )}

      <ProjectNav prev={prevProject} next={nextProject} />
    </>
  );

  if (isMobile) {
    return (
      <Tabs defaultValue="case-study" className="flex-1 min-h-0 flex flex-col">
        <TabsList variant="line" className="mb-3 shrink-0">
          <TabsTrigger value="case-study" className="text-0_7">Case study</TabsTrigger>
          <TabsTrigger value="ask" className="text-0_7">{askTitle}</TabsTrigger>
        </TabsList>
        <TabsContent value="case-study" className="min-h-0 flex-1 overflow-y-auto border border-border rounded-lg bg-card p-4 thin-scroll">
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
      <div className="min-w-0 overflow-y-auto border border-border rounded-lg bg-card p-4 thin-scroll" style={{ width: `${leftPercent}%` }}>
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
