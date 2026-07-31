import { ImageResponse } from 'next/og';
import { getSiteConfig } from '@/lib/content';
import { BRAND_COLORS } from '@/lib/brand-colors';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const site = await getSiteConfig();
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: BRAND_COLORS.cream,
          color: BRAND_COLORS.ink,
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, fontStyle: 'italic', color: BRAND_COLORS.g, marginBottom: 24 }}>
          {site.location}
        </div>
        <div style={{ display: 'flex', fontSize: 88, fontWeight: 300, lineHeight: 1.05, color: BRAND_COLORS.g }}>
          {site.name.toLowerCase()}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            marginTop: 28,
            paddingTop: 28,
            borderTop: `4px solid ${BRAND_COLORS.g}`,
            color: BRAND_COLORS.ink,
          }}
        >
          {site.role}
        </div>
      </div>
    ),
    { ...size },
  );
}
