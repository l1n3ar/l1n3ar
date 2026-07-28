import type { SiteConfig } from '@/lib/schema';
import { ThemeToggle } from '@/components/theme-toggle';
import { AnnouncementsPopover } from '@/components/announcements-popover';

export function Masthead({ site }: { site: SiteConfig }) {
  return (
    <div className="flex items-center gap-4 px-4 md:px-6 py-4 border-g border-b-2">
      <div className="flex-1" />

      <div className="flex-1 min-w-0 text-center">
        <div className="font-heading text-xl md:text-3xl tracking-wide leading-tight break-words">{site.name}</div>
        <div className="font-heading italic text-0_7 md:text-0_8 text-ink/60 mt-1 break-words">
          {site.role} · {site.location}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end gap-1.5">
        <AnnouncementsPopover />
        <ThemeToggle />
      </div>
    </div>
  );
}
