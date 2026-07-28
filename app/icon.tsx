import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
            fontSize: 22,
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
