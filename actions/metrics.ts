'use server';
import { neon } from '@neondatabase/serverless';
import { redis } from '@/lib/kv';
import { getPercentiles, getAverage, getCounter } from '@/lib/metrics';

const sql = neon(process.env.DATABASE_URL!);

export type SystemMetrics = {
  traffic: {
    liveVisitors: number;
    questionsToday: number;
  };
  ragPerformance: {
    retrieval: { p50: number | null; p95: number | null };
    endToEnd: { p50: number | null; p95: number | null };
    avgConfidence: number | null;
  };
  reliability: {
    errorsToday: number;
    rateLimitedToday: number;
  };
  dataHealth: {
    dbQuery: { p50: number | null; p95: number | null };
    embeddingCall: { p50: number | null; p95: number | null };
    corpusSize: number;
    lastIngest: string | null;
  };
};

export async function getSystemMetrics(): Promise<SystemMetrics> {
  const [
    presenceKeys,
    questionsToday,
    retrieval,
    endToEnd,
    avgConfidence,
    errorsToday,
    rateLimitedToday,
    dbQuery,
    embeddingCall,
    [corpus],
  ] = await Promise.all([
    redis.keys('presence:*'),
    getCounter('questions_answered'),
    getPercentiles('retrieval_total'),
    getPercentiles('end_to_end'),
    getAverage('citation_confidence'),
    getCounter('ask_error'),
    getCounter('rate_limited'),
    getPercentiles('db_query'),
    getPercentiles('embedding_call'),
    sql`SELECT COUNT(*)::int AS count, MAX(created_at) AS last_ingest FROM documents`,
  ]);

  return {
    traffic: {
      liveVisitors: presenceKeys.length,
      questionsToday,
    },
    ragPerformance: {
      retrieval: { p50: retrieval.p50, p95: retrieval.p95 },
      endToEnd: { p50: endToEnd.p50, p95: endToEnd.p95 },
      avgConfidence,
    },
    reliability: {
      errorsToday,
      rateLimitedToday,
    },
    dataHealth: {
      dbQuery: { p50: dbQuery.p50, p95: dbQuery.p95 },
      embeddingCall: { p50: embeddingCall.p50, p95: embeddingCall.p95 },
      corpusSize: corpus.count,
      lastIngest: corpus.last_ingest,
    },
  };
}
