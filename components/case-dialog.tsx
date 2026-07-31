'use client';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CaseStudy } from '@/components/case-study';
import type { Project } from '@/lib/schema';

export type CaseDialogHandle = { open: (id: string) => void };

export const CaseDialog = forwardRef<CaseDialogHandle, { projects: Project[] }>(
  function CaseDialog({ projects }, ref) {
    const [open, setOpen] = useState(false);
    const [projectId, setProjectId] = useState<string | null>(null);
    const project = projectId ? projects.find((p) => p.id === projectId) : undefined;
    const hasCaseStudy = project?.body && project.body.length > 0;

    useImperativeHandle(ref, () => ({
      open: (id: string) => { setProjectId(id); setOpen(true); },
    }));

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="shadow-lg p-0 bg-cream rounded-none w-[90vw] h-dialog-safe max-w-5xl overflow-hidden"
        >
          {hasCaseStudy && project && (
            <>
              <DialogClose
                render={
                  <Button
                    variant="ghost"
                    className="absolute top-4 right-4 p-0 h-auto font-heading italic text-0_8 text-ink/45 hover:text-g z-20"
                  />
                }
              >
                close ×
              </DialogClose>
              <div className="h-full w-full overflow-y-auto overflow-x-hidden gz-scroll">
                <div className="min-w-0 w-full">
                  <CaseStudy title={project.name} highlights={project.highlights} body={project.body} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  },
);
