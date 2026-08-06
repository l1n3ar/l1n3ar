import { readFile } from 'fs/promises';
import { join } from 'path';
import { ImageResponse } from 'next/og';
import { getSiteConfig } from '@/lib/content';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Plain hex mirrors of the v2 light-mode tokens in app/globals.css (Satori/ImageResponse
// can't consume CSS custom properties). Deliberately not lib/brand-colors.ts — that's v1's
// palette, still used by v1's icon.tsx/apple-icon.tsx and must stay untouched.
const V2_COLORS = {
  background: '#ffffff',
  foreground: '#0d0d0d',
  mutedForeground: '#636363',
};

export default async function OpengraphImage() {
  const [site, imageBuffer] = await Promise.all([
    getSiteConfig(),
    // A cropped screenshot of the live homepage — see how it was generated in the
    // "how can I make the opengraph image an image of my website" conversation.
    // Re-take/re-crop this whenever the site's design changes noticeably.
    readFile(join(process.cwd(), 'public/images/og-site.png')),
  ]);
  const screenshot = `data:image/png;base64,${imageBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          backgroundColor: V2_COLORS.background,
        }}
      >
        <img
          src={screenshot}
          alt=""
          width={size.width}
          height={size.height}
          style={{ position: 'absolute', inset: 0, objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 56px',
            background: 'linear-gradient(to top, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0) 100%)',
          }}
        >
          <div style={{ display: 'flex', fontSize: 52, fontWeight: 600, color: V2_COLORS.foreground, fontFamily: 'sans-serif' }}>
            {site.name}
          </div>
          <div style={{ display: 'flex', fontSize: 26, color: V2_COLORS.mutedForeground, marginTop: 8, fontFamily: 'sans-serif' }}>
            {site.role}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
