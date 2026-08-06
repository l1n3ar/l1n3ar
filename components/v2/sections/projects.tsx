'use client';
import { useMemo, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ProjectCard } from '@/components/v2/sections/project-card';
import { TechIcon } from '@/components/v2/tech-icons';
import { PROJECT_CATEGORIES, type Project, type ProjectCategory } from '@/lib/types';

const ICON_STROKE = 1.75;
type CategoryFilter = ProjectCategory | 'all';

export function Projects({ projects }: { projects: Project[] }) {
  const categories = PROJECT_CATEGORIES.filter((c) => projects.some((p) => p.category === c));
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [tech, setTech] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const inCategory = category === 'all' ? projects : projects.filter((p) => p.category === category);
  const techOptions = useMemo(
    () => Array.from(new Set(inCategory.flatMap((p) => p.tech))).sort(),
    [inCategory],
  );

  const q = query.trim().toLowerCase();
  const filtered = inCategory.filter((p) => {
    if (tech && !p.tech.includes(tech)) return false;
    if (q && !`${p.name} ${p.line} ${p.tech.join(' ')}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const selectCategory = (c: CategoryFilter) => {
    setCategory(c);
    setTech(null);
  };

  return (
    <div>
      <h1 className="text-0_9 font-semibold mb-3.5">Projects</h1>

      <div className="flex items-center justify-between gap-4  mb-4">
        <Tabs value={category} onValueChange={(v) => selectCategory(v as CategoryFilter)}>
          <TabsList variant="line">
            {(['all', ...categories] as const).map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-0_7 capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2 pb-2">
          <div className="relative w-40">
            <Search
              className="size-icon-xs absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              strokeWidth={ICON_STROKE}
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="pl-7 h-7 text-0_6"
            />
          </div>

          {techOptions.length > 0 && (
            <Popover>
              <PopoverTrigger
                render={
                  <Button variant={tech ? 'secondary' : 'outline'} size="icon-sm" aria-label="filter by tech" />
                }
              >
                <Filter className="size-icon-sm" strokeWidth={ICON_STROKE} />
              </PopoverTrigger>
              <PopoverContent className="w-56 max-h-72 overflow-y-auto font-sans not-italic" align="end">
                <div className="flex flex-col gap-0.5">
                  {techOptions.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTech((current) => (current === t ? null : t))}
                      className={`text-0_7 capitalize text-left px-2 py-1.5 rounded-md flex items-center gap-2 ${
                        tech === t ? 'bg-foreground text-background' : 'hover:bg-muted'
                      }`}
                    >
                      <TechIcon name={t} className="size-icon-xs" />
                      {t}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {tech && (
        <div className="flex items-center gap-1.5 mb-4">
          <span className="text-0_6 text-muted-foreground">Filtered by</span>
          <button
            type="button"
            onClick={() => setTech(null)}
            className="text-0_6 capitalize flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-foreground text-background"
          >
            <TechIcon name={tech} className="size-icon-xs" />
            {tech}
            <X className="size-icon-xs" strokeWidth={ICON_STROKE} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} showCategory={category === 'all'} />
        ))}
      </div>
    </div>
  );
}
