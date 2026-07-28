'use client';
import { Megaphone, Loader2, GitBranch, GitCommitHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useDeploymentsStore, useDeploymentsPolling } from '@/lib/deployments-store';
import { commitMessage, commitRef, commitSha, timeAgo, stateDotClass } from '@/lib/deployment-meta';
import { cn } from '@/lib/utils';

function stateBadgeVariant(state?: string): 'default' | 'destructive' | 'secondary' {
  switch (state) {
    case 'READY':
      return 'default';
    case 'ERROR':
    case 'CANCELED':
      return 'destructive';
    default:
      return 'secondary';
  }
}

export function AnnouncementsPopover({ className }: { className?: string }) {
  useDeploymentsPolling();
  const { deployments, status, error, refresh } = useDeploymentsStore();

  return (
    <Popover onOpenChange={(open) => open && refresh()}>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="announcements" className={className} />
        }
      >
        <Megaphone className="h-4 w-4" />
      </PopoverTrigger>

      <PopoverContent className="w-80 max-h-[70vh] overflow-y-auto gz-scroll" align="end">
        <div className="font-heading italic text-0_9 text-g px-1 pb-1.5 border-b border-g/20">
          deployments
        </div>

        {status === 'loading' && (
          <div className="flex justify-center py-3">
            <Loader2 className="animate-spin h-4 w-4 text-g" />
          </div>
        )}

        {status === 'error' && (
          <div className="text-0_8 text-destructive px-1 py-3 break-words">{error}</div>
        )}

        {status === 'ready' && deployments.length === 0 && (
          <div className="text-0_8 text-ink/55 px-1 py-3">no deployments found.</div>
        )}

        {status === 'ready' && deployments.map((d, i) => {
          const message = commitMessage(d.meta);
          const ref = commitRef(d.meta);
          const sha = commitSha(d.meta);
          const isLast = i === deployments.length - 1;
          return (
            <div key={d.uid} className="flex gap-2.5 px-1">
              {/* the connecting rail: dot + line down to the next commit */}
              <div className="flex flex-col items-center w-2.5 shrink-0">
                <span className={cn('h-2 w-2 rounded-full ring-2 ring-cream mt-1.5 shrink-0', stateDotClass(d.state))} />
                {!isLast && <span className="w-px flex-1 bg-g/20 mt-0.5" />}
              </div>

              <div className={cn('min-w-0 flex-1', !isLast ? 'pb-3' : 'pb-1')}>
                <div className="flex items-start gap-1.5">
                  <span className="flex-1 min-w-0 font-heading italic text-0_8 break-words">
                    {message ?? 'deployment'}
                  </span>
                  <Badge
                    variant={stateBadgeVariant(d.state)}
                    className="shrink-0 h-4 px-1.5 text-[0.6rem] leading-none"
                  >
                    {d.state ?? 'unknown'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-0_7 text-ink/50 mt-0.5">
                  {ref && (
                    <span className="inline-flex items-center gap-0.5">
                      <GitBranch className="h-2.5 w-2.5" />
                      {ref}
                    </span>
                  )}
                  {ref && sha && <span>·</span>}
                  {sha && (
                    <span className="inline-flex items-center gap-0.5 font-mono">
                      <GitCommitHorizontal className="h-2.5 w-2.5" />
                      {sha}
                    </span>
                  )}
                  {(ref || sha) && <span>·</span>}
                  <span>{timeAgo(d.created)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
