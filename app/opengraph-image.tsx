import { ImageResponse } from 'next/og';
import site from '@/content/site.json';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
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
          backgroundColor: '#f6f1e4',
          color: '#1b2420',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, fontStyle: 'italic', color: '#0b3d2e', marginBottom: 24 }}>
          {site.location}
        </div>
        <div style={{ display: 'flex', fontSize: 88, fontWeight: 300, lineHeight: 1.05, color: '#0b3d2e' }}>
          {site.name.toLowerCase()}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            marginTop: 28,
            paddingTop: 28,
            borderTop: '4px solid #0b3d2e',
            color: '#1b2420',
          }}
        >
          {site.role}
        </div>
      </div>
    ),
    { ...size },
  );
}
