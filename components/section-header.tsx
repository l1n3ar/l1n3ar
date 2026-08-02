import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { kicker } from '@/lib/typography';
import { cn } from '@/lib/utils';

export function SectionHeader({
  label, open, onToggle, className,
}: { label: ReactNode; open: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(kicker, 'flex items-center gap-1 w-full text-left' , className)}
    >
      {label}
      <ChevronDown className={cn('h-3 w-3 transition-transform duration-200', open ? '' : '-rotate-90')} />
    </button>
  );
}
