'use client';
import { forwardRef } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { dialogClose } from '@/lib/typography';
import { useImperativeDialog } from '@/hooks/use-imperative-dialog';

export type RecDialogHandle = { open: (quote: string, who: string) => void };

type Rec = { quote: string; who: string };

export const RecDialog = forwardRef<RecDialogHandle>(function RecDialog(_props, ref) {
  const { open, setOpen, data: rec } = useImperativeDialog<[string, string], Rec>(
    ref,
    (quote, who) => ({ quote, who }),
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className="border border-g shadow-lg p-0 bg-cream rounded-none w-full max-w-dialog-sm max-h-rec-dialog-safe overflow-y-auto overflow-x-hidden gz-scroll"
      >
        <div className="p-8">
          <div className="flex justify-end mb-2">
            <DialogClose render={<Button variant="ghost" className={`p-0 h-auto ${dialogClose}`} />}>
              close ×
            </DialogClose>
          </div>
          <p className="font-heading italic text-1_1 leading-relaxed mb-3 break-words">&ldquo;{rec?.quote}&rdquo;</p>
          <div className="font-heading italic text-sm text-g break-words">· {rec?.who}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
