'use client';
import { useState } from 'react';
import NextLink from 'next/link';
import { ArrowLeft, History, MessageSquare } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/theme-toggle';
import { FeedbackDialog } from '@/components/v2/feedback-dialog';

const ICON_STROKE = 1.75;

export function Navbar({
  title, onBack,
}: {
  title: string; onBack?: () => void;
}) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  return (
    <div className="h-11 shrink-0 border-b border-border grid grid-cols-[1fr_auto_1fr] items-center px-3">
      <div className="flex items-center gap-1 min-w-0">
        <SidebarTrigger aria-label="toggle sidebar" />
        {onBack && (
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="ghost" size="icon-xs" onClick={onBack} aria-label="back to projects" className="gap-1 flex items-center" />}
            >
              <ArrowLeft className="size-icon-xs" strokeWidth={ICON_STROKE} />
            </TooltipTrigger>
            <TooltipContent className="text-0_6 font-sans not-italic">Back to projects</TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="text-0_8 font-medium truncate text-center">{title}</div>

      <div className="flex items-center justify-end gap-1.5 sm:gap-2 min-w-0">
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

        <Separator orientation="vertical" className="h-4 bg-muted-foreground/30 data-[orientation=vertical]:self-center" />
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="feedback"
          className="sm:w-auto sm:h-7 sm:px-2.5 sm:gap-1.5 sm:rounded-sm sm:border sm:border-border sm:bg-background sm:hover:bg-muted dark:sm:border-input dark:sm:bg-input/30 dark:sm:hover:bg-input/50"
          onClick={() => setFeedbackOpen(true)}
        >
          <MessageSquare className="size-icon-xs sm:hidden" strokeWidth={ICON_STROKE} />
          <span className="hidden sm:inline text-0_7 text-foreground">Feedback</span>
        </Button>
      </div>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
}
