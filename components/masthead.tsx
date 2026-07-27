import type { SiteConfig } from '@/lib/schema';

export function Masthead({ site }: { site: SiteConfig }) {
  return (
    <div className="relative px-6 py-4 text-center border border-g border-b-2">
      <div className="font-heading text-3xl tracking-wide leading-none">{site.name}</div>
      <div className="font-heading italic text-0_8 text-ink/60 mt-1">
        {site.role} · {site.location}
      </div>
    </div>
  );
}
