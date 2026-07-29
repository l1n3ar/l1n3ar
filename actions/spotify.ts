'use server';
import { z } from 'zod';
import { apiFetch } from '@/lib/api-client';

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';

const tokenResponseSchema = z.object({ access_token: z.string() });

const trackSchema = z.object({
  id: z.string(),
  type: z.string().default('track'),
  name: z.string(),
  external_urls: z.object({ spotify: z.string() }),
  album: z.object({ images: z.array(z.object({ url: z.string() })) }),
  artists: z.array(z.object({ name: z.string() })),
});

const nowPlayingBodySchema = z.object({ is_playing: z.boolean(), item: trackSchema.nullable() });

// Spotify returns a bare 204 (empty body) when nothing is playing — apiFetch
// treats 2xx as success, so that case is modeled here as `null` rather than
// as an error, letting the caller fall back to recently-played.
const nowPlayingResponseSchema = z.preprocess(
  (v) => (v === '' || v == null ? null : v),
  nowPlayingBodySchema.nullable(),
);

const recentlyPlayedResponseSchema = z.object({
  items: z.array(z.object({ track: trackSchema })),
});

export type NowPlaying = {
  track: string;
  artist: string;
  albumArt?: string;
  url: string;
  embedUrl: string;
  isPlaying: boolean;
};

export type GetNowPlayingResult =
  | { ok: true; data: NowPlaying | null }
  | { ok: false; error: string };

function toNowPlaying(t: z.infer<typeof trackSchema>, isPlaying: boolean): NowPlaying {
  return {
    track: t.name,
    artist: t.artists.map((a) => a.name).join(', '),
    albumArt: t.album.images[0]?.url,
    url: t.external_urls.spotify,
    embedUrl: `https://open.spotify.com/embed/${t.type}/${t.id}`,
    isPlaying,
  };
}

function spotifyErrorMessage(body: unknown, status: number): string {
  const message = (body as { error?: { message?: string } } | null)?.error?.message;
  return message ? `spotify: ${message}` : `spotify returned ${status}`;
}

export async function getNowPlaying(): Promise<GetNowPlayingResult> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    return { ok: false, error: 'spotify is not configured yet' };
  }

  const tokenResult = await apiFetch({
    url: TOKEN_URL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
    schema: tokenResponseSchema,
    errorMessage: () => 'could not refresh spotify access token',
  });
  if (!tokenResult.ok) return tokenResult;
  const authHeader = { Authorization: `Bearer ${tokenResult.data.access_token}` };

  const current = await apiFetch({
    url: NOW_PLAYING_URL,
    headers: authHeader,
    schema: nowPlayingResponseSchema,
    errorMessage: spotifyErrorMessage,
  });
  if (!current.ok) return current;
  if (current.data?.item) {
    return { ok: true, data: toNowPlaying(current.data.item, current.data.is_playing) };
  }

  const recent = await apiFetch({
    url: RECENTLY_PLAYED_URL,
    headers: authHeader,
    schema: recentlyPlayedResponseSchema,
    errorMessage: spotifyErrorMessage,
  });
  if (!recent.ok) return recent;

  const last = recent.data.items[0];
  return { ok: true, data: last ? toNowPlaying(last.track, false) : null };
}
