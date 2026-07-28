'use client';
import { useDeploymentsStore, useDeploymentsPolling } from '@/lib/deployments-store';
import { timeAgo, stateDotClass } from '@/lib/deployment-meta';
import { cn } from '@/lib/utils';

export function DeployStatus({ className }: { className?: string }) {
  useDeploymentsPolling();
  const { deployments, status } = useDeploymentsStore();
  const deployment = deployments[0];

  if (status !== 'ready' || !deployment) return null;

  return (
    <span className={cn('hidden md:inline-flex items-center gap-1.5 font-heading italic text-0_7 text-ink/45', className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', stateDotClass(deployment.state))} />
      deployed {timeAgo(deployment.created)}
    </span>
  );
}
