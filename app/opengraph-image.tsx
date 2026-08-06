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
  border: '#ebebeb',
};

export default async function OpengraphImage() {
  const [site, imageBuffer] = await Promise.all([
    getSiteConfig(),
    readFile(join(process.cwd(), 'public/images/tiles/tile-projects.png')),
  ]);
  const backgroundImage = `data:image/png;base64,${imageBuffer.toString('base64')}`;

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
          src={backgroundImage}
          alt=""
          width={size.width}
          height={size.height}
          style={{ position: 'absolute', inset: 0, objectFit: 'cover', opacity: 0.4 }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '80px',
            color: V2_COLORS.foreground,
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', fontSize: 84, fontWeight: 600, lineHeight: 1.05 }}>
            {site.name}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 32,
              marginTop: 28,
              paddingTop: 28,
              borderTop: `2px solid ${V2_COLORS.border}`,
              color: V2_COLORS.mutedForeground,
            }}
          >
            {site.role}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
