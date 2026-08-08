'use client';
import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Download, History, MessageSquare, MoreHorizontal, TriangleDashed,
} from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ThemeToggle } from '@/components/theme-toggle';
import { ICON_STROKE } from '@/components/v2/constants';
import { FeedbackDialog } from '@/components/v2/feedback-dialog';
import { Separator } from '../ui/separator';

export function Navbar({
  title, onBack, resumeHref,
}: {
  title: string; onBack?: () => void; resumeHref?: string;
}) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="h-11 shrink-0 border-b border-border grid grid-cols-[1fr_auto_1fr] items-center px-3 ">
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

      <div className="text-0_8 font-medium truncate text-center hover:cursor-pointer hover:underline" onClick={()=>router.push('/')}>l1n3ar</div>

      <div className="flex items-center justify-end gap-1.5 sm:gap-2 min-w-0">
                <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                aria-label="ask"
                className="sm:w-auto sm:h-7 sm:px-2.5 sm:gap-1.5 sm:rounded-sm sm:border sm:border-border sm:bg-background sm:hover:bg-muted dark:sm:border-input dark:sm:bg-input/30 dark:sm:hover:bg-input/50"
                onClick={() => router.push('/ask')}
              />
            }
          >
            <TriangleDashed className="size-icon-xs" strokeWidth={ICON_STROKE} />
            <span className="hidden sm:inline text-0_7 text-foreground">Ask</span>
          </TooltipTrigger>
          <TooltipContent className="text-0_6 font-sans not-italic">Retrieval-grounded chat over my work</TooltipContent>
        </Tooltip>

         <Separator orientation="vertical" className="h-4 bg-muted-foreground/30 data-[orientation=vertical]:self-center" /> 

        <ThemeToggle
          iconClassName="size-icon-xs"
          strokeWidth={ICON_STROKE}
          tooltipClassName="text-0_6 font-sans not-italic"
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon-xs" aria-label="more options" />}
            className='mr-2'
          >
            <MoreHorizontal className="size-icon-xs" strokeWidth={ICON_STROKE} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-sans not-italic text-0_7">
            {resumeHref && (
              <DropdownMenuItem render={<a href={resumeHref} target="_blank" rel="noopener noreferrer" className='text-foreground' />}>
                <Download strokeWidth={ICON_STROKE} />
                Download resume
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => setFeedbackOpen(true)}>
              <MessageSquare strokeWidth={ICON_STROKE} />
              Provide feedback
            </DropdownMenuItem>
            <DropdownMenuItem render={<NextLink href="/v1" className='text-foreground' />}>
              <History strokeWidth={ICON_STROKE} />
              Switch to v1
            </DropdownMenuItem>


          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
}
