'use client';
import { useEffect, useState } from 'react';
import { getDeployments, type Deployment } from '@/actions/deployments';
import { timeAgo, stateDotClass } from '@/lib/deployment-meta';
import { cn } from '@/lib/utils';

const REFRESH_MS = 60_000;

export function DeployStatus({ className }: { className?: string }) {
  const [deployment, setDeployment] = useState<Deployment | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const result = await getDeployments(1);
      if (!cancelled && result.ok && result.deployments[0]) {
        setDeployment(result.deployments[0]);
      }
    };

    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (!deployment) return null;

  return (
    <span className={cn('hidden md:inline-flex items-center gap-1.5 font-heading italic text-0_7 text-ink/45', className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', stateDotClass(deployment.state))} />
      deployed {timeAgo(deployment.created)}
    </span>
  );
}
