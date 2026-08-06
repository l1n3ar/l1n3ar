'use client';
import { GitCommitHorizontal, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDeploymentsInfinite } from '@/hooks/deployments';
import { commitMessage, commitRef, commitSha, stateBadgeClass, timeAgo } from '@/lib/deployment-meta';

const ICON_STROKE = 1.75;

export function Deployments() {
  const {
    data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useDeploymentsInfinite();

  const deployments = data?.pages.flatMap((p) => p.deployments) ?? [];

  return (
    <div>
      <h1 className="text-0_9 font-semibold mb-3.5">Deployments</h1>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="size-icon-sm animate-spin text-muted-foreground" strokeWidth={ICON_STROKE} />
        </div>
      )}

      {isError && (
        <p className="text-0_8 text-destructive">{error?.message ?? 'something went wrong.'}</p>
      )}

      {!isLoading && !isError && deployments.length === 0 && (
        <p className="text-0_8 text-muted-foreground">No deployments found.</p>
      )}

      {deployments.length > 0 && (
        <div>
          <div className="border border-border rounded-lg overflow-hidden">
            {deployments.map((d) => {
              const message = commitMessage(d.meta);
              const ref = commitRef(d.meta);
              const sha = commitSha(d.meta);
              return (
                <div
                  key={d.uid}
                  className="flex items-center gap-3 px-3.5 py-2.5 border-b border-border last:border-b-0 text-0_7"
                >
                  <span className="flex-1 min-w-0 truncate">{message ?? 'deployment'}</span>
                  <span className={`shrink-0 text-0_6 font-medium px-2 py-0.5 rounded-full ${stateBadgeClass(d.state)}`}>
                    {d.state ?? 'unknown'}
                  </span>
                  {d.target && <Badge variant="outline" className="shrink-0 capitalize">{d.target}</Badge>}
                  <span className="text-0_6 text-muted-foreground shrink-0 font-mono flex items-center gap-1">
                    <GitCommitHorizontal className="size-icon-xs" strokeWidth={ICON_STROKE} />
                    {sha}
                    {ref && ` · ${ref}`}
                  </span>
                  <span className="text-0_6 text-muted-foreground shrink-0 w-16 text-right">{timeAgo(d.created)}</span>
                </div>
              );
            })}
          </div>

          {hasNextPage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
              className="mt-2.5"
            >
              {isFetchingNextPage ? (
                <Loader2 className="size-icon-xs animate-spin" strokeWidth={ICON_STROKE} />
              ) : (
                'Load more'
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
