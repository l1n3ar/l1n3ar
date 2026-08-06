'use client';
import { useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/v2/sections/project-card';
import { PROJECT_CATEGORIES, type Project, type ProjectCategory } from '@/lib/types';

const ICON_STROKE = 1.75;

export function Projects({ projects }: { projects: Project[] }) {
  const categories = PROJECT_CATEGORIES.filter((c) => projects.some((p) => p.category === c));
  const [category, setCategory] = useState<ProjectCategory>(categories[0]);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = projects.filter((p) => p.category === category);

  return (
    <div>
      <div className="flex items-center justify-between mb-3.5">
        <h1 className="text-0_9 font-semibold">Projects</h1>
        <div className="flex gap-1">
          <Button
            variant={view === 'grid' ? 'secondary' : 'outline'}
            size="icon-sm"
            aria-label="grid view"
            onClick={() => setView('grid')}
          >
            <LayoutGrid className="size-3.5" strokeWidth={ICON_STROKE} />
          </Button>
          <Button
            variant={view === 'list' ? 'secondary' : 'outline'}
            size="icon-sm"
            aria-label="list view"
            onClick={() => setView('list')}
          >
            <List className="size-3.5" strokeWidth={ICON_STROKE} />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-border mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`text-0_7 font-medium pb-2 border-b-2 -mb-px ${
              cat === category ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-3 gap-2.5">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} index={projects.indexOf(p)} view="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} index={projects.indexOf(p)} view="list" />
          ))}
        </div>
      )}
    </div>
  );
}
