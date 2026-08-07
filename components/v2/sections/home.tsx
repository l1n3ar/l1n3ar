'use client';
import { useRouter } from 'next/navigation';
import { Code2, Loader2 } from 'lucide-react';
import { HomeCard, HOME_CARD_ICON_SIZE } from '@/components/v2/sections/home-tile';
import { NAV_ICONS } from '@/components/v2/nav-icons';
import { projectIcon } from '@/components/v2/sections/project-icons';
import { sectionHref } from '@/components/v2/section-routes';
import { useSite } from '@/components/v2/site-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSystemMetrics } from '@/hooks/system-metrics';
import { useLeetcodeProfile } from '@/hooks/coding';
import { HOME_TILE_HUES, hueForKey, pastelChipStyle } from '@/lib/pastel';
import { cn } from '@/lib/utils';
import type {
  WorkHistoryEntry, V2Section, HomeTileKey, HomeTileContent, NavIconName, Project, Recommendation,
} from '@/lib/types';

const ICON_STROKE = 1.75;
const LEETCODE_HUE = 55;
// Requested display order — home.tsx matches on a loose name substring since project
// slugs aren't guaranteed to equal these, and silently skips any that aren't found.
const FEATURED_PROJECT_NAMES = ['phoenix', 'l1n3ar', 'eiger'];

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
    className: 'min-h-[11rem]', targetSection: 'recommendations',
  },
  l1n3ar: {
    size: 'sm', hue: HOME_TILE_HUES.l1n3ar, image: '/images/tiles/tile-coding.png',
    className: 'min-h-[11rem]', targetSection: 'l1n3ar',
  },
};

// Small live-data block rendered in its own slot below a tile's static CMS description
// (never inline with it — see HomeCard's `extra` prop), turning Home from a static menu
// into something that shows the site is actually alive right now.
function Stat({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground/80">{children}</span>;
}

function LiveStat({ children }: { children: React.ReactNode }) {
  return (
    <Stat>
      <span className="inline-flex items-center gap-1.5">
        <span className="relative inline-flex size-1.5 shrink-0">
          <span className="absolute inline-flex size-full rounded-full bg-green-600 dark:bg-green-500 opacity-60 animate-ping" />
          <span className="relative inline-flex size-1.5 rounded-full bg-green-600 dark:bg-green-500" />
        </span>
        {children}
      </span>
    </Stat>
  );
}

// Mirrors recommendations.tsx's own splitWho/initials exactly, kept local since this is
// a compact tile-scale rendering, not the full recommendations page component.
function splitWho(who: string): { name: string } {
  const [name] = who.split('·').map((s) => s.trim());
  return { name };
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function MiniRecommendations({ description, recommendations }: { description?: string; recommendations: Recommendation[] }) {
  const shown = recommendations.slice(0, 3);

  return (
    <div className="flex flex-col">
      {description && <p className="text-0_6 text-muted-foreground leading-snug">{description}</p>}
      {shown.length > 0 && (
        <div className="mt-6 flex flex-col gap-2 min-h-0 overflow-y-auto gz-scroll">
          {shown.map((r) => {
            const { name } = splitWho(r.who);
            const chipStyle = pastelChipStyle(hueForKey(r.who));
            return (
              <div key={r.who} className="flex items-start gap-2">
                <div
                  className="pastel-chip size-icon-md rounded-sm flex items-center justify-center text-0_6 font-semibold shrink-0"
                  style={chipStyle}
                >
                  {initials(name)}
                </div>
                <p className="text-0_6 text-muted-foreground leading-snug line-clamp-2 min-w-0">
                  <span className="font-semibold text-foreground/80">{name}</span> — {r.quote}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MiniLeetCode({ handle }: { handle: string }) {
  const { data, isLoading, isError } = useLeetcodeProfile(handle);
  const total = data?.solvedByDifficulty.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="flex items-center gap-2 border border-border mt-2 rounded-lg p-2 bg-card">
      <div
        className="pastel-chip size-icon-md rounded-md flex items-center justify-center shrink-0"
        style={pastelChipStyle(LEETCODE_HUE)}
      >
        <Code2 className="size-icon-xs" strokeWidth={ICON_STROKE} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-0_6 font-semibold truncate">LeetCode</div>
        <div className="text-0_6 text-muted-foreground truncate">{handle}</div>
      </div>
      <span className="text-0_9 font-semibold shrink-0">
        {isLoading || isError ? '—' : total ?? 0}
      </span>
    </div>
  );
}

function L1n3arEmbeds({ description, leetcodeHandle }: { description?: string; leetcodeHandle?: string }) {
  return (
    <div className="flex flex-col">
      {description && <p className="text-0_6 text-muted-foreground leading-snug">{description}</p>}
      <div className="mt-2 flex flex-col gap-2 min-h-0 overflow-y-auto gz-scroll">
        {leetcodeHandle && <MiniLeetCode handle={leetcodeHandle} />}
      </div>
    </div>
  );
}

function FeaturedProjects({
  description, projects,
}: {
  description?: string; projects: Project[];
}) {
  const router = useRouter();
  const featured = FEATURED_PROJECT_NAMES
    .map((n) => projects.find((p) => p.name.toLowerCase().includes(n)))
    .filter((p): p is Project => Boolean(p));

  return (
    <div className="flex flex-col">
      {description && <p className="text-0_8 text-muted-foreground leading-snug mb-6 max-w-sm">{description}</p>}
      {featured.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="text-0_6 font-semibold text-muted-foreground uppercase ml-2">Featured</div>
          <div className="flex gap-2 flex-wrap">
            {featured.map((p) => {
              const Icon = projectIcon(p.id);
              const chipStyle = pastelChipStyle(hueForKey(p.id));
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/projects/${p.id}`);
                  }}
                  className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1.5 rounded-sm hover:bg-black/5 dark:hover:bg-white/10 text-0_7 font-medium transition-colors"
                >
                  <span
                    className="pastel-chip size-icon-md rounded-sm flex items-center justify-center shrink-0"
                    style={chipStyle}
                  >
                    <Icon className="size-icon-xs" strokeWidth={ICON_STROKE} />
                  </span>
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
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
    // Work/Ask/Metrics keep their content on mobile too — only the bespoke embeds for
    // projects/recommendations/l1n3ar are desktop-only, falling back to plain description+button.
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
              <span
                className={`w-[0.4375rem] h-[0.4375rem] rounded-full mt-1 shrink-0 ${
                  isCurrent ? 'bg-green-700' : 'bg-foreground'
                }`}
              />
              {!isLast && <span className="w-px flex-1 bg-foreground/25 mt-0.5" />}
            </div>
            <div className="flex-1 pb-2.5 min-w-0 overflow-hidden">
              <div className="flex items-baseline justify-between gap-1.5">
                <span className="text-0_7 font-semibold truncate">{entry.org}</span>
                <span className="text-0_6 text-muted-foreground shrink-0">{entry.range}</span>
              </div>
              <div className="text-0_6 text-muted-foreground mt-0.5 truncate">{entry.role}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
