import { LiveDot } from '@/components/v2/live-dot';

export function Stat({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground/80">{children}</span>;
}

export function LiveStat({ children }: { children: React.ReactNode }) {
  return (
    <Stat>
      <span className="inline-flex items-center gap-1.5">
        <LiveDot />
        {children}
      </span>
    </Stat>
  );
}
