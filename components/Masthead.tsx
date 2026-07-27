import type { SiteConfig } from '@/lib/schema';

export function Masthead({ site }: { site: SiteConfig }) {
  return (
    <div className="relative px-10 py-4 text-center border border-g border-b-2" >
      <a
        href={`mailto:${site.email}`}
        className="absolute right-10 top-1/2 -translate-y-1/2 font-heading italic text-sm border border-g text-g px-3.5 py-1.5 rounded-sm hover:bg-g/10"
      >
        email
      </a>
      <div className="font-heading text-[30px] tracking-wide leading-none">{site.name}</div>
      <div className="font-heading italic text-[13px] text-ink/60 mt-1">
        {site.role} · {site.location} · {site.email}
      </div>
    </div>
  );
}
