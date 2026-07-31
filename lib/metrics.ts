import { redis } from './kv';

const MAX_SAMPLES = 200;
const COUNTER_TTL_SECONDS = 60 * 60 * 24 * 2;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/** Records a numeric sample (e.g. a latency in ms, or a confidence score) into a capped rolling list. */
export async function recordValue(kind: string, value: number) {
  const key = `metrics:values:${kind}`;
  await redis.lpush(key, value);
  await redis.ltrim(key, 0, MAX_SAMPLES - 1);
}

/** Increments a day-scoped counter (e.g. errors, rate-limit hits, tokens used). Expires after 2 days. */
export async function incrementCounter(kind: string, by = 1) {
  const key = `metrics:count:${kind}:${todayKey()}`;
  await redis.incrby(key, by);
  await redis.expire(key, COUNTER_TTL_SECONDS);
}

export async function getCounter(kind: string): Promise<number> {
  const key = `metrics:count:${kind}:${todayKey()}`;
  return (await redis.get<number>(key)) ?? 0;
}

export async function getPercentiles(kind: string): Promise<{ p50: number | null; p95: number | null; count: number }> {
  const key = `metrics:values:${kind}`;
  const raw = await redis.lrange<number>(key, 0, -1);
  const values = raw.map(Number).sort((a, b) => a - b);
  if (values.length === 0) return { p50: null, p95: null, count: 0 };
  return {
    p50: values[Math.floor(0.5 * (values.length - 1))],
    p95: values[Math.floor(0.95 * (values.length - 1))],
    count: values.length,
  };
}

export async function getAverage(kind: string): Promise<number | null> {
  const key = `metrics:values:${kind}`;
  const raw = await redis.lrange<number>(key, 0, -1);
  const values = raw.map(Number);
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
