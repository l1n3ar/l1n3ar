'use client';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { Project } from '@/lib/schema';

export type CaseDialogHandle = { open: (id: string) => void };

export const CaseDialog = forwardRef<CaseDialogHandle, { projects: Project[] }>(function CaseDialog({ projects }, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const project = projects.find((p) => p.id === projectId);

  useImperativeHandle(ref, () => ({
    open: (id: string) => { setProjectId(id); dialogRef.current?.showModal(); },
  }));

  return (
    <dialog ref={dialogRef} className="border border-g shadow-lg p-0 bg-cream rounded-none w-[min(760px,92vw)] max-h-[88vh]">
      {project && (
        <div className="overflow-auto max-h-[88vh] px-11 py-9">
          <div className="flex items-baseline justify-between mb-4 pb-3" style={{ borderBottom: '3px double #0b3d2e' }}>
            <div className="font-heading italic text-[13px] text-g">{project.org} · {project.year}</div>
            <button type="button" onClick={() => dialogRef.current?.close()} className="font-heading italic text-[13px] text-ink/45 hover:text-g">
              close ×
            </button>
          </div>
          <h2 className="font-heading font-light text-[42px] leading-none mb-4">{project.name}</h2>
          {/* Markdown body, rendered server-side by remark — real HTML, not escaped text. */}
          <div className="case-markdown text-[15px] leading-loose" dangerouslySetInnerHTML={{ __html: project.bodyHtml }} />
        </div>
      )}
    </dialog>
  );
});
