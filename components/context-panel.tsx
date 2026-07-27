import { Icon } from './icon';
import type { Project, TechIconMap } from '@/lib/schema';

export function ContextPanel({
  project, iconMap, onOpenCase,
}: { project: Project; iconMap: TechIconMap; onOpenCase: (id: string) => void }) {
  return (
    <div className="px-6 py-4 flex flex-col min-h-0 overflow-auto">
      <div className="font-heading italic text-0_8 text-g mb-2.5">{project.name}</div>
      <div className="text-sm leading-snug mb-4.5">{project.line}</div>

      <div className="flex flex-wrap gap-2.5 items-center mb-4">
        {project.tech.map((t) => <Icon key={t} tech={t} iconMap={iconMap} />)}
      </div>

      <div className="flex flex-col gap-2 mb-4.5">
        {project.github && (
          <a href={project.github} className="font-heading italic text-0_8 border border-g text-g px-3 py-1.5 rounded-sm text-center hover:bg-g/10">
            view code →
          </a>
        )}
        {project.demo && (
          <a href={project.demo} className="font-heading italic text-0_8 border border-g text-g px-3 py-1.5 rounded-sm text-center hover:bg-g/10">
            view demo →
          </a>
        )}
        {project.bodyHtml && project.bodyHtml.trim().length > 0 && (
          <button
            type="button"
            onClick={() => onOpenCase(project.id)}
            className="font-heading italic text-0_8 bg-g text-cream border-0 px-3 py-2 rounded-sm cursor-pointer"
          >
            read the full case
          </button>
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
