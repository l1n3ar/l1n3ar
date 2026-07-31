'use client';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import {
  CaseHeader, CaseBody, CaseHighlights, CaseSection, CaseCode, CaseImage, CaseTable,
} from './primitives';
import { urlFor } from '@/sanity/lib/image';
import type { Highlight, CaseBodyBlock } from '@/lib/types';

const sectionProseComponents: PortableTextComponents = {
  marks: {
    code: ({ children }) => <code>{children}</code>,
  },
};

export function CaseStudy({
  title, highlights, body,
}: {
  title: string;
  highlights?: Highlight[];
  body?: CaseBodyBlock[];
}) {
  return (
    <div>
      <CaseHeader title={title} />
      <CaseBody>
        {highlights && highlights.length > 0 && <CaseHighlights items={highlights} />}
        {(body ?? []).map((block) => {
          switch (block._type) {
            case 'caseSection':
              return (
                <CaseSection key={block._key} heading={block.heading}>
                  <PortableText value={block.body ?? []} components={sectionProseComponents} />
                </CaseSection>
              );
            case 'codeBlock':
              return <CaseCode key={block._key}>{block.code}</CaseCode>;
            case 'caseImage':
              return (
                <CaseImage
                  key={block._key}
                  src={urlFor(block).width(1600).url()}
                  alt={block.alt}
                  border={block.border}
                />
              );
            case 'tableBlock':
              return <CaseTable key={block._key} rows={block.rows} />;
            case 'videoEmbed':
              return (
                <div
                  key={block._key}
                  className="relative w-full aspect-video mb-6 border-[0.375rem] border-cream outline outline-[0.06rem] outline-g/20"
                >
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
              console.warn(`CaseStudy: unrecognized block type "${(block as { _type: string })._type}"`);
              return null;
          }
        })}
      </CaseBody>
    </div>
  );
}
