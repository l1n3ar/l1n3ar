import type { SiteConfig } from '@/lib/schema';
import { Button } from '@/components/ui/button';

export function Masthead({ site }: { site: SiteConfig }) {
  return (
    <div className="relative px-10 py-4 text-center border border-g border-b-2">
      <Button variant="outline" asChild className="absolute right-10 top-1/2 -translate-y-1/2 text-sm">
        <a href={`mailto:${site.email}`}>email</a>
      </Button>
      <div className="font-heading text-3xl tracking-wide leading-none">{site.name}</div>
      <div className="font-heading italic text-0_8 text-ink/60 mt-1">
        {site.role} · {site.location} · {site.email}
      </div>
    </div>
  );
}
