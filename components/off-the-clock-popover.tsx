'use client';
import { Video, Camera, Music2, Link2, Play } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { kicker, metaItalic } from '@/lib/typography';
import { NowPlaying } from './now-playing';
import type { OffTheClock, MusicEntry, OffTheClockLink } from '@/lib/schema';

const LINK_ICON: Record<OffTheClockLink['kind'], typeof Video> = {
  youtube: Video,
  spotify: Music2,
  instagram: Camera,
  link: Link2,
};

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

function MusicEntryCard({ entry }: { entry: MusicEntry }) {
  return (
    <div className="py-3 border-t border-g/20 first:border-t-0 first:pt-0">
      <span className="font-heading italic text-0_95">{entry.band}</span>
      <p className="text-0_75 text-ink/60 leading-snug mt-0.5">{entry.tagline}</p>
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
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="shrink-0 w-full flex items-center gap-2 px-6 py-2 border-t border-g hover:bg-g/5 transition-colors text-left"
          />
        }
      >
        <span className={kicker}>off the clock</span>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="center"
        sideOffset={8}
        className="w-[22rem] max-h-[65vh] p-0 flex flex-col overflow-hidden"
      >
        <div className="px-4 pt-4 pb-2 shrink-0">
          <div className={kicker}>off the clock</div>
        </div>

        <div className="gz-scroll flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4">
          <NowPlaying />

          {content.music.map((entry) => (
            <MusicEntryCard key={entry.band} entry={entry} />
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
      </PopoverContent>
    </Popover>
  );
}
