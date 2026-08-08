'use client';
import { useEffect, useRef, useState, type CSSProperties, type MouseEventHandler, type ReactNode } from 'react';
import NextLink from 'next/link';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const FRAME_COUNT = 8;
const FRAME_MS = 35;

export function ScrambleLink({
  href, text, icon, onClick, className, style,
}: {
  href: string; text: string; icon?: ReactNode; onClick?: MouseEventHandler; className?: string; style?: CSSProperties;
}) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const scramble = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    let frame = 0;
    intervalRef.current = setInterval(() => {
      frame += 1;
      const settled = Math.floor((frame / FRAME_COUNT) * text.length);
      setDisplay(text
        .split('')
        .map((char, i) => (i < settled ? char : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]))
        .join(''));

      if (frame >= FRAME_COUNT) {
        clearInterval(intervalRef.current!);
        setDisplay(text);
      }
    }, FRAME_MS);
  };

  return (
    <NextLink href={href} onClick={onClick} onMouseEnter={scramble} className={className} style={style}>
      {icon}
      {display}
    </NextLink>
  );
}
