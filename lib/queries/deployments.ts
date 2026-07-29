'use client';
import { useQuery } from '@tanstack/react-query';
import { getDeployments, type Deployment } from '@/actions/deployments';

const STALE_TIME = 60 * 1000;

export function useDeployments(limit = 5) {
  return useQuery<Deployment[], Error>({
    queryKey: ['deployments', limit],
    queryFn: async () => {
      const result = await getDeployments(limit);
      if (!result.ok) throw new Error(result.error);
      return result.deployments;
    },
    staleTime: STALE_TIME,
    refetchInterval: STALE_TIME,
  });
}
