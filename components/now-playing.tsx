'use client';
import { Loader2, Music2 } from 'lucide-react';
import { metaItalic } from '@/lib/typography';
import { useNowPlaying } from '@/lib/queries/spotify';

export function NowPlaying() {
  const { data, isLoading, isError, error } = useNowPlaying();

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-g" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-0_8 text-destructive py-2 break-words">
        {error?.message ?? "can't reach spotify right now"}
      </div>
    );
  }

  if (!data) {
    return <p className="text-0_8 text-ink/50 py-2">not listening to anything right now.</p>;
  }

  return (
    <a href={data.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-1 group">
      {data.albumArt ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.albumArt} alt="" className="h-10 w-10 rounded-sm object-cover shrink-0" />
      ) : (
        <div className="h-10 w-10 rounded-sm bg-g/10 flex items-center justify-center shrink-0">
          <Music2 className="h-4 w-4 text-g" />
        </div>
      )}
      <div className="min-w-0">
        <div className={`${metaItalic} text-ink/45 mb-0.5`}>{data.isPlaying ? 'listening now' : 'last played'}</div>
        <div className="text-0_8 truncate group-hover:text-g">{data.track}</div>
        <div className="text-0_7 text-ink/50 truncate">{data.artist}</div>
      </div>
    </a>
  );
}
