import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/sanity/lib/image';
import { slugify } from '@/lib/utils';
import type { CaseBodyBlock, TableBlockBlock } from '@/lib/types';

const proseComponents: PortableTextComponents = {
  marks: {
    code: ({ children }) => <code className="font-mono text-0_7 bg-muted rounded px-1 py-0.5">{children}</code>,
  },
  block: {
    normal: ({ children }) => <p className="text-0_8 leading-relaxed mb-3 last:mb-0">{children}</p>,
  },
};

function CaseTable({ rows }: { rows: TableBlockBlock['rows'] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-0_75">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border">
              <td className="py-2 pr-4 font-medium whitespace-nowrap">{row.label}</td>
              <td className="py-2 pr-4 text-muted-foreground">{row.description}</td>
              <td className="py-2 text-right font-mono text-0_7 text-muted-foreground">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CaseStudyBody({ body }: { body?: CaseBodyBlock[] }) {
  return (
    <div className="flex flex-col gap-6">
      {(body ?? []).map((block) => {
        switch (block._type) {
          case 'caseSection':
            return (
              <section key={block._key} id={slugify(block.heading)} className="scroll-mt-14">
                <h3 className="text-0_9 font-semibold mb-2 capitalize">{block.heading}</h3>
                <PortableText value={block.body ?? []} components={proseComponents} />
              </section>
            );
          case 'codeBlock':
            return (
              <pre
                key={block._key}
                className="font-mono text-0_75 leading-relaxed bg-codeBlock text-codeBlock-foreground rounded-lg p-4 overflow-x-auto thin-scroll"
              >
                <code>{block.code}</code>
              </pre>
            );
          case 'caseImage':
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={block._key}
                src={urlFor(block).width(1600).url()}
                alt={block.alt}
                className="w-full rounded-lg border border-border"
              />
            );
          case 'tableBlock':
            return <CaseTable key={block._key} rows={block.rows} />;
          case 'videoEmbed':
            return (
              <div key={block._key} className="relative w-full aspect-video rounded-lg border border-border overflow-hidden">
                <iframe
                  src={block.url}
                  title={block.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
