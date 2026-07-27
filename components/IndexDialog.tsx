'use client';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { Project } from '@/lib/schema';

export type IndexDialogHandle = { open: () => void };

export const IndexDialog = forwardRef<IndexDialogHandle, { projects: Project[]; onSelect: (id: string) => void }>(
  function IndexDialog({ projects, onSelect }, ref) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    useImperativeHandle(ref, () => ({ open: () => dialogRef.current?.showModal() }));

    return (
      <dialog ref={dialogRef} className="border border-g shadow-lg p-0 bg-cream rounded-none w-[min(640px,92vw)] max-h-[88vh]">
        <div className="overflow-auto max-h-[88vh] p-8">
          <div className="flex items-baseline justify-between mb-3.5 pb-2.5 border-b border-g">
            <div className="font-heading italic text-[13.5px] text-g">full index — {projects.length} projects</div>
            <button type="button" onClick={() => dialogRef.current?.close()} className="font-heading italic text-xs text-ink/45 hover:text-g">
              close ×
            </button>
          </div>
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => { onSelect(p.id); dialogRef.current?.close(); }}
              className="block w-full text-left bg-transparent border-0 border-b border-g/16 py-2.5 px-1 cursor-pointer hover:bg-g/6"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="font-heading text-[17px]">{p.name}</span>
                <span className="font-heading italic text-[11px] text-ink/42 ml-auto">{p.year}</span>
              </div>
              <div className="text-[12.5px] leading-snug text-ink/65">{p.line}</div>
            </button>
          ))}
        </div>
      </dialog>
    );
  }
);
