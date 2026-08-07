'use client';
import { Camera, Code2, Link2, Loader2, Music2, Play, Video } from 'lucide-react';
import { SiInstagram, SiSpotify, SiYoutube, type IconType } from '@icons-pack/react-simple-icons';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCodeforcesProfile, useLeetcodeProfile } from '@/hooks/coding';
import { useNowPlaying } from '@/hooks/spotify';
import { timeAgo } from '@/lib/deployment-meta';
import { hueForKey, pastelChipStyle } from '@/lib/pastel';
import {
  OFF_THE_CLOCK_LINK_KINDS, type CodingProfiles, type OffTheClock, type MusicEntry, type OffTheClockLink,
} from '@/lib/types';
import type { CodeforcesProfile } from '@/actions/codeforces';
import type { LeetcodeProfile } from '@/actions/leetcode';

const ICON_STROKE = 1.75;
const LEETCODE_HUE = 55;
const CODEFORCES_HUE = 250;

// ---------------------------------------------------------------------------
// Coding practice
// ---------------------------------------------------------------------------

function StatCardShell({ hue, label, handle, value, children }: {
  hue: number; label: string; handle: string; value: React.ReactNode; children?: React.ReactNode;
}) {
  const chipStyle = pastelChipStyle(hue);
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="pastel-chip size-icon-lg rounded-lg flex items-center justify-center shrink-0" style={chipStyle}>
          <Code2 className="size-icon-sm" strokeWidth={ICON_STROKE} />
        </div>
        <div className="min-w-0">
          <div className="text-0_8 font-semibold">{label}</div>
          <div className="text-0_6 text-muted-foreground truncate">{handle}</div>
        </div>
        <span className="ml-auto text-1_2 font-semibold shrink-0">{value}</span>
      </div>
      {children}
    </div>
  );
}

function DifficultyBar({ solvedByDifficulty }: { solvedByDifficulty: { difficulty: string; count: number }[] }) {
  const easy = solvedByDifficulty.find((d) => d.difficulty === 'Easy')?.count ?? 0;
  const medium = solvedByDifficulty.find((d) => d.difficulty === 'Medium')?.count ?? 0;
  const hard = solvedByDifficulty.find((d) => d.difficulty === 'Hard')?.count ?? 0;
  const total = easy + medium + hard || 1;

  return (
    <div>
      <div className="flex h-1.5 rounded-full overflow-hidden mb-2.5">
        <div className="bg-green-300 dark:bg-green-800" style={{ width: `${(easy / total) * 100}%` }} />
        <div className="bg-yellow-300 dark:bg-yellow-800" style={{ width: `${(medium / total) * 100}%` }} />
        <div className="bg-red-300 dark:bg-red-800" style={{ width: `${(hard / total) * 100}%` }} />
      </div>
      {/* <div className="flex gap-3.5 text-0_6 text-muted-foreground">
        <span>easy {easy}</span>
        <span>medium {medium}</span>
        <span>hard {hard}</span>
      </div> */}
    </div>
  );
}

type ActivityRow = { key: string; title: string; href: string; when: number };

function RecentActivity({ rows }: { rows: ActivityRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="border border-border rounded-lg overflow-hidden mt-2.5">
      <div className="text-0_6 font-semibold text-muted-foreground uppercase tracking-wide px-3 py-2 bg-muted">
        Recent activity
      </div>
      {rows.map((r) => (
        <a
          key={r.key}
          href={r.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border text-0_7 text-foreground/85 hover:bg-muted/50"
        >
          <span className="flex-1 min-w-0 truncate">{r.title}</span>
          <span className="text-0_6 text-muted-foreground shrink-0">{timeAgo(r.when * 1000)}</span>
        </a>
      ))}
    </div>
  );
}

function CodingPractice({ profiles }: { profiles?: CodingProfiles }) {
  const leetcode = useLeetcodeProfile(profiles?.leetcode ?? '');
  const codeforces = useCodeforcesProfile(profiles?.codeforces ?? '');

  if (!profiles?.leetcode && !profiles?.codeforces) {
    return <p className="text-0_7 text-muted-foreground">No coding profiles configured.</p>;
  }

  const lc: LeetcodeProfile | undefined = leetcode.isError ? undefined : leetcode.data;
  const cf: CodeforcesProfile | undefined = codeforces.isError ? undefined : codeforces.data;

  const rows: ActivityRow[] = [
    ...(lc?.recentSolved.map((s) => ({ key: s.url, title: s.title, href: s.url, when: s.when })) ?? []),
    ...(cf?.recentSolved.map((s) => ({ key: `${s.url}${s.when}`, title: s.name, href: s.url, when: s.when })) ?? []),
  ].sort((a, b) => b.when - a.when).slice(0, 8);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {profiles.leetcode && (
          <StatCardShell
            hue={LEETCODE_HUE}
            label="LeetCode"
            handle={profiles.leetcode}
            value={leetcode.isLoading ? '—' : leetcode.isError ? '—' : lc?.solvedByDifficulty.reduce((sum, d) => sum + d.count, 0) ?? 0}
          >
            {leetcode.isError && <p className="text-0_6 text-destructive">couldn&apos;t load LeetCode stats.</p>}
            {lc && !leetcode.isError && <DifficultyBar solvedByDifficulty={lc.solvedByDifficulty} />}
          </StatCardShell>
        )}
        {profiles.codeforces && (
          <StatCardShell
            hue={CODEFORCES_HUE}
            label="Codeforces"
            handle={profiles.codeforces}
            value={codeforces.isLoading ? '—' : codeforces.isError ? '—' : cf?.rating ?? '—'}
          >
            {codeforces.isError && <p className="text-0_6 text-destructive">couldn&apos;t load Codeforces stats.</p>}
            {cf && !codeforces.isError && (
              <p className="text-0_7 ml-8 text-muted-foreground">
                {cf.rank ?? 'unrated'}
                {cf.maxRating !== undefined && ` · max ${cf.maxRating}`}
              </p>
            )}
          </StatCardShell>
        )}
      </div>

      <RecentActivity rows={rows} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Off the clock
// ---------------------------------------------------------------------------

const LINK_ICON: Record<OffTheClockLink['kind'], typeof Video> = {
  youtube: Video,
  spotify: Music2,
  instagram: Camera,
  link: Link2,
};

// Keep every OffTheClockLink['kind'] represented above — enforced at compile time.
OFF_THE_CLOCK_LINK_KINDS satisfies readonly (keyof typeof LINK_ICON)[];

function youtubeThumbnail(href: string): string | undefined {
  const id = href.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/)?.[1];
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : undefined;
}

function MusicLinkCard({ link }: { link: OffTheClockLink }) {
  const thumb = link.kind === 'link' ? youtubeThumbnail(link.href) : undefined;
  const Icon = LINK_ICON[link.kind];

  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className="group shrink-0 w-28">
      {thumb ? (
        <div className="relative w-28 h-16 rounded-md overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="size-icon-sm text-background fill-background" strokeWidth={ICON_STROKE} />
          </div>
        </div>
      ) : (
        <div className="w-28 h-16 rounded-md bg-muted flex items-center justify-center">
          <Icon className="size-icon-sm text-muted-foreground" strokeWidth={ICON_STROKE} />
        </div>
      )}
      <div className="mt-1 text-0_6 text-muted-foreground truncate group-hover:text-foreground">{link.label}</div>
    </a>
  );
}

const SOCIAL_ICON: Partial<Record<OffTheClockLink['kind'], IconType>> = {
  instagram: SiInstagram,
  spotify: SiSpotify,
  youtube: SiYoutube,
};

function BandSocialLinks({ links }: { links: OffTheClockLink[] }) {
  const seen = new Set<string>();
  const social = links.filter((l) => {
    if (!(l.kind in SOCIAL_ICON) || seen.has(l.kind)) return false;
    seen.add(l.kind);
    return true;
  });
  if (social.length === 0) return null;

  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {social.map((l) => {
        const Icon = SOCIAL_ICON[l.kind]!;
        return (
          <a
            key={l.kind}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={l.kind}
            className="size-icon-lg rounded-md flex items-center justify-center text-foreground hover:bg-muted"
          >
            <Icon className="size-icon-xs" color="currentColor" />
          </a>
        );
      })}
    </div>
  );
}

function BandCard({ entry }: { entry: MusicEntry }) {
  const chipStyle = pastelChipStyle(hueForKey(entry.band));
  const thumbnailLinks = entry.links.filter((l) => l.kind == 'link');

  return (
    <div className="border border-border rounded-lg p-4 bg-card flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-0.5">
        <div className="text-0_8 font-semibold">{entry.band}</div>
        <BandSocialLinks links={entry.links} />
      </div>
      <p className="text-0_7 text-muted-foreground leading-snug mb-2">{entry.tagline}</p>
      {entry.now && (
        <p className="text-0_6 font-semibold mb-2.5" style={{ color: (chipStyle as Record<string, string>)['--pastel-fg'] }}>
          {entry.now}
        </p>
      )}
      {thumbnailLinks.length > 0 && (
        <div className="flex gap-2 mt-auto overflow-x-auto thin-scroll pb-1">
          {thumbnailLinks.map((l) => <MusicLinkCard key={l.href} link={l} />)}
        </div>
      )}
    </div>
  );
}

function NowPlayingCard() {
  const { data, isLoading, isError, error } = useNowPlaying();

  if (isLoading) return   <Loader2 className="size-icon-sm animate-spin text-muted-foreground" strokeWidth={ICON_STROKE} />;
  if (isError) {
    return <p className="text-0_7 text-destructive">{error?.message ?? "can't reach Spotify right now."}</p>;
  }
  if (!data) return <p className="text-0_7 text-muted-foreground">not listening to anything right now.</p>;

  return (
    <div className="border border-border rounded-lg p-3 bg-card max-w-md">
      <div className="text-0_6 text-muted-foreground mb-2">{data.isPlaying ? 'Listening now' : 'Last played'}</div>
      <iframe
        key={data.embedUrl}
        src={data.embedUrl}
        title={`${data.track} — ${data.artist}`}
        width="100%"
        height="80"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="rounded-md"
      />
    </div>
  );
}

function OffTheClock({ content }: { content: OffTheClock }) {
  if (content.music.length === 0) {
    return <p className="text-0_7 text-muted-foreground">No bands configured.</p>;
  }
  return (
    <div>
      <div className="text-0_6 font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
        Bands I am in
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
        {content.music.map((entry) => <BandCard key={entry.band} entry={entry} />)}
      </div>
      <div className="text-0_6 font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
        Currently listening
      </div>
      <NowPlayingCard />
    </div>
  );
}

// ---------------------------------------------------------------------------

export function L1n3ar({
  codingProfiles, offTheClock,
}: {
  codingProfiles?: CodingProfiles;
  offTheClock: OffTheClock;
}) {
  return (
    <div>
      <Tabs defaultValue="coding">
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="coding" className="text-0_7">Coding Practice</TabsTrigger>
          <TabsTrigger value="offclock" className="text-0_7">Off the clock</TabsTrigger>
        </TabsList>
        <TabsContent value="coding">
          <CodingPractice profiles={codingProfiles} />
        </TabsContent>
        <TabsContent value="offclock">
          <OffTheClock content={offTheClock} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
