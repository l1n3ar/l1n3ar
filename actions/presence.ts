'use server';

import { redis } from '@/lib/kv';

const PRESENCE_TTL_SECONDS = 30;

export async function pingPresence(sessionId: string) {
  await redis.set(`presence:${sessionId}`, 1, { ex: PRESENCE_TTL_SECONDS });
}
