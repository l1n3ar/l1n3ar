'use client';
import { cn } from '@/lib/utils';
import type { ProjectCategory } from '@/lib/types';

const TABS: { id: ProjectCategory; label: string }[] = [
  { id: 'enterprise', label: 'enterprise' },
  { id: 'personal', label: 'personal' },
  // { id: 'oss', label: 'oss' }, // no open-source projects yet 
];

export function CategoryTabs({
  active, onChange,
}: { active: ProjectCategory; onChange: (category: ProjectCategory) => void }) {
  return (
    <div className="flex gap-3">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            'font-heading italic text-sm transition-colors',
            active === t.id ? 'text-g underline underline-offset-4' : 'text-ink/45 hover:text-ink/70',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
