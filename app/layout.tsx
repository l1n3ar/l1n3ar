import type { Metadata } from 'next';
import { Cormorant_Garamond, Lora, IBM_Plex_Mono } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { getSiteConfig } from '@/lib/content';
import { QueryProvider } from '@/components/query-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

// VERCEL_PROJECT_PRODUCTION_URL is Vercel's stable production domain — VERCEL_URL is
// per-deployment (drifts on every preview/prod deploy) and shouldn't be the primary
// fallback, since a stale/mismatched og:image URL is exactly why social previews break.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined)
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  return {
    metadataBase: new URL(siteUrl),
    title: `${site.name}`,
    description: site.about,
    openGraph: {
      title: `${site.name} · ${site.role}`,
      description: site.about,
      url: siteUrl,
      siteName: site.name,
      type: 'website',
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${site.name} · ${site.role}`,
      description: site.about,
      images: ['/opengraph-image'],
    },
  };
}

// The 'theme' key literal here must match THEME_STORAGE_KEY in lib/theme.ts — this script
// has to run before any JS module loads, so it can't import the constant directly.
const noFlashScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${lora.variable} ${ibmPlexMono.variable} ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body>
        <TooltipProvider>
          <QueryProvider>
            {children}
            <Analytics />
            <SpeedInsights />
          </QueryProvider>
        </TooltipProvider>

      </body>
    </html>
  );
}
