'use client';
import { useQuery } from '@tanstack/react-query';
import { getDeployments, type Deployment } from '@/actions/deployments';

const REFETCH_INTERVAL = 60 * 1000;

export function useDeployments(limit = 5) {
  return useQuery<Deployment[], Error>({
    queryKey: ['deployments', limit],
    queryFn: async () => {
      const result = await getDeployments(limit);
      if (!result.ok) throw new Error(result.error);
      return result.deployments;
    },
    staleTime: REFETCH_INTERVAL,
    refetchInterval: REFETCH_INTERVAL,
  });
}
