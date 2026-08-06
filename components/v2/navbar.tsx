'use client';
import { ChevronLeft, MessageCircle } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export function V2Navbar({
  title, onBack, feedbackEmail,
}: {
  title: string; onBack?: () => void; feedbackEmail?: string;
}) {
  return (
    <div className="h-11 shrink-0 border-b border-border grid grid-cols-[1fr_auto_1fr] items-center px-3">
      <div className="flex items-center gap-1">
        <SidebarTrigger className="md:hidden" />
        {onBack && (
          <Button variant="ghost" size="icon-sm" onClick={onBack} aria-label="back">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="text-sm font-medium truncate text-center">{title}</div>

      <div className="flex items-center justify-end">
        {feedbackEmail && (
          <Button variant="outline" size="sm" render={<a href={`mailto:${feedbackEmail}`} />}>
            <MessageCircle className="h-3.5 w-3.5" />
            Feedback
          </Button>
        )}
      </div>
    </div>
  );
}
