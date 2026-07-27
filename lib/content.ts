import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import {
  projectFrontmatterSchema, workHistoryEntrySchema, recommendationSchema, siteConfigSchema,
  type Project, type WorkHistoryEntry, type Recommendation, type SiteConfig,
} from './schema';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export function getSiteConfig(): SiteConfig {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'site.json'), 'utf8');
  return siteConfigSchema.parse(JSON.parse(raw));
}

export function getWorkHistory(): WorkHistoryEntry[] {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'work-history.json'), 'utf8');
  return (JSON.parse(raw) as unknown[])
    .map((e) => workHistoryEntrySchema.parse(e))
    .sort((a, b) => b.order - a.order);
}

export function getRecommendations(): Recommendation[] {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, 'recommendations.json'), 'utf8');
  return (JSON.parse(raw) as unknown[])
    .map((e) => recommendationSchema.parse(e))
    .sort((a, b) => a.order - b.order);
}

export async function getAllProjects(): Promise<Project[]> {
  const dir = path.join(CONTENT_DIR, 'projects');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const projects = await Promise.all(
    files.map(async (file) => {
      const id = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const { data, content } = matter(raw);
      const frontmatter = projectFrontmatterSchema.parse(data);
      const bodyHtml = (await remark().use(remarkHtml).process(content)).toString();
      return { id, ...frontmatter, bodyHtml };
    })
  );
  return projects.sort((a, b) => a.order - b.order);
}
