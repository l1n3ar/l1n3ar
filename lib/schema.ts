import { z } from 'zod';

export const metricSchema = z.object({ key: z.string(), value: z.string() });

export const projectFrontmatterSchema = z.object({
  name: z.string(),
  org: z.string(),
  year: z.string(),
  role: z.string(),
  line: z.string(),
  description: z.string(),
  tech: z.array(z.string()).default([]),
  github: z.string().url().optional(),
  demo: z.string().url().optional(),
  metrics: z.array(metricSchema).default([]),
  order: z.number().default(0),
  asks: z.array(z.string()).default([]),
});
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export type Project = ProjectFrontmatter & {
  id: string;
};

export const workHistoryEntrySchema = z.object({
  org: z.string(),
  role: z.string(),
  range: z.string(),
  order: z.number().default(0),
});
export type WorkHistoryEntry = z.infer<typeof workHistoryEntrySchema>;

export const recommendationSchema = z.object({
  who: z.string(),
  quote: z.string(),
  order: z.number().default(0),
});
export type Recommendation = z.infer<typeof recommendationSchema>;

export const codingProfilesSchema = z.object({
  codeforces: z.string().optional(),
  leetcode: z.string().optional(),
  atcoder: z.string().optional(),
});
export type CodingProfiles = z.infer<typeof codingProfilesSchema>;

export const offTheClockLinkSchema = z.object({
  label: z.string(),
  href: z.string().url(),
  kind: z.enum(['youtube', 'spotify', 'instagram', 'link']).default('link'),
});
export type OffTheClockLink = z.infer<typeof offTheClockLinkSchema>;

export const musicEntrySchema = z.object({
  band: z.string(),
  tagline: z.string(),
  now: z.string().optional(),
  links: z.array(offTheClockLinkSchema).default([]),
});
export type MusicEntry = z.infer<typeof musicEntrySchema>;

export const offTheClockSchema = z.object({
  music: z.array(musicEntrySchema).default([]),
});
export type OffTheClock = z.infer<typeof offTheClockSchema>;

export const siteConfigSchema = z.object({
  name: z.string(),
  role: z.string(),
  location: z.string(),
  email: z.string().email(),
  about: z.string(),
  footerLinks: z.array(z.object({ label: z.string(), href: z.string() })),
  alterEgo : z.string(),
  codingProfiles: codingProfilesSchema.optional(),
});
export type SiteConfig = z.infer<typeof siteConfigSchema>;
