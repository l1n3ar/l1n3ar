'use client';
import { useQuery } from '@tanstack/react-query';
import { getCodeforcesProfile, type CodeforcesProfile } from '@/actions/codeforces';
import { getLeetcodeProfile, type LeetcodeProfile } from '@/actions/leetcode';

const STALE_TIME = 60 * 60 * 1000;

export function totalSolved(solvedByDifficulty: LeetcodeProfile['solvedByDifficulty'] | undefined): number {
  return solvedByDifficulty?.reduce((sum, d) => sum + d.count, 0) ?? 0;
}

export function useCodeforcesProfile(handle: string) {
  return useQuery<CodeforcesProfile, Error>({
    queryKey: ['codeforces-profile', handle],
    queryFn: async () => {
      const result = await getCodeforcesProfile(handle);
      if (!result.ok) throw new Error(result.error);
      return result.profile;
    },
    staleTime: STALE_TIME,
    enabled: Boolean(handle),
  });
}

export function useLeetcodeProfile(handle: string) {
  return useQuery<LeetcodeProfile, Error>({
    queryKey: ['leetcode-profile', handle],
    queryFn: async () => {
      const result = await getLeetcodeProfile(handle);
      if (!result.ok) throw new Error(result.error);
      return result.profile;
    },
    staleTime: STALE_TIME,
    enabled: Boolean(handle),
  });
}
