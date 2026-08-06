import { Link as GithubIcon, ExternalLink, Send } from 'lucide-react';
import { CaseStudyBody } from '@/components/v2/sections/case-study-body';
import { Input } from '@/components/ui/input';
import { hueForKey, pastelChipStyle } from '@/lib/pastel';
import { hasCaseStudy, type Project } from '@/lib/types';

const ICON_STROKE = 1.75;

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="h-full min-h-0 flex gap-2.5">
      <div className="min-w-0 flex-1 overflow-y-auto gz-scroll border border-border rounded-lg p-4">
        <h1 className="text-[1.0625rem] font-semibold mb-1">{project.name}</h1>
        <div className="text-0_7 text-muted-foreground mb-3.5">
          {project.org} · {project.year} · {project.role}
        </div>
        <p className="text-0_8 leading-relaxed mb-3.5">{project.description}</p>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-0_7 px-2.5 py-1.5 rounded-md border border-border bg-card flex items-center gap-1.5"
            >
              <GithubIcon className="size-icon-xs" strokeWidth={ICON_STROKE} /> Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-0_7 px-2.5 py-1.5 rounded-md border border-border bg-card flex items-center gap-1.5"
            >
              <ExternalLink className="size-icon-xs" strokeWidth={ICON_STROKE} /> Demo
            </a>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {project.tech.map((t) => (
            <span key={t} className="text-0_6 px-2 py-0.5 rounded-full bg-muted text-foreground">{t}</span>
          ))}
        </div>

        {hasCaseStudy(project) && (
          <div className="border-t border-border pt-4">
            <h2 className="text-0_8 font-semibold mb-3">Case study</h2>
            <CaseStudyBody body={project.body} />
          </div>
        )}
      </div>

      <ProjectAskPanel project={project} />
    </div>
  );
}

// Static for now — wires up to the real RAG endpoint once the Ask section ships.
function ProjectAskPanel({ project }: { project: Project }) {
  return (
    <div className="w-[26rem] shrink-0 flex flex-col border border-border rounded-lg p-4">
      <div className="text-0_6 font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        Ask about {project.name}
      </div>
      <div className="flex-1 flex flex-col gap-2 justify-end mb-2.5">
        {project.asks.map((ask) => {
          const chipStyle = pastelChipStyle(hueForKey(ask));
          return (
            <button
              key={ask}
              type="button"
              className="pastel-chip text-0_7 text-left px-3 py-2 rounded-full self-start"
              style={chipStyle}
            >
              {ask}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-1.5 border border-border rounded-lg px-2.5 py-2 bg-card">
        <Input
          placeholder="ask something…"
          className="flex-1 min-w-0 h-auto border-none shadow-none px-0 bg-transparent text-0_7 focus-visible:ring-0"
        />
        <button
          type="button"
          className="size-icon-xl rounded-md bg-foreground text-background flex items-center justify-center shrink-0"
          aria-label="send"
        >
          <Send className="size-icon-xs" strokeWidth={ICON_STROKE} />
        </button>
      </div>
    </div>
  );
}
