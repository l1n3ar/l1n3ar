export type Metric = { key: string; value: string };

export type CaseImageBlock = {
  _type: 'caseImage';
  _key: string;
  alt: string;
  border?: boolean;
  [key: string]: unknown;
};
export type CodeBlockBlock = { _type: 'codeBlock'; _key: string; code: string; language?: string };
export type CaseSectionBlock = { _type: 'caseSection'; _key: string; heading: string; body?: unknown[] };
export type TableBlockBlock = {
  _type: 'tableBlock';
  _key: string;
  rows: { label: string; description: string; count: number }[];
};
export type VideoEmbedBlock = { _type: 'videoEmbed'; _key: string; url: string; title: string };
export type CaseBodyBlock = CaseSectionBlock | CodeBlockBlock | CaseImageBlock | TableBlockBlock | VideoEmbedBlock;

export type Highlight = { label: string; body: string };

export type ProjectFrontmatter = {
  name: string;
  org: string;
  year: string;
  role: string;
  line: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  metrics: Metric[];
  order: number;
  asks: string[];
};

export type Project = ProjectFrontmatter & {
  id: string;
  highlights?: Highlight[];
  body?: CaseBodyBlock[];
};

export type WorkHistoryEntry = { org: string; role: string; range: string; order: number };

export type Recommendation = { who: string; quote: string; order: number };

export type CodingProfiles = { codeforces?: string; leetcode?: string; atcoder?: string };

export type OffTheClockLink = { label: string; href: string; kind: 'youtube' | 'spotify' | 'instagram' | 'link' };

export type MusicEntry = { band: string; tagline: string; now?: string; links: OffTheClockLink[] };

export type OffTheClock = { music: MusicEntry[] };

export type SiteConfig = {
  name: string;
  role: string;
  location: string;
  email: string;
  about: string;
  footerLinks: { label: string; href: string }[];
  alterEgo: string;
  codingProfiles?: CodingProfiles;
};
