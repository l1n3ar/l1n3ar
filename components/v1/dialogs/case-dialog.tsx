'use client';
import { forwardRef } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CaseStudy } from '@/components/v1/case-study/renderer';
import { hasCaseStudy, type Project } from '@/lib/types';
import { useImperativeDialog } from '@/hooks/use-imperative-dialog';
import { dialogClose } from '@/lib/typography';

export type CaseDialogHandle = { open: (id: string) => void };

export const CaseDialog = forwardRef<CaseDialogHandle, { projects: Project[] }>(
  function CaseDialog({ projects }, ref) {
    const { open, setOpen, data: projectId } = useImperativeDialog<[string], string>(ref, (id) => id);
    const project = projectId ? projects.find((p) => p.id === projectId) : undefined;

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="shadow-lg p-0 bg-cream rounded-none w-[90vw] h-dialog-safe max-w-5xl overflow-hidden"
        >
          {project && hasCaseStudy(project) && (
            <>
              <DialogClose
                render={
                  <Button
                    variant="ghost"
                    className={`absolute top-4 right-4 p-0 h-auto z-20 ${dialogClose}`}
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
