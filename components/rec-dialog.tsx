'use client';
import { useImperativeHandle, forwardRef, useState } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { dialogClose } from '@/lib/typography';

export type RecDialogHandle = { open: (quote: string, who: string) => void };

export const RecDialog = forwardRef<RecDialogHandle>(function RecDialog(_props, ref) {
  const [open, setOpen] = useState(false);
  const [rec, setRec] = useState<{ quote: string; who: string } | null>(null);

  useImperativeHandle(ref, () => ({
    open: (quote: string, who: string) => {
      setRec({ quote, who });
      setOpen(true);
    },
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border border-g shadow-lg p-0 bg-cream rounded-none w-full max-w-dialog-sm max-h-[88vh] overflow-y-auto overflow-x-hidden gz-scroll">
        <div className="p-8">
          <div className="flex justify-end mb-2">
            <DialogClose asChild>
              <Button variant="ghost" className={`p-0 h-auto ${dialogClose}`}>close ×</Button>
            </DialogClose>
          </div>
          <p className="font-heading italic text-1_1 leading-relaxed mb-3 break-words">&ldquo;{rec?.quote}&rdquo;</p>
          <div className="font-heading italic text-sm text-g break-words">· {rec?.who}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
