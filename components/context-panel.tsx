import { Icon } from './icon';
import type { Project, TechIconMap } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { kicker } from '@/lib/typography';

export function ContextPanel({
  project, iconMap, onOpenCase,
}: { project: Project; iconMap: TechIconMap; onOpenCase: (id: string) => void }) {
  const metricsJson = JSON.stringify(Object.fromEntries(project.metrics.map((m) => [m.key, m.value])), null, 2);

  return (
    <div className="px-6 py-4 flex flex-col min-h-0 min-w-0 overflow-y-auto overflow-x-hidden">
      <div className={`${kicker} mb-2.5`}>{project.name}</div>
      <div className="text-sm leading-snug mb-4.5 break-words">{project.line}</div>

      <div className="flex flex-wrap items-center gap-2 pt-3.5 mb-4 border-t border-g/25">
        {project.tech.map((t) => <Icon key={t} tech={t} iconMap={iconMap} />)}
      </div>

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
        {project.bodyHtml && project.bodyHtml.trim().length > 0 && (
          <Button variant="solid" className="font-heading italic" onClick={() => onOpenCase(project.id)}>
            read the full case
          </Button>
        )}
      </div>

      <div className="mt-auto pt-3.5 border-t border-g/25">
        <pre className="font-mono text-0_7 leading-relaxed text-ink/62 whitespace-pre-wrap break-words m-0">{metricsJson}</pre>
      </div>
    </div>
  );
}
