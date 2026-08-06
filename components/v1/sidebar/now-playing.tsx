'use client';
import { useNowPlaying } from '@/hooks/spotify';
import { PanelLoading, PanelError } from '@/components/ui/query-state';

export function NowPlaying() {
  const { data, isLoading, isError, error } = useNowPlaying();

  if (isLoading) return <PanelLoading className="py-4" />;

  if (isError) {
    return <PanelError className="py-2" message={error?.message ?? "can't reach spotify right now"} />;
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
