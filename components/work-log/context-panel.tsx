'use client';
import { useEffect, useState } from 'react';
import { hasCaseStudy, type Project } from '@/lib/types';
import { Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { kicker, metaItalic } from '@/lib/typography';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/copy-button';

export function ContextPanel({
  project, onOpenCase,
}: { project: Project; onOpenCase: (id: string) => void }) {
  const metricsJson = JSON.stringify(Object.fromEntries(project.metrics.map((m) => [m.key, m.value])), null, 2);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [project.id]);

  return (
    <div
      className={cn(
        'flex-1 gz-scroll px-6 pt-4 pb-4 flex flex-col min-h-0 min-w-0 overflow-y-auto overflow-x-hidden scroll-smooth transition-opacity duration-300 ease-in-out',
        visible ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`${kicker} text-1_2`}>{project.name}</div>
        <CopyButton
          text={() => `${window.location.origin}${window.location.pathname}?project=${project.id}`}
          label="copy link to this project"
          tooltip="copy link"
          icon={Link2}
          className="h-6 w-6 text-ink/35 hover:text-g"
        />
      </div>
      <div className="text-xs leading-snug mb-4 break-words">{project.description}</div>

      <div className="flex flex-col gap-2 mb-4.5">
        {project.github && (
          <Button variant="outline" render={<a href={project.github} />} className="justify-center font-heading italic">
            view code →
          </Button>
        )}
        {project.demo && (
          <Button variant="outline" render={<a href={project.demo} />} className="justify-center font-heading italic">
            view demo →
          </Button>
        )}
        {hasCaseStudy(project) && (
          <Button variant="default" className="font-heading italic" onClick={() => onOpenCase(project.id)}>
            read the full case →
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto border-g border-t pt-4">
        {project.tech.map((t) => (
          <span key={t} className={`${metaItalic} text-g border border-g/30 rounded-sm px-1.5 py-0.5`}>
            {t}
          </span>
        ))}
      </div>
      <pre className="font-mono text-0_7 leading-relaxed text-ink/62 whitespace-pre-wrap break-words mt-4">{metricsJson}</pre>
    </div>
  );
}
