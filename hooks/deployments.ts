'use client';
import { useQuery } from '@tanstack/react-query';
import { getDeployments, type Deployment } from '@/actions/deployments';
import { ONE_MINUTE_MS } from '@/lib/time';

export function useDeployments(limit = 5) {
  return useQuery<Deployment[], Error>({
    queryKey: ['deployments', limit],
    queryFn: async () => {
      const result = await getDeployments(limit);
      if (!result.ok) throw new Error(result.error);
      return result.deployments;
    },
    staleTime: ONE_MINUTE_MS,
    refetchInterval: ONE_MINUTE_MS,
  });
}
