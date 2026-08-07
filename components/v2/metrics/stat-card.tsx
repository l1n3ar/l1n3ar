import type { ReactNode } from 'react';

function LiveDot() {
  return (
    <span className="relative inline-flex size-1.5 mr-1.5">
      <span className="absolute inline-flex size-full rounded-full bg-green-600 dark:bg-green-500 opacity-60 animate-ping" />
      <span className="relative inline-flex size-1.5 rounded-full bg-green-600 dark:bg-green-500" />
    </span>
  );
}

export function StatCard({ label, value, live }: { label: string; value: ReactNode; live?: boolean }) {
  return (
    <div className="border border-border rounded-lg p-3.5 bg-card">
      <div className="flex items-center text-0_6 text-muted-foreground mb-1.5">
        {live && <LiveDot />}
        {label}
      </div>
      <div className="text-1_2 font-semibold">{value}</div>
    </div>
  );
}
