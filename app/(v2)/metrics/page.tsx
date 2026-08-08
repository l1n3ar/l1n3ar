'use client';
import { LoadingSpinner, ErrorMessage } from '@/components/v2/async-state';
import { PageBody } from '@/components/v2/page-body';
import { StatCard } from '@/components/v2/metrics/stat-card';
import { LatencyTable } from '@/components/v2/metrics/latency-table';
import { DetailsTable } from '@/components/v2/metrics/details-table';
import { useSystemMetrics } from '@/hooks/system-metrics';
import { timeAgo } from '@/lib/deployment-meta';

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

export default function MetricsPage() {
  const { data, isLoading, isError, error } = useSystemMetrics();

  return (
    <PageBody title="Metrics">
      {isLoading && <LoadingSpinner />}

      {isError && <ErrorMessage error={error} />}

      {data && (
        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
    </PageBody>
  );
}
