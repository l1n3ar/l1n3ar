import { ImageResponse } from 'next/og';

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
          backgroundColor: '#0b3d2e',
        }}
      >
        <span
          style={{
            color: '#f6f1e4',
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
