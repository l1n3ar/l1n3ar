'use client';
import type { ReactNode } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { kicker } from '@/lib/typography';

/** Shared trigger + content shell for the sidebar's footer popovers (practice stats, off the clock). */
export function SidebarPopover({
  label, trailing, headerExtra, children,
}: {
  label: string;
  trailing?: ReactNode;
  headerExtra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="shrink-0 w-full flex items-center gap-2 px-6 py-2 border-t border-g hover:bg-g/5 transition-colors text-left"
          />
        }
      >
        <span className={kicker}>{label}</span>
        {trailing}
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="center"
        sideOffset={8}
        className="w-[22rem] max-h-[65vh] p-0 flex flex-col overflow-hidden"
      >
        <div className="px-4 pt-4 pb-2 shrink-0">
          <div className={kicker}>{label}</div>
          {headerExtra}
        </div>
        {children}
      </PopoverContent>
    </Popover>
  );
}
