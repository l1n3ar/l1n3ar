'use client';
import NextLink from 'next/link';
import { ArrowLeft, History } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/theme-toggle';
import { useSite } from '@/components/v2/site-context';

const ICON_STROKE = 1.75;

export function Navbar({
  title, onBack,
}: {
  title: string; onBack?: () => void;
}) {
  const { site } = useSite();
  return (
    <div className="h-11 shrink-0 border-b border-border grid grid-cols-[1fr_auto_1fr] items-center px-3">
      <div className="flex items-center gap-1">
        <SidebarTrigger aria-label="toggle sidebar" />
        {onBack && (
          <Button variant="ghost" size="icon-xs" onClick={onBack} className="gap-1 flex items-center">
            <ArrowLeft className="size-icon-xs" strokeWidth={ICON_STROKE} />
            {/* <div className="text-0_7">Back to projects</div> */}
          </Button>
        )}
      </div>

      <div className="text-0_8 font-medium truncate text-center">{title}</div>

      <div className="flex items-center justify-end gap-2">
        {/* <ThemeToggle
          iconClassName="size-icon-xs"
          strokeWidth={ICON_STROKE}
          tooltipClassName="text-0_6 font-sans not-italic"
        /> */}

        <Tooltip>
          <TooltipTrigger
            render={<Button variant="ghost" size='icon-xs' aria-label="switch to v1" render={<NextLink href="/v1" />} />}
          >
            <History className="size-icon-xs text-foreground" strokeWidth={ICON_STROKE} />
          </TooltipTrigger>
          <TooltipContent className="text-0_6 font-sans not-italic">Switch to v1</TooltipContent>
        </Tooltip>

        {site.email && (
          <>
            <Separator orientation="vertical" className="h-4 bg-muted-foreground/30 data-[orientation=vertical]:self-center" />
            <Button variant="outline" size="sm" render={<a href={`mailto:${site.email}`} />}>
              <span className="text-0_7 text-foreground">Feedback</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
