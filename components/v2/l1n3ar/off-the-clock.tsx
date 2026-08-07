import { Camera, Link2, Music2, Play, Video } from 'lucide-react';
import { SiInstagram, SiSpotify, SiYoutube, type IconType } from '@icons-pack/react-simple-icons';
import { ICON_STROKE } from '@/components/v2/constants';
import { NowPlayingCard } from '@/components/v2/l1n3ar/now-playing-card';
import { keyedPastelChipStyle } from '@/lib/pastel';
import {
  OFF_THE_CLOCK_LINK_KINDS, type OffTheClock as OffTheClockContent, type MusicEntry, type OffTheClockLink,
} from '@/lib/types';

const LINK_ICON: Record<OffTheClockLink['kind'], typeof Video> = {
  youtube: Video,
  spotify: Music2,
  instagram: Camera,
  link: Link2,
};

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
  const chipStyle = keyedPastelChipStyle(entry.band);
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

export function OffTheClock({ content }: { content: OffTheClockContent }) {
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
