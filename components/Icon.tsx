import { resolveIcon } from '@/lib/icons';
import type { TechIconMap } from '@/lib/schema';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export function Icon({ tech, iconMap }: { tech: string; iconMap: TechIconMap }) {
  const icon = resolveIcon(tech, iconMap);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar className="w-4 h-4 transition-transform hover:z-10 hover:scale-150">
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
