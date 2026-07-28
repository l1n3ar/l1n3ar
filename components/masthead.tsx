import type { SiteConfig } from '@/lib/schema';
import { ThemeToggle } from '@/components/theme-toggle';
import { AnnouncementsPopover } from '@/components/announcements-popover';

export function Masthead({ site }: { site: SiteConfig }) {
  return (
    <div className="flex items-center justify-between md:justify-normal gap-2 md:gap-4 px-3 md:px-6 py-4 border-g border-b-2">

      <div className="hidden md:block md:flex-1" />
 
      <div className="flex-1 min-w-0 text-left md:text-center">
        <div className="font-heading text-lg md:text-3xl tracking-wide leading-tight">{site.name}</div>
        <div className="font-heading italic text-0_6 md:text-0_8 text-ink/60 mt-1">
          {site.role} · {site.location}
        </div>
      </div>

      <div className="flex items-center md:flex-1 justify-end gap-2 md:gap-1.5 shrink-0">
     
        <AnnouncementsPopover />
        <ThemeToggle />
      </div>
    </div>
  );
}
