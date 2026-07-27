'use client';
import { useRef, useImperativeHandle, forwardRef, useState } from 'react';

export type RecDialogHandle = { open: (quote: string, who: string) => void };

export const RecDialog = forwardRef<RecDialogHandle>(function RecDialog(_props, ref) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [rec, setRec] = useState<{ quote: string; who: string } | null>(null);

  useImperativeHandle(ref, () => ({
    open: (quote: string, who: string) => {
      setRec({ quote, who });
      dialogRef.current?.showModal();
    },
  }));

  return (
    <dialog ref={dialogRef} className="border border-g shadow-lg p-0 bg-cream rounded-none w-[min(520px,92vw)]">
      <div className="p-8">
        <div className="flex justify-end mb-2">
          <button type="button" onClick={() => dialogRef.current?.close()} className="font-heading italic text-xs text-ink/45 hover:text-g">
            close ×
          </button>
        </div>
        <p className="font-heading italic text-[17px] leading-relaxed mb-3">&ldquo;{rec?.quote}&rdquo;</p>
        <div className="font-heading italic text-sm text-g">— {rec?.who}</div>
      </div>
    </dialog>
  );
});
