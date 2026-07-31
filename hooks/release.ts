'use client';
import { useQuery } from '@tanstack/react-query';
import { getLatestRelease, type Release } from '@/actions/release';

export function useRelease() {
  return useQuery<Release, Error>({
    queryKey: ['release'],
    queryFn: async () => {
      const result = await getLatestRelease();
      if (!result.ok) throw new Error(result.error);
      return result.release;
    },
  });
}
