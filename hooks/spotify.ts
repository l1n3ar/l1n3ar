'use client';
import { useQuery } from '@tanstack/react-query';
import { getNowPlaying, type NowPlaying } from '@/actions/spotify';
import { THIRTY_SECONDS_MS } from '@/lib/time';

export function useNowPlaying() {
  return useQuery<NowPlaying | null, Error>({
    queryKey: ['spotify-now-playing'],
    queryFn: async () => {
      const result = await getNowPlaying();
      if (!result.ok) throw new Error(result.error);
      return result.data;
    },
    staleTime: THIRTY_SECONDS_MS,
    refetchInterval: THIRTY_SECONDS_MS,
  });
}
