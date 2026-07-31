'use client';
import type { ReactNode } from 'react';
import { Waypoints, GitBranch, GitCommitHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PanelLoading, PanelError } from '@/components/ui/query-state';
import { useSystemMetrics } from '@/hooks/system-metrics';
import { useDeployments } from '@/hooks/deployments';
import { commitMessage, commitRef, commitSha, timeAgo, stateDotClass, stateBadgeVariant } from '@/lib/deployment-meta';
import { cn } from '@/lib/utils';
import { kicker } from '@/lib/typography';

function formatMs(ms: number | null): string {
  return ms === null ? '—' : `${Math.round(ms)}ms`;
}

function formatPct(value: number | null): string {
  return value === null ? '—' : `${Math.round(value * 100)}%`;
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className={`${kicker} mb-1.5 pb-1 border-b border-g/20`}>{children}</div>;
}

function LiveDot() {
  return (
    <span className="relative inline-flex h-1.5 w-1.5 mr-1.5">
      <span className="absolute inline-flex h-full w-full rounded-full bg-g opacity-60 animate-ping" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-g" />
    </span>
  );
}

function Hero({ label, value, live }: { label: string; value: ReactNode; live?: boolean }) {
  return (
    <div>
      <div className="font-mono text-1_4 text-g leading-none text-center">{value}</div>
      <div className="flex items-center text-0_6 text-ink/45 uppercase tracking-wide mb-0.5">
        {live && <LiveDot />}
        {label}
      </div>
      
    </div>
  );
}

function LatencyTable({ rows }: { rows: { label: string; p50: string; p95: string }[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-0_6 text-ink/35 uppercase tracking-wide pb-1">
        <span className="flex-1">metric</span>
        <span className="w-14 text-right">p50</span>
        <span className="w-14 text-right">p95</span>
      </div>
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-2 py-1 text-0_7 border-t border-g/10">
          <span className="flex-1 text-ink/65">{r.label}</span>
          <span className="font-mono text-ink/85 w-14 text-right">{r.p50}</span>
          <span className="font-mono text-ink/40 w-14 text-right">{r.p95}</span>
        </div>
      ))}
    </div>
  );
}

function StatusLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-0_7 text-ink/65">
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', ok ? 'bg-primary' : 'bg-destructive')} />
      {label}
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between text-0_7 text-ink/55">
      <span>{label}</span>
      <span className="font-mono text-ink/80">{value}</span>
    </div>
  );
}

function MetricsTab() {
  const { data, isLoading, isError, error } = useSystemMetrics();

  if (isLoading) return <PanelLoading className="py-3" />;
  if (isError || !data) return <PanelError className="px-1 py-3" message={error?.message ?? 'something went wrong'} />;

  return (
    <div className="px-1 flex flex-col gap-4">
      <div className="flex justify-between">
        <Hero label="live visitors" value={data.traffic.liveVisitors} live />
        <Hero label="questions today" value={data.traffic.questionsToday} />
      </div>

      <div>
        <SectionLabel>latency</SectionLabel>
        <LatencyTable
          rows={[
            {
              label: 'retrieval',
              p50: formatMs(data.ragPerformance.retrieval.p50),
              p95: formatMs(data.ragPerformance.retrieval.p95),
            },
            {
              label: 'end-to-end',
              p50: formatMs(data.ragPerformance.endToEnd.p50),
              p95: formatMs(data.ragPerformance.endToEnd.p95),
            },
            {
              label: 'db query',
              p50: formatMs(data.dataHealth.dbQuery.p50),
              p95: formatMs(data.dataHealth.dbQuery.p95),
            },
            {
              label: 'embedding call',
              p50: formatMs(data.dataHealth.embeddingCall.p50),
              p95: formatMs(data.dataHealth.embeddingCall.p95),
            },
          ]}
        />
      </div>

      <div>
        <SectionLabel>reliability</SectionLabel>
        <div className="flex flex-col gap-1.5">
          <StatusLine ok={data.reliability.errorsToday === 0} label={`${data.reliability.errorsToday} errors today`} />
          <StatusLine
            ok={data.reliability.rateLimitedToday === 0}
            label={`${data.reliability.rateLimitedToday} rate-limited today`}
          />
        </div>
      </div>

      <div>
        <SectionLabel>data</SectionLabel>
        <div className="flex flex-col gap-1">
          <DataRow label="avg citation confidence" value={formatPct(data.ragPerformance.avgConfidence)} />
          <DataRow label="corpus size" value={`${data.dataHealth.corpusSize} chunks`} />
          <DataRow label="last ingest" value={data.dataHealth.lastIngest ? timeAgo(data.dataHealth.lastIngest) : '—'} />
        </div>
      </div>
    </div>
  );
}

function DeploymentsTab() {
  const { data: deployments, isLoading, isError, error } = useDeployments();

  if (isLoading) return <PanelLoading className="py-3" />;
  if (isError) return <PanelError className="px-1 py-3" message={error.message} />;
  if (deployments?.length === 0) {
    return <div className="text-0_8 text-ink/55 px-1 py-3">no deployments found.</div>;
  }

  return (
    <div className="px-1">
      {deployments?.map((d, i, arr) => {
        const message = commitMessage(d.meta);
        const ref = commitRef(d.meta);
        const sha = commitSha(d.meta);
        const isLast = i === arr.length - 1;
        return (
          <div key={d.uid} className="flex gap-2.5">
            <div className="flex flex-col items-center w-2.5 shrink-0">
              <span className={cn('h-2 w-2 rounded-full ring-2 ring-cream mt-1.5 shrink-0', stateDotClass(d.state))} />
              {!isLast && <span className="w-px flex-1 bg-g/20 mt-0.5" />}
            </div>

            <div className={cn('min-w-0 flex-1', !isLast ? 'pb-3' : 'pb-1')}>
              <div className="flex items-start gap-1.5">
                <span className="flex-1 min-w-0 font-heading italic text-0_8 break-words">
                  {message ?? 'deployment'}
                </span>
                <Badge
                  variant={stateBadgeVariant(d.state)}
                  className="shrink-0 h-4 px-1.5 text-[0.6rem] leading-none"
                >
                  {d.state ?? 'unknown'}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-0_7 text-ink/50 mt-0.5">
                {ref && (
                  <span className="inline-flex items-center gap-0.5">
                    <GitBranch className="h-2.5 w-2.5" />
                    {ref}
                  </span>
                )}
                {ref && sha && <span>·</span>}
                {sha && (
                  <span className="inline-flex items-center gap-0.5 font-mono">
                    <GitCommitHorizontal className="h-2.5 w-2.5" />
                    {sha}
                  </span>
                )}
                {(ref || sha) && <span>·</span>}
                <span>{timeAgo(d.created)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SystemStatusPopover({ className }: { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant="ghost" size="icon" aria-label="system status" className={className} />}
      >
        <Waypoints className="h-4 w-4" />
      </PopoverTrigger>

      <PopoverContent className="w-96 max-h-[70vh] gz-scroll" align="end">
        <Tabs defaultValue="deployments">
          <TabsList variant="line" className="mb-2 px-1">
            <TabsTrigger value="deployments" className="font-heading italic text-0_8">deployments</TabsTrigger>
            <TabsTrigger value="metrics" className="font-heading italic text-0_8">metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="deployments" className="overflow-y-auto pt-4">
            <DeploymentsTab />
          </TabsContent>
          <TabsContent value="metrics" className='overflow-y-auto pt-4'>
            <MetricsTab />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
