'use client';
import { forwardRef, useImperativeHandle, useState } from 'react';
import type { Project } from '@/lib/schema';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ProjectRow } from './project-row';
import { kicker, dialogClose } from '@/lib/typography';

export type IndexDialogHandle = { open: () => void };

export const IndexDialog = forwardRef<IndexDialogHandle, { projects: Project[]; onSelect: (id: string) => void }>(
  function IndexDialog({ projects, onSelect }, ref) {
    const [open, setOpen] = useState(false);
    useImperativeHandle(ref, () => ({ open: () => setOpen(true) }));

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border border-g shadow-lg p-0 bg-cream rounded-none w-full max-w-dialog-md max-h-[88vh] overflow-y-auto overflow-x-hidden gz-scroll">
          <div className="p-8">
            <div className="flex items-baseline justify-between mb-3.5 pb-2.5 border-b border-g">
              <div className={kicker}>full index — {projects.length} projects</div>
              <DialogClose asChild>
                <Button variant="ghost" className={`p-0 h-auto ${dialogClose}`}>close ×</Button>
              </DialogClose>
            </div>
            {projects.map((p) => (
              <ProjectRow
                key={p.id}
                project={p}
                onSelect={(id) => { onSelect(id); setOpen(false); }}
                variant="compact"
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);
