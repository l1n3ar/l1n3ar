import { V2_SECTIONS, type V2Section } from '@/lib/types';

export function sectionHref(section: V2Section): string {
  return section === 'home' ? '/' : `/${section}`;
}

/** First path segment decides the active section — `/projects/some-slug` still highlights "Projects". */
export function sectionFromPathname(pathname: string): V2Section {
  const first = pathname.split('/').filter(Boolean)[0];
  return (V2_SECTIONS as readonly string[]).includes(first) ? (first as V2Section) : 'home';
}
