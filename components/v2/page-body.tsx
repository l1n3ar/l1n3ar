import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Title (and optional subheader, e.g. filter tabs) stay fixed; only `children` scrolls.
export function PageBody({
  title, actions, titleClassName, subheader, children,
}: {
  title: ReactNode; actions?: ReactNode; titleClassName?: string; subheader?: ReactNode; children: ReactNode;
}) {
  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="shrink-0 pb-3.5 flex items-center justify-between gap-4 flex-wrap">
        <h1 className={cn('text-0_9 font-semibold', titleClassName)}>{title}</h1>
        {actions}
      </div>

      {subheader && <div className="shrink-0 mb-4">{subheader}</div>}

      <div className="flex-1 min-h-0 overflow-y-auto gz-scroll pb-6">
        {children}
      </div>
    </div>
  );
}
