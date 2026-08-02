'use client';
import { useRef, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { Project, ProjectCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ProjectRow } from './project-row';
import { CategoryTabs } from './category-tabs';
import { kicker } from '@/lib/typography';

export function WorkLog({
  projects, selectedId, onSelect, activeCategory, onCategoryChange,
}: {
  projects: Project[];
  selectedId?: string;
  onSelect: (id: string) => void;
  activeCategory: ProjectCategory;
  onCategoryChange: (category: ProjectCategory) => void;
}) {
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [cursor, setCursor] = useState(0);

  const step = (dir: 1 | -1) => {
    const next = Math.min(Math.max(cursor + dir, 0), projects.length - 1);
    setCursor(next);
    rowRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <>
      <div data-worklog-header className="px-6 pt-4 pb-2 flex items-center gap-2.5">
        <div className='flex flex-col gap-2 mb-4'>
        <div className={`${kicker} !text-lg`}>work</div>
        <CategoryTabs active={activeCategory} onChange={onCategoryChange} />
        </div>

        <div className="ml-auto flex gap-1">
          <Button variant="ghost" size="icon" aria-label="scroll up" disabled={cursor === 0} onClick={() => step(-1)}>
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="scroll down"
            disabled={cursor === projects.length - 1}
            onClick={() => step(1)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 px-6 pb-3 overflow-y-auto overflow-x-hidden scroll-smooth gz-scroll">
        {projects.map((p, i) => (
          <ProjectRow
            key={p.id}
            ref={(el) => { rowRefs.current[i] = el; }}
            project={p}
            selected={p.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </>
  );
}
