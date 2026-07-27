import Image from 'next/image';
import { resolveIcon } from '@/lib/icons';
import type { TechIconMap } from '@/lib/schema';

export function Icon({ tech, iconMap }: { tech: string; iconMap: TechIconMap }) {
  const icon = resolveIcon(tech, iconMap);
  if (icon.type === 'img') {
    return <Image title={icon.label} src={icon.src} width={22} height={22} alt={icon.label} className="opacity-85" unoptimized />;
  }
  return (
    <span
      title={icon.label}
      className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-g/40 font-heading italic text-[9.5px] text-g"
    >
      {icon.mark}
    </span>
  );
}
