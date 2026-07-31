'use client';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import {
  CaseHeader, CaseBody, CaseHighlights, CaseSection, CaseCode, CaseImage, CaseTable,
} from './case-study/base';
import { urlFor } from '@/sanity/lib/image';

type Highlight = { label: string; body: string };

type CaseSectionBlock = {
  _type: 'caseSection';
  _key: string;
  heading: string;
  body?: unknown[];
};
type CodeBlockBlock = { _type: 'codeBlock'; _key: string; code: string; language?: string };
type CaseImageBlock = {
  _type: 'caseImage';
  _key: string;
  alt: string;
  border?: boolean;
  [key: string]: unknown;
};
type TableBlockBlock = {
  _type: 'tableBlock';
  _key: string;
  rows: { label: string; description: string; count: number }[];
};
type VideoEmbedBlock = { _type: 'videoEmbed'; _key: string; url: string; title: string };

type CaseBodyBlock = CaseSectionBlock | CodeBlockBlock | CaseImageBlock | TableBlockBlock | VideoEmbedBlock;

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
              return null;
          }
        })}
      </CaseBody>
    </div>
  );
}
