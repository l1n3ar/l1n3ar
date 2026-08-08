'use client';
import { useState } from 'react';
import { ExternalLink, TriangleDashed } from 'lucide-react';
import { AskChat } from '@/components/v2/ask/ask-chat';
import { CaseStudyBody } from '@/components/v2/projects/project-detail/case-study-body';
import { SectionToc } from '@/components/v2/projects/project-detail/section-toc';
import { ProjectNav } from '@/components/v2/projects/project-detail/project-nav';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ICON_STROKE } from '@/components/v2/constants';
import { BRAND_ICONS } from '@/components/v2/tech-icons';
import { useSite } from '@/components/v2/site-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { hasCaseStudy, type Project } from '@/lib/types';

const LEFT_PERCENT = 70;

export function ProjectDetail({ project }: { project: Project }) {
  const [askOpen, setAskOpen] = useState(false);
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
        <TabsContent value="case-study" className="min-h-0 flex-1 overflow-y-auto p-4 thin-scroll">
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
    <div className="relative flex-1 min-h-0 flex gap-8">
      <div className="min-w-0 overflow-y-auto gz-scroll bg-transparent" style={{ width: askOpen ? `${LEFT_PERCENT}%` : '100%' }}>
        {caseStudyContent}
      </div>

      {askOpen ? (
        <AskChat
          project={project}
          inputPosition="bottom"
          className="shrink-0 border border-border"
          style={{ width: `${100 - LEFT_PERCENT}%` }}
          onClose={() => setAskOpen(false)}
        />
      ) : (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setAskOpen(true)}
        >
          <TriangleDashed className="size-icon-xs" strokeWidth={ICON_STROKE} />
          {askTitle}
        </Button>
      )}
    </div>
  );
}
