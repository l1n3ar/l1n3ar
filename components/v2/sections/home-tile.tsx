import type { ReactNode } from 'react';
import { tilePastel } from '@/lib/pastel';
import { cn } from '@/lib/utils';

// One gradient for every tile: solid page-bg at the top (so the icon/title sit on a
// clean surface), fading out to reveal the watercolor image lower down. The transparent
// stop sits deep (88%) so text/timeline content anywhere in the card stays on a legible
// backdrop — only a thin band near the very bottom shows the image at full strength.
const GRADIENT_CSS = 'linear-gradient(to bottom, rgb(var(--background)) 0%, transparent 97%)';

type HomeCardSize = 'lg' | 'md' | 'sm';

const SIZE: Record<HomeCardSize, {
  icon: string; title: string; description: string; radius: string;
}> = {
  lg: { icon: 'size-icon-xl', title: 'text-[1.375rem]', description: 'text-0_8', radius: 'rounded-2xl' },
  md: { icon: 'size-icon-lg', title: 'text-0_9', description: 'text-0_7', radius: 'rounded-[0.875rem]' },
  sm: { icon: 'size-icon-md', title: 'text-0_7', description: 'text-0_6', radius: 'rounded-xl' },
};

// One card, one layout: icon, then title below it, then either a bespoke `component`
// (e.g. the work-history timeline) or the standard description + button. Size controls
// every text size; title/description/buttonLabel are Sanity content, everything else is layout.
export function HomeCard({
  size = 'md', hue, image, icon, title, description, extra, className,
  component, buttonLabel, onClick,
}: {
  size?: HomeCardSize; hue: number; image?: string; icon: ReactNode; title: string; description?: string;
  extra?: ReactNode;
  className?: string; component?: ReactNode; buttonLabel?: string; onClick?: () => void;
}) {
  const s = SIZE[size];
  const pastel = tilePastel(hue);

  return (
    <div
      className={cn('tile-pastel relative overflow-hidden border border-border flex flex-col p-4 shadow-sm hover:cursor-pointer', s.radius, className)}
      style={pastel}
      onClick={onClick}
    >
      {image && (
        <div
          className="absolute inset-0 opacity-55 dark:hidden"
          style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
      )}
      <div className="absolute inset-0" style={{ background: GRADIENT_CSS }} />

      <div className="relative z-10 flex flex-col h-full min-h-0">
        <div className="shrink-0" >{icon}</div>
        <div className={cn(s.title, 'font-semibold mt-2 mb-0.5')}>{title}</div>

        {component ? (
          <div className="flex-1 min-h-0 overflow-y-auto gz-scroll">{component}</div>
        ) : (
          <>
            {description && (
              <p className={cn(s.description, 'text-muted-foreground leading-snug mb-2.5')}>{description}</p>
            )}
            {extra && (
              <div className={cn(s.description, 'flex flex-col gap-1 mt-2.5 mb-2.5')}>{extra}</div>
            )}
          </>
        )}
        {buttonLabel && onClick && (
          <button
            type="button"
            onClick={onClick}
            className={cn(
              s.description,
              'mt-auto self-start shrink-0 pt-2.5 font-semibold text-foreground underline decoration-transparent hover:decoration-current transition-colors',
            )}
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export const HOME_CARD_ICON_SIZE: Record<HomeCardSize, string> = {
  lg: SIZE.lg.icon, md: SIZE.md.icon, sm: SIZE.sm.icon,
};
