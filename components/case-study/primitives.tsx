'use client';
import type { ReactNode } from 'react';
import { CopyButton } from '@/components/copy-button';
import { kicker } from '@/lib/typography';

export function CaseHeader({ title }: { title: string }) {
  return (
    <div className="sticky top-0 z-10 bg-cream/80 backdrop-blur-sm px-5 pt-7 pb-5 md:px-12 md:pt-9 md:pb-6 border-b-2 border-g">
      <h1 className="font-heading font-light text-2xl md:text-2_6 leading-none pr-10">{title}</h1>
    </div>
  );
}

export function CaseBody({ children }: { children: ReactNode }) {
  return <div className="max-w-3xl mx-auto px-5 md:px-12 py-6 md:py-10">{children}</div>;
}

export function CaseHighlights({ items }: { items: { label: string; body: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
      {items.map((h) => (
        <div key={h.label} className="border border-g/30 rounded-sm p-4 bg-g/5">
          <div className={`${kicker} mb-1.5`}>{h.label}</div>
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

export function CaseCode({ children }: { children: string }) {
  return (
    <div className="relative group mb-6">
      <pre className="font-mono bg-codeBg text-cream rounded-sm px-5 py-4 text-0_8 leading-relaxed overflow-x-auto gz-scroll">
        <code>{children}</code>
      </pre>
      <CopyButton
        text={children}
        label="copy code"
        className="absolute top-2 right-2 text-cream/40 hover:text-cream hover:bg-cream/10 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}

export function CaseImage({ src, alt, border = true }: { src: string; alt: string; border?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full border-[0.375rem] border-cream ${border ? 'outline-g/20 outline outline-[0.06rem]' : ''} mb-6`}
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
