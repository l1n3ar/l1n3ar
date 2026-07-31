// Satori (next/og's ImageResponse renderer, used by app/icon.tsx, app/apple-icon.tsx, and
// app/opengraph-image.tsx) can't consume CSS custom properties, so these mirror the palette
// defined in app/globals.css as plain hex literals for those three files to share.
export const BRAND_COLORS = {
  g: '#0b3d2e',
  cream: '#f6f1e4',
  ink: '#1b2420',
} as const;
