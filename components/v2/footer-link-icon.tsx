import type { LucideIcon } from 'lucide-react';
import { ICON_STROKE } from '@/components/v2/constants';
import { BRAND_ICONS } from '@/components/v2/tech-icons';

export function isGithubLink(label: string) {
  return label.toLowerCase().includes('github');
}

export function isLinkedinLink(label: string) {
  return label.toLowerCase().includes('linkedin');
}

export function FooterLinkIcon({
  label, fallback: Fallback, className,
}: {
  label: string; fallback: LucideIcon; className?: string;
}) {
  if (isGithubLink(label)) {
    return <BRAND_ICONS.github className={className} color="currentColor" />;
  }
  if (isLinkedinLink(label)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/images/logos/linkedin.png" alt="" className={`${className} object-contain`} />
    );
  }
  return <Fallback className={className} strokeWidth={ICON_STROKE} />;
}
