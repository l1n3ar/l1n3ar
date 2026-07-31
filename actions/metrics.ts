'use server';
import { neon } from '@neondatabase/serverless';
import { redis } from '@/lib/kv';
import { getPercentiles, getAverage, getCounter } from '@/lib/metrics';
import { CLAUDE_HAIKU_INPUT_PRICE_PER_MILLION, CLAUDE_HAIKU_OUTPUT_PRICE_PER_MILLION } from '@/lib/ai-config';

const sql = neon(process.env.DATABASE_URL!);

type Percentiles = { p50: number | null; p95: number | null };

export type SystemMetrics = {
  traffic: {
    liveVisitors: number;
    questionsToday: number;
  };
  ragPerformance: {
    timeToFirstToken: Percentiles;
    endToEnd: Percentiles;
    retrieval: Percentiles;
    avgRelevance: number | null;
  };
  reliability: {
    errorsToday: number;
    rateLimitedToday: number;
  };
  dataHealth: {
    dbQuery: Percentiles;
    embeddingCall: Percentiles;
    siteConfigCall: Percentiles;
    corpusSize: number;
    lastIngest: string | null;
  };
  economics: {
    promptTokensToday: number;
    completionTokensToday: number;
    estimatedCostToday: number;
  };
};

export async function getSystemMetrics(): Promise<SystemMetrics> {
  const [
    presenceKeys,
    questionsToday,
    timeToFirstToken,
    endToEnd,
    retrieval,
    avgRelevance,
    errorsToday,
    rateLimitedToday,
    dbQuery,
    embeddingCall,
    siteConfigCall,
    [corpus],
    promptTokensToday,
    completionTokensToday,
  ] = await Promise.all([
    redis.keys('presence:*'),
    getCounter('questions_answered'),
    getPercentiles('time_to_first_token'),
    getPercentiles('end_to_end'),
    getPercentiles('retrieval_total'),
    getAverage('citation_relevance'),
    getCounter('ask_error'),
    getCounter('rate_limited'),
    getPercentiles('db_query'),
    getPercentiles('embedding_call'),
    getPercentiles('site_config_call'),
    sql`SELECT COUNT(*)::int AS count, MAX(created_at) AS last_ingest FROM documents`,
    getCounter('prompt_tokens'),
    getCounter('completion_tokens'),
  ]);

  const estimatedCostToday =
    (promptTokensToday / 1_000_000) * CLAUDE_HAIKU_INPUT_PRICE_PER_MILLION +
    (completionTokensToday / 1_000_000) * CLAUDE_HAIKU_OUTPUT_PRICE_PER_MILLION;

  return {
    traffic: {
      liveVisitors: presenceKeys.length,
      questionsToday,
    },
    ragPerformance: {
      timeToFirstToken,
      endToEnd,
      retrieval,
      avgRelevance,
    },
    reliability: {
      errorsToday,
      rateLimitedToday,
    },
    dataHealth: {
      dbQuery,
      embeddingCall,
      siteConfigCall,
      corpusSize: corpus.count,
      lastIngest: corpus.last_ingest,
    },
    economics: {
      promptTokensToday,
      completionTokensToday,
      estimatedCostToday,
    },
  };
}
