'use client';
import { useDeployments } from '@/lib/queries/deployments';
import { timeAgo, stateDotClass } from '@/lib/deployment-meta';
import { cn } from '@/lib/utils';

export function DeployStatus({ className }: { className?: string }) {
  const { data: deployments } = useDeployments();
  const deployment = deployments?.[0];

  if (!deployment) return null;

  return (
    <span className={cn('hidden md:inline-flex items-center gap-1.5 font-heading italic text-0_7 text-ink/45', className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', stateDotClass(deployment.state))} />
      deployed {timeAgo(deployment.created)}
    </span>
  );
}
