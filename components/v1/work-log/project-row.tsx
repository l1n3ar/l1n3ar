import { forwardRef } from 'react';
import type { Project } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ProjectRow = forwardRef<HTMLButtonElement, {
  project: Project; selected: boolean; onSelect: (id: string) => void;
}>(function ProjectRow({ project, selected, onSelect }, ref) {
  return (
    <Button
      ref={ref}
      variant="ghost"
      onClick={() => onSelect(project.id)}
      className={cn(
        'block w-full whitespace-normal text-ink text-left h-auto rounded-none border-0 border-b border-g/16 border-l-4 py-2 px-3 transition-colors duration-200',
        selected ? 'border-l-g' : 'border-l-transparent hover:bg-g/6 hover:border-l-g/30'
      )}
    >
      <span className="font-heading text-1_2 break-words">{project.name}</span>
      <div className="text-0_8 leading-snug text-ink/68 mt-0.5 break-words">{project.line}</div>
    </Button>
  );
});
