'use client';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export type SiuTakeoverHandle = { open: () => void };

// public/siu.gif's own animation length (34 frames), measured directly from the file.
const GIF_DURATION_MS = 2400;

export const SiuTakeover = forwardRef<SiuTakeoverHandle>(function SiuTakeover(_props, ref) {
  const [open, setOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // .play() is called directly inside the trusted click/keydown handler (not in a
  // useEffect after the state update) so it stays inside the browser's autoplay gesture window.
  const trigger = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
    setOpen(true);
  };

  useImperativeHandle(ref, () => ({ open: trigger }));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '7' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        trigger();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const close = () => {
    setOpen(false);
    audioRef.current?.pause();
  };

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(close, GIF_DURATION_MS);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <>
      <audio ref={audioRef} src="/siu.mp3" />
      <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
        <DialogContent
          showCloseButton={false}
          className="p-0 border-0 ring-0 shadow-none bg-ink w-screen h-screen max-w-none rounded-none flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/siu.gif"
            alt=""
            onClick={close}
            className="max-w-full max-h-full object-contain cursor-pointer"
          />
        </DialogContent>
      </Dialog>
    </>
  );
});
