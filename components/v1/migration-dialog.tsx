'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { dialogClose } from '@/lib/typography';

export function V1MigrationDialog() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="w-[90vw] max-w-sm p-6 text-center">
        <DialogClose render={<Button variant="ghost" className={`absolute top-3 right-3 p-0 h-auto ${dialogClose}`} />}>
          close ×
        </DialogClose>

        <div className="text-1_4 mb-2">🚀</div>
        <div className="font-heading italic text-1 mb-2">we&apos;ve migrated to v2</div>
        <p className="text-0_8 text-ink/65 mb-5">
          this is the old site. everything's moved to v2.
        </p>
        <Button render={<a href="/" />} className="w-full">
          go to v2
        </Button>
      </DialogContent>
    </Dialog>
  );
}
