'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/lib/types';

const ICON_STROKE = 1.75;

export function ProjectNav({ prev, next }: { prev?: Project; next?: Project }) {
  const router = useRouter();
  if (!prev && !next) return null;

  return (
    <div className="flex items-stretch gap-2.5 mt-6 pt-4 border-t border-border">
      {prev ? (
        <button
          type="button"
          onClick={() => router.push(`/projects/${prev.id}`)}
          className="flex-1 min-w-0 flex items-center gap-1.5 text-left px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted"
        >
          <ChevronLeft className="size-icon-xs shrink-0 text-muted-foreground" strokeWidth={ICON_STROKE} />
          <span className="min-w-0">
            <span className="block text-0_6 text-muted-foreground">Previous</span>
            <span className="block text-0_7 font-semibold truncate">{prev.name}</span>
          </span>
        </button>
      ) : <div className="flex-1" />}
      {next ? (
        <button
          type="button"
          onClick={() => router.push(`/projects/${next.id}`)}
          className="flex-1 min-w-0 flex items-center justify-end gap-1.5 text-right px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted"
        >
          <span className="min-w-0">
            <span className="block text-0_6 text-muted-foreground">Next</span>
            <span className="block text-0_7 font-semibold truncate">{next.name}</span>
          </span>
          <ChevronRight className="size-icon-xs shrink-0 text-muted-foreground" strokeWidth={ICON_STROKE} />
        </button>
      ) : <div className="flex-1" />}
    </div>
  );
}
