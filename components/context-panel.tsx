import { Icon } from './icon';
import type { Project, TechIconMap } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { kicker } from '@/lib/typography';

export function ContextPanel({
  project, iconMap, onOpenCase,
}: { project: Project; iconMap: TechIconMap; onOpenCase: (id: string) => void }) {
  return (
    <div className="px-6 py-4 flex flex-col min-h-0 overflow-auto">
      <div className={`${kicker} mb-2.5`}>{project.name}</div>
      <div className="text-sm leading-snug mb-4.5">{project.line}</div>

      <div className="flex items-center pt-3.5 mb-4 border-t border-g/25">
        {project.tech.map((t) => <Icon key={t} tech={t} iconMap={iconMap} />)}
      </div>

      <div className="flex flex-col gap-2 mb-4.5">
        {project.github && (
          <Button variant="outline" asChild className="justify-center">
            <a href={project.github}>view code →</a>
          </Button>
        )}
        {project.demo && (
          <Button variant="outline" asChild className="justify-center">
            <a href={project.demo}>view demo →</a>
          </Button>
        )}
        {project.bodyHtml && project.bodyHtml.trim().length > 0 && (
          <Button variant="solid" onClick={() => onOpenCase(project.id)}>
            read the full case
          </Button>
        )}
      </div>

      <div className="mt-auto pt-3.5 border-t border-g/25">
        <pre className="font-mono text-0_7 leading-relaxed text-ink/62 whitespace-pre-wrap m-0">
{'{'}
{project.metrics.map((m) => `  "${m.key}": "${m.value}",\n`).join('')}{'}'}
        </pre>
      </div>
    </div>
  );
}
