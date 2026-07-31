'use client';
import type { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PanelLoading, PanelError } from '@/components/ui/query-state';
import { metaItalic } from '@/lib/typography';
import { timeAgo } from '@/lib/deployment-meta';
import { useCodeforcesProfile, useLeetcodeProfile } from '@/hooks/coding';
import type { CodeforcesProfile } from '@/actions/codeforces';
import type { LeetcodeProfile } from '@/actions/leetcode';
import type { CodingProfiles } from '@/lib/types';
import { SidebarPopover } from './sidebar-popover';

const ENABLED_PLATFORMS = ['leetcode', 'codeforces'] as const;
const PLATFORM_SHORT: Record<string, string> = { leetcode: 'lc', codeforces: 'cf' };
const PLATFORM_LABEL: Record<string, string> = { leetcode: 'leetcode', codeforces: 'codeforces' };

type Row = { key: string; href: string; primary: string; secondary: string };

function PlatformPanel<T>({
  useProfile, handle, emptyMessage, toSummary, toRows,
}: {
  useProfile: (handle: string) => { data?: T; isLoading: boolean; isError: boolean; error?: Error | null };
  handle: string;
  emptyMessage: string;
  toSummary: (data: T) => ReactNode;
  toRows: (data: T) => Row[];
}) {
  const { data, isLoading, isError, error } = useProfile(handle);

  if (isLoading) return <PanelLoading />;
  if (isError || !data) return <PanelError message={error?.message ?? 'something went wrong'} />;

  const rows = toRows(data);

  return (
    <div>
      <div className="flex justify-end mb-1">{toSummary(data)}</div>
      {rows.length === 0 && <p className="text-0_8 text-ink/50">{emptyMessage}</p>}
      {rows.map((r) => (
        <a
          key={r.key}
          href={r.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-baseline justify-between gap-2 py-1.5 border-b border-g/10 last:border-b-0 hover:text-g"
        >
          <span className="text-0_8 truncate">{r.primary}</span>
          <span className="text-0_7 text-ink/40 whitespace-nowrap shrink-0">{r.secondary}</span>
        </a>
      ))}
    </div>
  );
}

export function PracticePopover({ profiles }: { profiles?: CodingProfiles }) {
  const platforms = ENABLED_PLATFORMS.filter((key) => profiles?.[key]);
  if (platforms.length === 0) return null;

  const tabs = platforms.map((key) => ({ key, label: PLATFORM_LABEL[key], handle: profiles![key]! }));

  return (
    <SidebarPopover
      label="practice"
      trailing={
        <div className="ml-auto flex gap-1">
          {platforms.map((key) => (
            <span key={key} className="font-mono text-[0.6rem] text-ink/45 border border-g/25 px-1 py-0.5">
              {PLATFORM_SHORT[key]}
            </span>
          ))}
        </div>
      }
      headerExtra={<div className={`${metaItalic} text-ink/40`}>refreshes hourly</div>}
    >
      <Tabs defaultValue={tabs[0].key} className="flex flex-col px-4 pb-4">
        <TabsList variant="line" className="mb-2 shrink-0">
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key} className="font-heading italic text-0_8">
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((t) => (
          <TabsContent
            key={t.key}
            value={t.key}
            className="flex-none h-96 overflow-y-auto overflow-x-hidden gz-scroll"
          >
            {t.key === 'leetcode' && (
              <PlatformPanel<LeetcodeProfile>
                useProfile={useLeetcodeProfile}
                handle={t.handle}
                emptyMessage="no recent accepted submissions found."
                toSummary={(p) => {
                  const total = p.solvedByDifficulty.reduce((sum, d) => sum + d.count, 0);
                  return (
                    <span className={`${metaItalic} text-ink/55 text-sm font-light`}>
                      {' '}showing 10 of <span className="font-medium text-md">{total}</span> solved
                    </span>
                  );
                }}
                toRows={(p) => p.recentSolved.map((s) => ({
                  key: s.url, href: s.url, primary: s.title, secondary: timeAgo(s.when * 1000),
                }))}
              />
            )}
            {t.key === 'codeforces' && (
              <PlatformPanel<CodeforcesProfile>
                useProfile={useCodeforcesProfile}
                handle={t.handle}
                emptyMessage="no recent AC submissions found."
                toSummary={(p) => (
                  <>
                    <span className="font-heading italic text-1_2 text-g">{p.rating ?? ''}</span>
                    <span className={`${metaItalic} text-ink/55`}>{p.rank ?? 'unrated'}</span>
                    {p.maxRating !== undefined && (
                      <span className={`${metaItalic} text-ink/40 ml-auto`}>max {p.maxRating}</span>
                    )}
                  </>
                )}
                toRows={(p) => p.recentSolved.map((s) => ({
                  key: s.url + s.when,
                  href: s.url,
                  primary: s.name,
                  secondary: `${s.rating ? `${s.rating} · ` : ''}${timeAgo(s.when * 1000)}`,
                }))}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </SidebarPopover>
  );
}
