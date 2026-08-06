import { Box } from 'lucide-react';
import {
  SiGithub, SiNextdotjs, SiTypescript, SiTailwindcss, SiSanity, SiPostgresql, SiRedis, SiUpstash,
  SiFastapi, SiModelcontextprotocol, SiSwift, SiGo, SiDocker, SiNodedotjs, SiExpress, SiSequelize,
  SiMariadb, SiMysql, SiWeb3dotjs, SiPolygon, SiGnubash, SiMarkdown, type IconType,
} from '@icons-pack/react-simple-icons';

// Keyed by the exact `tech.name` values stored in Sanity. Anything not listed here has
// no real brand mark available in Simple Icons (LinkedIn and AWS/Azure were both pulled
// from the set after trademark takedown requests; pgvector/SwiftUI/WebSockets/MCP-adjacent
// concepts/smart contracts never had one) — those fall back to a generic Lucide icon instead.
export const TECH_ICONS: Record<string, IconType> = {
  'Next.js': SiNextdotjs,
  TypeScript: SiTypescript,
  'Tailwind CSS': SiTailwindcss,
  Sanity: SiSanity,
  PostgreSQL: SiPostgresql,
  Redis: SiRedis,
  Upstash: SiUpstash,
  FastAPI: SiFastapi,
  MCP: SiModelcontextprotocol,
  Swift: SiSwift,
  SwiftUI: SiSwift,
  Go: SiGo,
  Docker: SiDocker,
  'Node.js': SiNodedotjs,
  Express: SiExpress,
  Sequelize: SiSequelize,
  MariaDB: SiMariadb,
  MySQL: SiMysql,
  'Web3.js': SiWeb3dotjs,
  Polygon: SiPolygon,
  Shell: SiGnubash,
  'React Markdown': SiMarkdown,
};

export const BRAND_ICONS = { github: SiGithub };

/** Real brand icon when Simple Icons has one for this tech name, otherwise a generic fallback. */
export function TechIcon({ name, className }: { name: string; className?: string }) {
  const Icon = TECH_ICONS[name];
  if (Icon) return <Icon className={className} color="currentColor" title={name} />;
  return <Box className={className} strokeWidth={1.75} />;
}
