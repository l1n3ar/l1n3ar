'use server';
import { z } from 'zod';
import { apiFetch } from '@/lib/api-client';

const userInfoSchema = z.object({
  handle: z.string(),
  rating: z.number().optional(),
  maxRating: z.number().optional(),
  rank: z.string().optional(),
  maxRank: z.string().optional(),
});

const userInfoResponseSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('OK'), result: z.array(userInfoSchema) }),
  z.object({ status: z.literal('FAILED'), comment: z.string().optional() }),
]);

const submissionSchema = z.object({
  id: z.number(),
  creationTimeSeconds: z.number(),
  verdict: z.string().optional(),
  problem: z.object({
    contestId: z.number().optional(),
    index: z.string(),
    name: z.string(),
    rating: z.number().optional(),
  }),
});

const statusResponseSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('OK'), result: z.array(submissionSchema) }),
  z.object({ status: z.literal('FAILED'), comment: z.string().optional() }),
]);

export type CodeforcesSolve = {
  name: string;
  rating?: number;
  url: string;
  when: number;
};

export type CodeforcesProfile = {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  recentSolved: CodeforcesSolve[];
};

export type GetCodeforcesProfileResult =
  | { ok: true; profile: CodeforcesProfile }
  | { ok: false; error: string };

export async function getCodeforcesProfile(handle: string): Promise<GetCodeforcesProfileResult> {
  const infoResult = await apiFetch({
    url: `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`,
    schema: userInfoResponseSchema,
  });
  if (!infoResult.ok) return infoResult;
  if (infoResult.data.status === 'FAILED') {
    return { ok: false, error: infoResult.data.comment ?? 'codeforces lookup failed' };
  }
  const info = infoResult.data.result[0];
  if (!info) return { ok: false, error: `handle "${handle}" not found on codeforces` };

  const statusResult = await apiFetch({
    url: `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=50`,
    schema: statusResponseSchema,
  });

  const recentSolved: CodeforcesSolve[] = [];
  if (statusResult.ok && statusResult.data.status === 'OK') {
    const seen = new Set<string>();
    for (const sub of statusResult.data.result) {
      if (sub.verdict !== 'OK') continue;
      const key = `${sub.problem.contestId ?? ''}${sub.problem.index}`;
      if (seen.has(key)) continue;
      seen.add(key);
      recentSolved.push({
        name: sub.problem.name,
        rating: sub.problem.rating,
        url: sub.problem.contestId
          ? `https://codeforces.com/problemset/problem/${sub.problem.contestId}/${sub.problem.index}`
          : 'https://codeforces.com',
        when: sub.creationTimeSeconds,
      });
      if (recentSolved.length >= 10) break;
    }
  }

  return {
    ok: true,
    profile: {
      handle: info.handle,
      rating: info.rating,
      maxRating: info.maxRating,
      rank: info.rank,
      recentSolved,
    },
  };
}
