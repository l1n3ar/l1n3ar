'use client';
import { forwardRef, useImperativeHandle, useState } from 'react';
import type { Project } from '@/lib/schema';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { kicker } from '@/lib/typography';

export type CaseDialogHandle = { open: (id: string) => void };

export const CaseDialog = forwardRef<CaseDialogHandle, { projects: Project[] }>(function CaseDialog({ projects }, ref) {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const project = projects.find((p) => p.id === projectId);

  useImperativeHandle(ref, () => ({
    open: (id: string) => { setProjectId(id); setOpen(true); },
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border border-g shadow-lg p-0 bg-cream rounded-none w-full max-w-dialog max-h-[88vh] overflow-auto">
        {project && (
          <div className="px-11 py-9">
            <div className="flex items-baseline justify-between mb-4 pb-3 rule-double-b">
              <div className={kicker}>{project.org} · {project.year}</div>
              <DialogClose asChild>
                <Button variant="ghost" className="p-0 h-auto font-heading italic text-0_8 text-ink/45 hover:text-g">
                  close ×
                </Button>
              </DialogClose>
            </div>
            <h2 className="font-heading font-light text-2_6 leading-none mb-4">{project.name}</h2>
            {/* Real HTML from remark, not escaped text. */}
            <div className="case-markdown text-0_9 leading-loose" dangerouslySetInnerHTML={{ __html: project.bodyHtml }} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});
