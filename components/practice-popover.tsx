'use client';
import { Loader2 } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { kicker, metaItalic } from '@/lib/typography';
import { timeAgo } from '@/lib/deployment-meta';
import { useCodeforcesProfile, useLeetcodeProfile } from '@/lib/queries/coding';
import type { CodingProfiles } from '@/lib/schema';

const ENABLED_PLATFORMS = ['leetcode', 'codeforces'] as const;
const PLATFORM_SHORT: Record<string, string> = { leetcode: 'lc', codeforces: 'cf' };
const PLATFORM_LABEL: Record<string, string> = { leetcode: 'leetcode', codeforces: 'codeforces' };

function PanelLoading() {
  return (
    <div className="flex justify-center py-8">
      <Loader2 className="h-4 w-4 animate-spin text-g" />
    </div>
  );
}

function PanelError({ message }: { message: string }) {
  return <div className="text-0_8 text-destructive py-6 break-words">{message}</div>;
}

function CodeforcesPanel({ handle }: { handle: string }) {
  const { data: p, isLoading, isError, error } = useCodeforcesProfile(handle);

  if (isLoading) return <PanelLoading />;
  if (isError || !p) return <PanelError message={error?.message ?? 'something went wrong'} />;

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-g/20">
        <span className="font-heading italic text-1_2 text-g">{p.rating ?? '—'}</span>
        <span className={`${metaItalic} text-ink/55`}>{p.rank ?? 'unrated'}</span>
        {p.maxRating !== undefined && <span className={`${metaItalic} text-ink/40 ml-auto`}>max {p.maxRating}</span>}
      </div>
      {/* <div className={`${kicker} mb-2`}>recently solved</div> */}
      {p.recentSolved.length === 0 && <p className="text-0_8 text-ink/50">no recent AC submissions found.</p>}
      {p.recentSolved.map((s) => (
        <a
          key={s.url + s.when}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-baseline justify-between gap-2 py-1.5 border-b border-g/10 last:border-b-0 hover:text-g"
        >
          <span className="text-0_8 truncate">{s.name}</span>
          <span className="text-0_7 text-ink/40 whitespace-nowrap shrink-0">
            {s.rating ? `${s.rating} · ` : ''}
            {timeAgo(s.when * 1000)}
          </span>
        </a>
      ))}
    </div>
  );
}

function LeetcodePanel({ handle }: { handle: string }) {
  const { data: p, isLoading, isError, error } = useLeetcodeProfile(handle);

  if (isLoading) return <PanelLoading />;
  if (isError || !p) return <PanelError message={error?.message ?? 'something went wrong'} />;
  const total = p.solvedByDifficulty.reduce((sum, d) => sum + d.count, 0);

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-4 pb-3 border-b border-g/20">
        <span className="font-heading italic text-1_2 text-g">{total}</span>
        <span className={`${metaItalic} text-ink/55`}>solved</span>
        <div className="ml-auto flex gap-2">
          {p.solvedByDifficulty.map((d) => (
            <span key={d.difficulty} className="text-0_7 text-ink/45">
              {d.difficulty[0]}:{d.count}
            </span>
          ))}
        </div>
      </div>
      {/* <div className={`${kicker} mb-2`}>recently solved</div> */}
      {p.recentSolved.length === 0 && <p className="text-0_8 text-ink/50">no recent accepted submissions found.</p>}
      {p.recentSolved.map((s) => (
        <a
          key={s.url}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-baseline justify-between gap-2 py-1.5 border-b border-g/10 last:border-b-0 hover:text-g"
        >
          <span className="text-0_8 truncate">{s.title}</span>
          <span className="text-0_7 text-ink/40 whitespace-nowrap shrink-0">{timeAgo(s.when * 1000)}</span>
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
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="shrink-0 w-full flex items-center gap-2 px-6 py-2 border-t border-g hover:bg-g/5 transition-colors text-left"
          />
        }
      >
        <span className={kicker}>practice</span>
        <div className="ml-auto flex gap-1">
          {platforms.map((key) => (
            <span key={key} className="font-mono text-[0.6rem] text-ink/45 border border-g/25 px-1 py-0.5">
              {PLATFORM_SHORT[key]}
            </span>
          ))}
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="center"
        sideOffset={8}
        className="w-[22rem] max-h-[65vh] p-0 flex flex-col overflow-hidden"
      >
        <div className="px-4 pt-4 pb-2 shrink-0">
          <div className={kicker}>practice</div>
          <div className={`${metaItalic} text-ink/40`}>refreshes hourly</div>
        </div>

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
              {t.key === 'leetcode' && <LeetcodePanel handle={t.handle} />}
              {t.key === 'codeforces' && <CodeforcesPanel handle={t.handle} />}
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
