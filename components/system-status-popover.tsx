'use client';
import type { ReactNode } from 'react';
import { Activity, GitBranch, GitCommitHorizontal, Waypoints } from 'lucide-react';
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

function StatRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-1 text-0_7">
      <span className="text-ink/55">{label}</span>
      <span className="font-mono text-ink/80 text-right">{value}</span>
    </div>
  );
}

function StatGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className={`${kicker} mb-1`}>{title}</div>
      <div className="divide-y divide-g/10">{children}</div>
    </div>
  );
}

function MetricsTab() {
  const { data, isLoading, isError, error } = useSystemMetrics();

  if (isLoading) return <PanelLoading className="py-3" />;
  if (isError || !data) return <PanelError className="px-1 py-3" message={error?.message ?? 'something went wrong'} />;

  return (
    <div className="px-1">
      <StatGroup title="traffic">
        <StatRow label="live visitors" value={data.traffic.liveVisitors} />
        <StatRow label="questions today" value={data.traffic.questionsToday} />
      </StatGroup>

      <StatGroup title="rag performance">
        <StatRow
          label="retrieval p50 / p95"
          value={`${formatMs(data.ragPerformance.retrieval.p50)} / ${formatMs(data.ragPerformance.retrieval.p95)}`}
        />
        <StatRow
          label="end-to-end p50 / p95"
          value={`${formatMs(data.ragPerformance.endToEnd.p50)} / ${formatMs(data.ragPerformance.endToEnd.p95)}`}
        />
        <StatRow label="avg citation confidence" value={formatPct(data.ragPerformance.avgConfidence)} />
      </StatGroup>

      <StatGroup title="reliability">
        <StatRow label="errors today" value={data.reliability.errorsToday} />
        <StatRow label="rate-limited today" value={data.reliability.rateLimitedToday} />
      </StatGroup>

      <StatGroup title="data health">
        <StatRow
          label="db query p50 / p95"
          value={`${formatMs(data.dataHealth.dbQuery.p50)} / ${formatMs(data.dataHealth.dbQuery.p95)}`}
        />
        <StatRow
          label="embedding call p50 / p95"
          value={`${formatMs(data.dataHealth.embeddingCall.p50)} / ${formatMs(data.dataHealth.embeddingCall.p95)}`}
        />
        <StatRow label="corpus size" value={`${data.dataHealth.corpusSize} chunks`} />
        <StatRow label="last ingest" value={data.dataHealth.lastIngest ? timeAgo(data.dataHealth.lastIngest) : '—'} />
      </StatGroup>
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
            {/* the connecting rail: dot + line down to the next commit */}
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

      <PopoverContent className="w-96 max-h-[70vh] overflow-y-auto gz-scroll" align="end">
        <Tabs defaultValue="metrics">
          <TabsList variant="line" className="mb-2 px-1">
            <TabsTrigger value="metrics" className="font-heading italic text-0_8">metrics</TabsTrigger>
            <TabsTrigger value="deployments" className="font-heading italic text-0_8">deployments</TabsTrigger>
          </TabsList>
          <TabsContent value="metrics">
            <MetricsTab />
          </TabsContent>
          <TabsContent value="deployments">
            <DeploymentsTab />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
