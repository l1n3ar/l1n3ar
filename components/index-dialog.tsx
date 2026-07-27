'use client';
import { forwardRef, useImperativeHandle, useState } from 'react';
import type { Project } from '@/lib/schema';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { kicker, metaItalic, dialogClose } from '@/lib/typography';

export type IndexDialogHandle = { open: () => void };

export const IndexDialog = forwardRef<IndexDialogHandle, { projects: Project[]; onSelect: (id: string) => void }>(
  function IndexDialog({ projects, onSelect }, ref) {
    const [open, setOpen] = useState(false);
    useImperativeHandle(ref, () => ({ open: () => setOpen(true) }));

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border border-g shadow-lg p-0 bg-cream rounded-none w-full max-w-dialog-md max-h-[88vh] overflow-auto">
          <div className="p-8">
            <div className="flex items-baseline justify-between mb-3.5 pb-2.5 border-b border-g">
              <div className={kicker}>full index — {projects.length} projects</div>
              <DialogClose asChild>
                <Button variant="ghost" className={`p-0 h-auto ${dialogClose}`}>close ×</Button>
              </DialogClose>
            </div>
            {projects.map((p) => (
              <Button
                key={p.id}
                variant="ghost"
                onClick={() => { onSelect(p.id); setOpen(false); }}
                className="block w-full text-ink text-left h-auto rounded-none border-0 border-b border-g/16 py-2.5 px-1 hover:bg-g/6"
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="font-heading text-1_1">{p.name}</span>
                  <span className={`${metaItalic} text-ink/42 ml-auto`}>{p.year}</span>
                </div>
                <div className="text-0_8 leading-snug text-ink/65">{p.line}</div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);
