import type { ReactNode } from 'react';

export function CaseHeader({
  org, year, title, role,
}: { org: string; year: string; title: string; role: string }) {
  return (
    <div className="relative bg-g text-cream px-8 py-10 md:px-12 md:py-12">
      <div className="font-heading italic text-0_8 text-cream/75 mb-2">{org} · {year}</div>
      <h1 className="font-heading font-light text-2_6 leading-none mb-3 break-words">{title}</h1>
      <div className="font-heading italic text-0_9 text-cream/85">{role}</div>
    </div>
  );
}

export function CaseBody({ children }: { children: ReactNode }) {
  return <div className="max-w-3xl mx-auto px-8 md:px-12 py-10">{children}</div>;
}

export function CaseHighlights({ items }: { items: { label: string; body: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
      {items.map((h) => (
        <div key={h.label} className="border border-g/30 rounded-sm p-4 bg-g/5">
          <div className="font-heading italic text-0_9 text-g mb-1.5">{h.label}</div>
          <div className="text-0_8 leading-snug text-ink/75">{h.body}</div>
        </div>
      ))}
    </div>
  );
}

export function CaseSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-heading italic text-1_4 text-g mb-3 pb-2 border-b border-g/20">{heading}</h2>
      <div className="text-0_9 leading-loose [&_p]:mb-4 [&_p:last-child]:mb-0 text-justify [&_p]:[hyphens:auto]">
        {children}
      </div>
    </section>
  );
}

export function CaseCode({ children }: { children: ReactNode }) {
  return (
    <pre className="font-mono bg-codeBg text-codeInk rounded-sm px-5 py-4 text-0_8 leading-relaxed overflow-x-auto gz-scroll mb-6">
      <code>{children}</code>
    </pre>
  );
}

export function CaseImage({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full border-[0.375rem] border-cream outline outline-[0.06rem] outline-g/20 mb-6"
    />
  );
}

export function CaseTable({ rows }: { rows: { label: string; description: string; count: number }[] }) {
  return (
    <div className="mt-2 mb-10 overflow-x-auto">
      <table className="w-full border-collapse text-0_8">
        <thead>
          <tr className="border-b-2 border-g text-left">
            <th className="font-heading italic text-g font-normal py-2 pr-4">data source</th>
            <th className="font-heading italic text-g font-normal py-2 pr-4">what it&rsquo;s for</th>
            <th className="font-heading italic text-g font-normal py-2 text-right">tools</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-g/16">
              <td className="py-2 pr-4 font-heading whitespace-nowrap">{row.label}</td>
              <td className="py-2 pr-4 text-ink/70">{row.description}</td>
              <td className="py-2 text-right font-mono text-0_7">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CaseScreenshots({ items }: { items: { caption: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map((s) => (
        <div
          key={s.caption}
          className="border border-dashed border-g/40 rounded-sm p-5 text-center text-0_7 text-ink/55 leading-snug"
        >
          📸 {s.caption}
        </div>
      ))}
    </div>
  );
}
