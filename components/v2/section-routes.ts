import { type V2Section } from '@/lib/types';

export function sectionHref(section: V2Section): string {
  return section === 'home' ? '/' : `/${section}`;
}

export function topLevelPath(pathname: string): string {
  const first = pathname.split('/').filter(Boolean)[0];
  return first ? `/${first}` : '/';
}
