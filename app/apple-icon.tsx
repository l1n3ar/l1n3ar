import { ImageResponse } from 'next/og';
import { BRAND_COLORS } from '@/lib/brand-colors';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: BRAND_COLORS.g,
        }}
      >
        <span
          style={{
            color: BRAND_COLORS.cream,
            fontSize: 110,
            fontStyle: 'italic',
            fontWeight: 300,
            lineHeight: 1,
          }}
        >
          M
        </span>
      </div>
    ),
    { ...size },
  );
}
