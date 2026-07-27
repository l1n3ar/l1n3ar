'use client';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { caseStudies } from '@/components/case-study/registry';

export type CaseDialogHandle = { open: (id: string) => void };

export const CaseDialog = forwardRef<CaseDialogHandle>(function CaseDialog(_props, ref) {
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const CaseStudyComponent = projectId ? caseStudies[projectId] : undefined;

  useImperativeHandle(ref, () => ({
    open: (id: string) => { setProjectId(id); setOpen(true); },
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border border-g shadow-lg p-0 bg-cream rounded-none w-[94vw] h-[92vh] max-w-5xl overflow-y-auto overflow-x-hidden gz-scroll">
        {CaseStudyComponent && (
          <>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-4 p-0 h-auto font-heading italic text-0_8 text-cream/75 hover:text-cream z-10"
              >
                close ×
              </Button>
            </DialogClose>
            <CaseStudyComponent />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
});
