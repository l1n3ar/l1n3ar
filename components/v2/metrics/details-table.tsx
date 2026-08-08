import type { ReactNode } from 'react';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ICON_STROKE } from '@/components/v2/constants';

export function InfoTooltip({ children }: { children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<button type="button" className="inline-flex items-center ml-1 text-muted-foreground/50 hover:text-muted-foreground" />}
      >
        <HelpCircle className="size-icon-xs" strokeWidth={ICON_STROKE} />
      </TooltipTrigger>
      <TooltipContent className="text-0_6 font-sans not-italic max-w-56">{children}</TooltipContent>
    </Tooltip>
  );
}

export function DetailsTable({ rows }: { rows: { label: string; value: ReactNode; info?: ReactNode }[] }) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="text-0_6 font-semibold text-muted-foreground uppercase tracking-wide px-3 py-2 bg-muted">
        Details
      </div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between gap-2 px-3 py-2 text-0_7 border-t border-border">
          <span className="text-muted-foreground flex items-center">
            {r.label}
            {r.info && <InfoTooltip>{r.info}</InfoTooltip>}
          </span>
          <span className="text-foreground">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
