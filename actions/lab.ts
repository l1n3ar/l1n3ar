'use server';
import { redis } from '@/lib/kv';

export type LabPosition = { x: number; y: number };

const POSITIONS_KEY = 'lab:positions';

export async function getLabPositions(): Promise<Record<string, LabPosition>> {
  const positions = await redis.get<Record<string, LabPosition>>(POSITIONS_KEY);
  return positions ?? {};
}

export type SaveLabPositionResult = { ok: true } | { ok: false; error: string };

export async function saveLabPosition(password: string, id: string, position: LabPosition): Promise<SaveLabPositionResult> {
  if (password !== process.env.QA_LOG_PASSWORD) return { ok: false, error: 'Incorrect password.' };

  const positions = await getLabPositions();
  positions[id] = position;
  await redis.set(POSITIONS_KEY, positions);
  return { ok: true };
}
