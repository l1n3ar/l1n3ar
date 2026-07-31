'use client';
import { useQuery } from '@tanstack/react-query';
import { getNowPlaying, type NowPlaying } from '@/actions/spotify';

const REFETCH_INTERVAL = 30 * 1000;

export function useNowPlaying() {
  return useQuery<NowPlaying | null, Error>({
    queryKey: ['spotify-now-playing'],
    queryFn: async () => {
      const result = await getNowPlaying();
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
  });
}
