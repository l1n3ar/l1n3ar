import type { Project } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { kicker } from '@/lib/typography';
import { caseStudies } from '@/components/case-study/registry';

export function ContextPanel({
  project, onOpenCase,
}: { project: Project; onOpenCase: (id: string) => void }) {
  const metricsJson = JSON.stringify(Object.fromEntries(project.metrics.map((m) => [m.key, m.value])), null, 2);

  return (
    <div className="px-6 pt-4 pb-4 flex flex-col min-h-0 min-w-0 overflow-y-auto overflow-x-hidden scroll-smooth">
      <div className={`${kicker} text-1_2 mb-2`}>{project.name}</div>
      <div className="text-xs leading-snug mb-4 break-words">{project.description}</div>

      <div className="flex flex-col gap-2 mb-4.5">
        {project.github && (
          <Button variant="outline" asChild className="justify-center font-heading italic">
            <a href={project.github}>view code →</a>
          </Button>
        )}
        {project.demo && (
          <Button variant="outline" asChild className="justify-center font-heading italic">
            <a href={project.demo}>view demo →</a>
          </Button>
        )}
        {caseStudies[project.id] && (
          <Button variant="solid" className="font-heading italic" onClick={() => onOpenCase(project.id)}>
            read the full case →
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto border-g border-t pt-4">
        {project.tech.map((t) => (
          <span key={t} className="font-heading italic text-0_7 text-g border border-g/30 rounded-sm px-1.5 py-0.5">
            {t}
          </span>
        ))}
      </div>
      <pre className="font-mono text-0_7 leading-relaxed text-ink/62 whitespace-pre-wrap break-words m-0">{metricsJson}</pre>
    </div>
  );
}
