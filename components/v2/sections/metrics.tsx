'use client';
import type { ReactNode } from 'react';
import { HelpCircle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useSystemMetrics } from '@/hooks/system-metrics';
import { timeAgo } from '@/lib/deployment-meta';

const ICON_STROKE = 1.75;

function formatMs(ms: number | null): string {
  return ms === null ? '—' : `${Math.round(ms)}ms`;
}

function formatPct(value: number | null): string {
  return value === null ? '—' : `${Math.round(value * 100)}%`;
}

function formatTokens(n: number): string {
  return n.toLocaleString();
}

function formatCost(usd: number): string {
  if (usd === 0) return '$0.00';
  return usd < 0.01 ? `$${usd.toFixed(4)}` : `$${usd.toFixed(2)}`;
}

function InfoTooltip({ children }: { children: ReactNode }) {
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

function LiveDot() {
  return (
    <span className="relative inline-flex size-1.5 mr-1.5">
      <span className="absolute inline-flex size-full rounded-full bg-green-600 dark:bg-green-500 opacity-60 animate-ping" />
      <span className="relative inline-flex size-1.5 rounded-full bg-green-600 dark:bg-green-500" />
    </span>
  );
}

function StatCard({ label, value, live }: { label: string; value: ReactNode; live?: boolean }) {
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

function LatencyTable({ rows }: { rows: { label: string; p50: string; p95: string; info?: ReactNode }[] }) {
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

function DetailsTable({ rows }: { rows: { label: string; value: ReactNode; info?: ReactNode }[] }) {
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

export function Metrics() {
  const { data, isLoading, isError, error } = useSystemMetrics();

  return (
    <div>
      <h1 className="text-0_9 font-semibold mb-3.5">Metrics</h1>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="size-icon-sm animate-spin text-muted-foreground" strokeWidth={ICON_STROKE} />
        </div>
      )}

      {isError && <p className="text-0_8 text-destructive">{error?.message ?? 'something went wrong.'}</p>}

      {data && (
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-4 gap-2.5">
            <StatCard label="live visitors" value={data.traffic.liveVisitors} live />
            <StatCard label="questions today" value={data.traffic.questionsToday} />
            <StatCard label="errors today" value={data.reliability.errorsToday} />
            <StatCard label="est. cost today" value={formatCost(data.economics.estimatedCostToday)} />
          </div>

          <LatencyTable
            rows={[
              {
                label: 'embedding call',
                p50: formatMs(data.dataHealth.embeddingCall.p50),
                p95: formatMs(data.dataHealth.embeddingCall.p95),
              },
              {
                label: 'retrieval',
                p50: formatMs(data.ragPerformance.retrieval.p50),
                p95: formatMs(data.ragPerformance.retrieval.p95),
              },
              {
                label: 'first token',
                p50: formatMs(data.ragPerformance.timeToFirstToken.p50),
                p95: formatMs(data.ragPerformance.timeToFirstToken.p95),
                info: 'what a visitor actually waits through — "full answer" below includes the rest of the generation streaming in after that.',
              },
              {
                label: 'full answer',
                p50: formatMs(data.ragPerformance.endToEnd.p50),
                p95: formatMs(data.ragPerformance.endToEnd.p95),
              },
              {
                label: 'db query',
                p50: formatMs(data.dataHealth.dbQuery.p50),
                p95: formatMs(data.dataHealth.dbQuery.p95),
              },
            ]}
          />

          <DetailsTable
            rows={[
              { label: 'rate-limited today', value: data.reliability.rateLimitedToday },
              {
                label: 'avg relevance score',
                value: formatPct(data.ragPerformance.avgRelevance),
                info: 'raw embedding cosine similarity — this model runs low even for strong matches, so 25–40% is normal, not a bad match.',
              },
              { label: 'corpus size', value: `${data.dataHealth.corpusSize} chunks` },
              { label: 'last ingest', value: data.dataHealth.lastIngest ? timeAgo(data.dataHealth.lastIngest) : '—' },
              { label: 'prompt tokens today', value: formatTokens(data.economics.promptTokensToday) },
              { label: 'completion tokens today', value: formatTokens(data.economics.completionTokensToday) },
            ]}
          />
        </div>
      )}
    </div>
  );
}
