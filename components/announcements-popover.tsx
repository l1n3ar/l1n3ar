'use client';
import { useState } from 'react';
import { Megaphone, Loader2, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { getDeployments, type Deployment } from '@/actions/deployments';
import { commitMessage, commitRef } from '@/lib/deployment-meta';

function timeAgo(input: string | number) {
  const then = typeof input === 'number' ? input : Number(input);
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

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
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'ready'>('idle');
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [error, setError] = useState('');

  const load = async () => {
    if (status === 'loading' || status === 'ready') return;
    setStatus('loading');
    const result = await getDeployments();
    if (result.ok) {
      setDeployments(result.deployments);
      setStatus('ready');
    } else {
      setError(result.error);
      setStatus('error');
    }
  };

  return (
    <Popover onOpenChange={(open) => open && load()}>
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

        {status === 'ready' && deployments.map((d) => {
          const message = commitMessage(d.meta);
          const ref = commitRef(d.meta);
          return (
            <div key={d.uid} className="px-1 py-2 border-b border-g/10 last:border-b-0">
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
                {ref && <span>·</span>}
                <span>{timeAgo(d.created)}</span>
              </div>
            </div>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
