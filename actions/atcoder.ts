'use server';
import { z } from 'zod';
import { apiFetch } from '@/lib/api-client';

const historyEntrySchema = z.object({
  IsRated: z.boolean(),
  Place: z.number().optional(),
  OldRating: z.number().optional(),
  NewRating: z.number(),
  Performance: z.number().optional(),
  ContestName: z.string(),
  EndTime: z.string(),
});

export type AtcoderContest = {
  name: string;
  rating: number;
  performance?: number;
  when: number;
};

export type AtcoderProfile = {
  handle: string;
  rating?: number;
  maxRating?: number;
  colorTier: string;
  recentContests: AtcoderContest[];
};

export type GetAtcoderProfileResult =
  | { ok: true; profile: AtcoderProfile }
  | { ok: false; error: string };

/** AtCoder's public, well-known rating→color tiers (not exposed directly by the API). */
function colorTier(rating?: number): string {
  if (rating === undefined) return 'unrated';
  if (rating < 400) return 'gray';
  if (rating < 800) return 'brown';
  if (rating < 1200) return 'green';
  if (rating < 1600) return 'cyan';
  if (rating < 2000) return 'blue';
  if (rating < 2400) return 'yellow';
  if (rating < 2800) return 'orange';
  return 'red';
}

export async function getAtcoderProfile(handle: string): Promise<GetAtcoderProfileResult> {
  const result = await apiFetch({
    url: `https://atcoder.jp/users/${encodeURIComponent(handle)}/history/json`,
    schema: z.array(historyEntrySchema),
    errorMessage: (_body, status) =>
      status === 404 ? `handle "${handle}" not found on atcoder` : `atcoder returned ${status}`,
  });
  if (!result.ok) return result;

  const rated = result.data.filter((c) => c.IsRated);
  const rating = rated.at(-1)?.NewRating;
  const maxRating = rated.length ? Math.max(...rated.map((c) => c.NewRating)) : undefined;

  const recentContests = [...result.data]
    .reverse()
    .slice(0, 8)
    .map((c) => ({
      name: c.ContestName,
      rating: c.NewRating,
      performance: c.Performance,
      when: new Date(c.EndTime).getTime() / 1000,
    }));

  return {
    ok: true,
    profile: { handle, rating, maxRating, colorTier: colorTier(rating), recentContests },
  };
}
