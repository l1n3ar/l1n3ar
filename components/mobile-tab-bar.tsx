'use client';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'about', label: 'about' },
  { id: 'projects', label: 'projects' },
  { id: 'details', label: 'details' },
  { id: 'ask', label: 'ask' },

] as const;

export type MobileTab = (typeof TABS)[number]['id'];

export function MobileTabBar({
  active, onChange,
}: { active: MobileTab; onChange: (tab: MobileTab) => void }) {
  return (
    <div className="flex border-b border-g shrink-0">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            'flex-1 py-2.5 font-heading italic text-0_8 text-center border-b-2 -mb-px transition-colors duration-200',
            active === t.id ? 'border-g text-g' : 'border-transparent text-ink/50',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
