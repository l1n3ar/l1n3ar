'use client';
import { useRouter } from 'next/navigation';
import { HomeCard, HOME_CARD_ICON_SIZE } from '@/components/v2/sections/home-tile';
import { NAV_ICONS } from '@/components/v2/nav-icons';
import { sectionHref } from '@/components/v2/section-routes';
import { HOME_TILE_HUES } from '@/lib/pastel';
import { cn } from '@/lib/utils';
import type {
  WorkHistoryEntry, V2Section, HomeTileKey, HomeTileContent, NavIconName,
} from '@/lib/types';

const ICON_STROKE = 1.75;

// Layout/behavior per tile — content (title/description/buttonLabel/icon) comes from Sanity via `tiles`.
const TILE_LAYOUT: Record<HomeTileKey, {
  size: 'lg' | 'md' | 'sm'; hue: number; image?: string;
  className?: string; targetSection?: V2Section;
}> = {
  projects: {
    size: 'lg', hue: HOME_TILE_HUES.projects, image: '/images/tiles/tile-projects.png',
    className: 'min-h-[17.5rem]', targetSection: 'projects',
  },
  ask: {
    size: 'md', hue: HOME_TILE_HUES.ask, image: '/images/tiles/tile-ask.png',
    className: 'flex-1 min-h-[8.125rem]', targetSection: 'ask',
  },
  metrics: {
    size: 'md', hue: HOME_TILE_HUES.metrics, image: '/images/tiles/tile-metrics.png',
    className: 'flex-1 min-h-[8.125rem]', targetSection: 'metrics',
  },
  work: {
    size: 'md', hue: HOME_TILE_HUES.work, image: '/images/tiles/tile-work.png', className: 'min-h-[9.375rem]',
  },
  recommendations: {
    size: 'sm', hue: HOME_TILE_HUES.recommendations, image: '/images/tiles/tile-recs.png',
    targetSection: 'recommendations',
  },
  coding: { size: 'sm', hue: HOME_TILE_HUES.coding, image: '/images/tiles/tile-coding.png', targetSection: 'coding' },
  offclock: { size: 'sm', hue: HOME_TILE_HUES.offclock, targetSection: 'offclock' },
};

export function Home({
  tiles, workHistory,
}: {
  tiles: HomeTileContent[]; workHistory: WorkHistoryEntry[];
}) {
  const router = useRouter();
  const byKey = new Map(tiles.map((t) => [t.key, t]));

  const renderTile = (key: HomeTileKey) => {
    const content = byKey.get(key);
    const layout = TILE_LAYOUT[key];
    if (!content) return null;

    return (
      <HomeCard
        key={key}
        size={layout.size}
        hue={layout.hue}
        image={layout.image}
        className={cn(layout.className, layout.size === 'lg' && '[&_p]:max-w-sm')}
        icon={<NavIcon name={content.icon} sizeClassName={HOME_CARD_ICON_SIZE[layout.size]} />}
        title={content.title}
        description={content.description}
        buttonLabel={content.buttonLabel}
        onClick={layout.targetSection ? () => router.push(sectionHref(layout.targetSection!)) : undefined}
        component={key === 'work' ? <WorkHistoryTimeline entries={workHistory} /> : undefined}
      />
    );
  };

  return (
    <div className="flex flex-col gap-3.5 h-full">
      <div className="grid grid-cols-[1.7fr_1fr] gap-3.5" style={{ flex: 2 }}>
        {renderTile('projects')}
        <div className="flex flex-col gap-3.5">
          {(['ask', 'metrics'] as const).map((key) => renderTile(key))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1.7fr] gap-3.5 min-h-0" style={{ flex: 1 }}>
        {renderTile('work')}
        <div className="grid grid-cols-3 gap-2.5">
          {(['recommendations', 'coding', 'offclock'] as const).map((key) => renderTile(key))}
        </div>
      </div>
    </div>
  );
}

function NavIcon({ name, sizeClassName }: { name: NavIconName; sizeClassName: string }) {
  const Icon = NAV_ICONS[name];
  return <Icon className={sizeClassName} strokeWidth={ICON_STROKE} />;
}

function WorkHistoryTimeline({ entries }: { entries: WorkHistoryEntry[] }) {
  return (
    <div className='mt-4'>
      {entries.map((entry, i) => {
        const isCurrent = entry.range.toLowerCase().includes('now');
        const isLast = i === entries.length - 1;
        return (
          <div key={entry.org} className="flex gap-2.5">
            <div className="flex flex-col items-center w-2.5 shrink-0">
              <span className="w-[0.4375rem] h-[0.4375rem] rounded-full bg-foreground mt-1 shrink-0" />
              {!isLast && <span className="w-px flex-1 bg-foreground/25 mt-0.5" />}
            </div>
            <div className="flex-1 pb-2.5 min-w-0 overflow-hidden">
              <div className="flex items-baseline justify-between gap-1.5">
                <span className="text-0_7 font-semibold truncate">{entry.org}</span>
                <span className="text-0_6 text-muted-foreground shrink-0 flex items-center gap-1">
                  {isCurrent && (
                    <span className="relative inline-flex size-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[oklch(0.62_0.06_155)] opacity-60 animate-ping" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-[oklch(0.62_0.06_155)]" />
                    </span>
                  )}
                  {entry.range}
                </span>
              </div>
              <div className="text-0_6 text-muted-foreground mt-0.5 truncate">{entry.role}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
