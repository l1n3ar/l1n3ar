'use client';
import { useImperativeHandle, useState, type Ref } from 'react';

/** Shared open/close + imperative-handle wiring for dialogs triggered via a ref (e.g. `dialogRef.current?.open(...)`). */
export function useImperativeDialog<Args extends unknown[], T>(
  ref: Ref<{ open: (...args: Args) => void }>,
  toData: (...args: Args) => T,
) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  useImperativeHandle(ref, () => ({
    open: (...args: Args) => {
      setData(toData(...args));
      setOpen(true);
    },
  }));

  return { open, setOpen, data };
}
