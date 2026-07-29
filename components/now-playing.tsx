'use client';
import { Loader2 } from 'lucide-react';
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
    <div className="py-1">
      <div className="font-heading italic text-0_8 text-ink/45 mb-1.5">{data.isPlaying ? 'listening now' : 'last played'}</div>
      <iframe
        key={data.embedUrl}
        src={data.embedUrl}
        title={`${data.track} — ${data.artist}`}
        width="100%"
        height="80"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        className="rounded-sm"
      />
    </div>
  );
}
