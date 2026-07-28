import type { SiteConfig } from '@/lib/schema';
import { ThemeToggle } from '@/components/theme-toggle';

export function Masthead({ site }: { site: SiteConfig }) {
  return (
    <div className="relative px-12 md:px-6 py-4 text-center  border-g border-b-2">
      <ThemeToggle className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2" />
      <div className="font-heading text-xl md:text-3xl tracking-wide leading-tight break-words">{site.name}</div>
      <div className="font-heading italic text-0_7 md:text-0_8 text-ink/60 mt-1 break-words">
        {site.role} · {site.location}
      </div>
    </div>
  );
}
