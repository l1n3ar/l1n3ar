export function Stat({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground/80">{children}</span>;
}

export function LiveStat({ children }: { children: React.ReactNode }) {
  return (
    <Stat>
      <span className="inline-flex items-center gap-1.5">
        <span className="relative inline-flex size-1.5 shrink-0">
          <span className="absolute inline-flex size-full rounded-full bg-green-600 dark:bg-green-500 opacity-60 animate-ping" />
          <span className="relative inline-flex size-1.5 rounded-full bg-green-600 dark:bg-green-500" />
        </span>
        {children}
      </span>
    </Stat>
  );
}
