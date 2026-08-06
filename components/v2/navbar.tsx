'use client';
import { ChevronLeft } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';

const ICON_STROKE = 1.75;

export function Navbar({
  title, onBack, feedbackEmail,
}: {
  title: string; onBack?: () => void; feedbackEmail?: string;
}) {
  return (
    <div className="h-11 shrink-0 border-b border-border grid grid-cols-[1fr_auto_1fr] items-center px-3">
      <div className="flex items-center gap-1">
        <SidebarTrigger aria-label="toggle sidebar" />
        {onBack && (
          <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="back">
            <ChevronLeft className="size-3" strokeWidth={ICON_STROKE} />
          </Button>
        )}
      </div>

      <div className="text-0_8 font-medium truncate text-center">{title}</div>

      <div className="flex items-center justify-end gap-2">
        <ThemeToggle size="icon-sm" iconClassName="size-3" strokeWidth={ICON_STROKE} />
        {feedbackEmail && (
          <>
            <Separator orientation="vertical" className="h-4 data-[orientation=vertical]:self-center" />
            <Button variant="outline" size="sm" render={<a href={`mailto:${feedbackEmail}`} />}>
              <span className="text-0_7">Feedback</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
