import type { Project } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { metaItalic } from '@/lib/typography';

export function ProjectRow({
  project, onSelect, variant = 'compact',
}: { project: Project; onSelect: (id: string) => void; variant?: 'primary' | 'compact' }) {
  const isPrimary = variant === 'primary';
  return (
    <Button
      variant="ghost"
      onClick={() => onSelect(project.id)}
      className={
        isPrimary
          ? 'block w-full text-ink text-left h-auto rounded-none border-0 border-b border-g/16 py-2.5 px-2.5 hover:bg-g/7'
          : 'block w-full text-ink text-left h-auto rounded-none border-0 border-b border-g/16 py-2.5 px-1 hover:bg-g/6'
      }
    >
      <div className="flex items-baseline gap-2.5">
        <span className={`font-heading min-w-0 break-words ${isPrimary ? 'text-1_2' : 'text-1_1'}`}>{project.name}</span>
        <span className={`${metaItalic} text-ink/42 ml-auto shrink-0`}>{project.year}</span>
      </div>
      <div
        className={
          isPrimary
            ? 'text-0_8 leading-snug text-ink/68 mt-0.5 break-words'
            : 'text-0_8 leading-snug text-ink/65 line-clamp-3 whitespace-normal break-words'
        }
      >
        {project.line}
      </div>
    </Button>
  );
}
