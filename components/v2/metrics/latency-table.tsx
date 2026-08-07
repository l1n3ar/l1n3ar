import type { ReactNode } from 'react';
import { InfoTooltip } from '@/components/v2/metrics/details-table';

export function LatencyTable({ rows }: { rows: { label: string; p50: string; p95: string; info?: ReactNode }[] }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 text-0_6 text-muted-foreground uppercase tracking-wide px-3 py-2 bg-muted">
        <span className="flex-1">metric</span>
        <span className="w-16 text-right">p50</span>
        <span className="w-16 text-right">p95</span>
      </div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-2 px-3 py-2 text-0_7 border-t border-border">
          <span className="flex-1 text-foreground flex items-center">
            {r.label}
            {r.info && <InfoTooltip>{r.info}</InfoTooltip>}
          </span>
          <span className="text-foreground w-16 text-right">{r.p50}</span>
          <span className="text-muted-foreground w-16 text-right">{r.p95}</span>
        </div>
      ))}
    </div>
  );
}
