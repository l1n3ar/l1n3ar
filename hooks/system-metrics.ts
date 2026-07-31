'use client';
import { useQuery } from '@tanstack/react-query';
import { getSystemMetrics } from '@/actions/metrics';

const REFETCH_INTERVAL = 15 * 1000;

export function useSystemMetrics() {
  return useQuery({
    queryKey: ['system-metrics'],
    queryFn: () => getSystemMetrics(),
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
  });
}
