'use client';
import { Video, Camera, Music2, Link2, Play } from 'lucide-react';
import { NowPlaying } from './now-playing';
import { SidebarPopover } from './sidebar-popover';
import { OFF_THE_CLOCK_LINK_KINDS, type OffTheClock, type MusicEntry, type OffTheClockLink } from '@/lib/types';

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
  const thumb = link.kind === 'youtube' ? youtubeThumbnail(link.href) : undefined;
  const Icon = LINK_ICON[link.kind];

  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className="group shrink-0 w-28">
      {thumb ? (
        <div className="relative w-28 h-16 rounded-sm overflow-hidden bg-g/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumb} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-ink/25 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="h-5 w-5 text-cream fill-cream" />
          </div>
        </div>
      ) : (
        <div className="w-28 h-16 rounded-sm bg-g/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-g" />
        </div>
      )}
      <div className="mt-1 text-0_7 text-ink/60 truncate group-hover:text-g">{link.label}</div>
    </a>
  );
}

function MusicEntryCard({ entry, isFirst }: { entry: MusicEntry; isFirst?: boolean }) {
  return (
    <div className={`pb-3 ${isFirst ? '' : 'border-t border-g/20 pt-3'}`}>
      <span className="font-heading italic text-0_9">{entry.band}</span>
      <p className="text-0_8 text-ink/60 leading-snug mt-0.5">{entry.tagline}</p>
      {entry.now && (
        <p className="text-0_7 text-g mt-1">
          <span className="text-ink/40">now:</span> {entry.now}
        </p>
      )}
      {entry.links.length > 0 && (
        <div className="flex gap-2 mt-2 overflow-x-auto gz-scroll pb-1">
          {entry.links.map((l) => (
            <MusicLinkCard key={l.href} link={l} />
          ))}
        </div>
      )}
    </div>
  );
}

export function OffTheClockPopover({
  content, onTriggerSiu,
}: { content: OffTheClock; onTriggerSiu: () => void }) {
  return (
    <SidebarPopover label="off the clock">
      <div className="gz-scroll flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4">
        <NowPlaying />

        {content.music.length > 0 && (
          <div className="font-heading italic text-0_8 text-ink/45 mt-3 pt-3 mb-3 border-t border-g/20">bands i am in</div>
        )}

        {content.music.map((entry, i) => (
          <MusicEntryCard key={entry.band} entry={entry} isFirst={i === 0} />
        ))}

        {/* <button
          type="button"
          onClick={onTriggerSiu}
          className="w-full mt-3 pt-3 border-t border-g/20 flex items-center justify-center gap-2 font-heading italic text-0_8 text-g hover:text-g/70"
        >
          hit the siu
          <span className={`${metaItalic} text-ink/35`}>⌘7</span>
        </button> */}
      </div>
    </SidebarPopover>
  );
}
