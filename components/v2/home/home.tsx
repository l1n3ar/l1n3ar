'use client';
import { useRouter } from 'next/navigation';
import { HomeCard, HOME_CARD_ICON_SIZE } from '@/components/v2/home/home-tile';
import { LiveStat } from '@/components/v2/home/live-stat';
import { WorkHistoryTimeline } from '@/components/v2/home/work-history-timeline';
import { FeaturedProjects } from '@/components/v2/home/featured-projects';
import { MiniRecommendations } from '@/components/v2/home/mini-recommendations';
import { L1n3arEmbeds } from '@/components/v2/home/l1n3ar-embeds';
import { NAV_ICONS } from '@/components/v2/nav-icons';
import { sectionHref } from '@/components/v2/section-routes';
import { useSite } from '@/components/v2/site-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSystemMetrics } from '@/hooks/system-metrics';
import { HOME_TILE_HUES } from '@/lib/pastel';
import { cn } from '@/lib/utils';
import type {
  WorkHistoryEntry, V2Section, HomeTileKey, HomeTileContent, NavIconName, Recommendation,
} from '@/lib/types';

const ICON_STROKE = 1.75;

const TILE_LAYOUT: Record<HomeTileKey, {
  size: 'lg' | 'md' | 'sm'; hue: number; image?: string;
  className?: string; targetSection?: V2Section;
}> = {
  projects: {
    size: 'lg', hue: HOME_TILE_HUES.projects, image: '/images/tiles/tile-projects.png',
    className: 'min-h-home-tile-lg', targetSection: 'projects',
  },
  ask: {
    size: 'md', hue: HOME_TILE_HUES.ask, image: '/images/tiles/tile-ask.png',
    className: 'flex-1 min-h-home-tile-xs', targetSection: 'ask',
  },
  metrics: {
    size: 'md', hue: HOME_TILE_HUES.metrics, image: '/images/tiles/tile-metrics.png',
    className: 'flex-1 min-h-home-tile-xs', targetSection: 'metrics',
  },
  work: {
    size: 'md', hue: HOME_TILE_HUES.work, image: '/images/tiles/tile-work.png', className: 'min-h-home-tile-sm',
  },
  recommendations: {
    size: 'sm', hue: HOME_TILE_HUES.recommendations, image: '/images/tiles/tile-recs.png',
    className: 'min-h-home-tile-md', targetSection: 'recommendations',
  },
  l1n3ar: {
    size: 'sm', hue: HOME_TILE_HUES.l1n3ar, image: '/images/tiles/tile-coding.png',
    className: 'min-h-home-tile-md', targetSection: 'l1n3ar',
  },
};

function NavIcon({ name, sizeClassName }: { name: NavIconName; sizeClassName: string }) {
  const Icon = NAV_ICONS[name];
  return <Icon className={sizeClassName} strokeWidth={ICON_STROKE} />;
}

export function Home({
  tiles, workHistory, recommendations,
}: {
  tiles: HomeTileContent[]; workHistory: WorkHistoryEntry[]; recommendations: Recommendation[];
}) {
  const router = useRouter();
  const { site, projects } = useSite();
  const byKey = new Map(tiles.map((t) => [t.key, t]));
  const { data: metrics } = useSystemMetrics();
  const isMobile = useIsMobile();

  const extraFor = (key: HomeTileKey): React.ReactNode => {
    if (!metrics) return null;
    if (key === 'ask') {
      const n = metrics.traffic.questionsToday;
      return <LiveStat>{n} question{n === 1 ? '' : 's'} answered today</LiveStat>;
    }
    if (key === 'metrics') {
      const n = metrics.traffic.liveVisitors;
      return <LiveStat>{n} live visitor{n === 1 ? '' : 's'}</LiveStat>;
    }
    return null;
  };

  const componentFor = (key: HomeTileKey, content: HomeTileContent): React.ReactNode => {
    if (key === 'work') return <WorkHistoryTimeline entries={workHistory} />;
    if (isMobile) return undefined;
    if (key === 'projects') {
      return <FeaturedProjects description={content.description} projects={projects} />;
    }
    if (key === 'recommendations') {
      return <MiniRecommendations description={content.description} recommendations={recommendations} />;
    }
    if (key === 'l1n3ar') {
      return <L1n3arEmbeds description={content.description} leetcodeHandle={site.codingProfiles?.leetcode} />;
    }
    return undefined;
  };

  const renderTile = (key: HomeTileKey) => {
    const content = byKey.get(key);
    const layout = TILE_LAYOUT[key];
    if (!content) return null;
    const component = componentFor(key, content);

    return (
      <HomeCard
        key={key}
        size={layout.size}
        hue={layout.hue}
        image={layout.image}
        className={cn(layout.className, layout.size === 'lg' && '[&_p]:max-w-sm')}
        icon={<NavIcon name={content.icon} sizeClassName={HOME_CARD_ICON_SIZE[layout.size]} />}
        title={content.title}
        description={component ? undefined : content.description}
        extra={component ? undefined : extraFor(key)}
        buttonLabel={content.buttonLabel}
        onClick={layout.targetSection ? () => router.push(sectionHref(layout.targetSection!)) : undefined}
        component={component}
      />
    );
  };

  return (
    <div className="flex flex-col gap-3.5 md:flex-1 md:min-h-0">
      <div className="grid grid-cols-1 md:grid-cols-[1.7fr_1fr] gap-3.5 md:flex-[2]">
        {renderTile('projects')}
        <div className="flex flex-col gap-3.5">
          {(['ask', 'metrics'] as const).map((key) => renderTile(key))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.7fr] gap-3.5 md:min-h-0 md:flex-[1]">
        {renderTile('work')}
        <div className="grid grid-cols-2 gap-2.5">
          {(['recommendations', 'l1n3ar'] as const).map((key) => renderTile(key))}
        </div>
      </div>
    </div>
  );
}
