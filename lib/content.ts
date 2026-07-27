import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
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

export function getAllProjects(): Project[] {
  const dir = path.join(CONTENT_DIR, 'projects');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const projects = files.map((file) => {
    const id = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data } = matter(raw);
    const frontmatter = projectFrontmatterSchema.parse(data);
    return { id, ...frontmatter };
  });
  return projects.sort((a, b) => a.order - b.order);
}
