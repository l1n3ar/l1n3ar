import {
  Home, FolderKanban, MessageSquare, Quote, Code2, Activity, GitBranch, Lock, Briefcase, Circle,
  type LucideIcon,
} from 'lucide-react';

const ROUTE_ICONS: Record<string, LucideIcon> = {
  '/': Home,
  '/projects': FolderKanban,
  '/ask': MessageSquare,
  '/recommendations': Quote,
  '/l1n3ar': Code2,
  '/metrics': Activity,
  '/deployments': GitBranch,
  '/qalog': Lock,
  '/work': Briefcase,
};

const DEFAULT_NAV_ICON: LucideIcon = Circle;

export function iconForRoute(href: string): LucideIcon {
  return ROUTE_ICONS[href] ?? DEFAULT_NAV_ICON;
}
