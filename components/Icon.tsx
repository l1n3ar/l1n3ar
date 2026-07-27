import { resolveIcon } from '@/lib/icons';
import type { TechIconMap } from '@/lib/schema';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export function Icon({ tech, iconMap }: { tech: string; iconMap: TechIconMap }) {
  const icon = resolveIcon(tech, iconMap);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar className="w-5 h-5 ring-2 ring-cream -ml-2 first:ml-0 transition-transform hover:z-10 hover:scale-125 hover:-translate-y-0.5">
          {icon.type === 'img' ? (
            <AvatarImage src={icon.src} alt={icon.label} />
          ) : (
            <AvatarFallback className="font-heading italic text-0_6 text-g bg-cream border border-g/40">
              {icon.mark}
            </AvatarFallback>
          )}
        </Avatar>
      </TooltipTrigger>
      <TooltipContent className="font-heading italic text-0_7 bg-g text-cream border-0">{icon.label}</TooltipContent>
    </Tooltip>
  );
}
