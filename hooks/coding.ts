'use client';
import { useQuery } from '@tanstack/react-query';
import { getCodeforcesProfile, type CodeforcesProfile } from '@/actions/codeforces';
import { getLeetcodeProfile, type LeetcodeProfile } from '@/actions/leetcode';
import { ONE_HOUR_MS } from '@/lib/time';

export function useCodeforcesProfile(handle: string) {
  return useQuery<CodeforcesProfile, Error>({
    queryKey: ['codeforces-profile', handle],
    queryFn: async () => {
      const result = await getCodeforcesProfile(handle);
      if (!result.ok) throw new Error(result.error);
      return result.profile;
    },
    staleTime: ONE_HOUR_MS,
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
    staleTime: ONE_HOUR_MS,
  });
}
