import { Loader2 } from 'lucide-react';
import { ICON_STROKE } from '@/components/v2/constants';
import { useNowPlaying } from '@/hooks/spotify';

export function NowPlayingCard() {
  const { data, isLoading, isError, error } = useNowPlaying();

  if (isLoading) return <Loader2 className="size-icon-sm animate-spin text-muted-foreground" strokeWidth={ICON_STROKE} />;
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
