'use client';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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

const PAGE_SIZE = 10;

/** Paginated variant for the v2 Deployments page — loads 10 at a time via "load more". */
export function useDeploymentsInfinite() {
  return useInfiniteQuery({
    queryKey: ['deployments-infinite'],
    queryFn: async ({ pageParam }: { pageParam: number | undefined }) => {
      const result = await getDeployments(PAGE_SIZE, pageParam);
      if (!result.ok) throw new Error(result.error);
      return result;
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: REFETCH_INTERVAL,
  });
}
