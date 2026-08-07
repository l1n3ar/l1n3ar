import type { ReactNode } from 'react';
import { LiveDot } from '@/components/v2/live-dot';

export function StatCard({ label, value, live }: { label: string; value: ReactNode; live?: boolean }) {
  return (
    <div className="border border-border rounded-lg p-3.5 bg-card">
      <div className="flex items-center text-0_6 text-muted-foreground mb-1.5">
        {live && <LiveDot className="mr-1.5" />}
        {label}
      </div>
      <div className="text-1_2 font-semibold">{value}</div>
    </div>
  );
}
