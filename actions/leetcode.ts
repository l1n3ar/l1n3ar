'use server';
import { z } from 'zod';
import { apiFetch } from '@/lib/api-client';

const QUERY = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum { difficulty count }
      }
    }
    recentAcSubmissionList(username: $username, limit: 10) {
      title
      titleSlug
      timestamp
    }
  }
`;

const responseSchema = z.object({
  data: z.object({
    matchedUser: z
      .object({
        username: z.string(),
        submitStats: z.object({
          acSubmissionNum: z.array(z.object({ difficulty: z.string(), count: z.number() })),
        }),
      })
      .nullable(),
    recentAcSubmissionList: z
      .array(z.object({ title: z.string(), titleSlug: z.string(), timestamp: z.string() }))
      .nullable(),
  }),
});

export type LeetcodeSolve = { title: string; url: string; when: number };
export type LeetcodeProfile = {
  handle: string;
  solvedByDifficulty: { difficulty: string; count: number }[];
  recentSolved: LeetcodeSolve[];
};

export type GetLeetcodeProfileResult =
  | { ok: true; profile: LeetcodeProfile }
  | { ok: false; error: string };

export async function getLeetcodeProfile(handle: string): Promise<GetLeetcodeProfileResult> {
  const result = await apiFetch({
    url: 'https://leetcode.com/graphql',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { query: QUERY, variables: { username: handle } },
    schema: responseSchema,
    errorMessage: () => 'leetcode is unreachable right now',
  });
  if (!result.ok) return result;

  const { matchedUser, recentAcSubmissionList } = result.data.data;
  if (!matchedUser) return { ok: false, error: `handle "${handle}" not found on leetcode` };

  return {
    ok: true,
    profile: {
      handle: matchedUser.username,
      solvedByDifficulty: matchedUser.submitStats.acSubmissionNum.filter((d) => d.difficulty !== 'All'),
      recentSolved: (recentAcSubmissionList ?? []).map((s) => ({
        title: s.title,
        url: `https://leetcode.com/problems/${s.titleSlug}/`,
        when: Number(s.timestamp),
      })),
    },
  };
}
