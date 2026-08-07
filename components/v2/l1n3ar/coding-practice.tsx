import { Code2 } from 'lucide-react';
import { ICON_STROKE } from '@/components/v2/constants';
import { totalSolved, useCodeforcesProfile, useLeetcodeProfile } from '@/hooks/coding';
import { timeAgo } from '@/lib/deployment-meta';
import { pastelChipStyle } from '@/lib/pastel';
import type { CodingProfiles } from '@/lib/types';
import type { CodeforcesProfile } from '@/actions/codeforces';
import type { LeetcodeProfile } from '@/actions/leetcode';

const LEETCODE_HUE = 55;
const CODEFORCES_HUE = 250;

function StatCardShell({ hue, label, handle, value, children }: {
  hue: number; label: string; handle: string; value: React.ReactNode; children?: React.ReactNode;
}) {
  const chipStyle = pastelChipStyle(hue);
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-start gap-2.5 mb-3.5">
        <div className="pastel-chip size-icon-lg rounded-lg flex items-center justify-center shrink-0" style={chipStyle}>
          <Code2 className="size-icon-sm" strokeWidth={ICON_STROKE} />
        </div>
        <div className="min-w-0">
          <div className="text-0_8 font-semibold">{label}</div>
          <div className="text-0_6 text-muted-foreground truncate">{handle}</div>
        </div>
        <span className="ml-auto text-1_2 font-semibold shrink-0">{value}</span>
      </div>
      {children}
    </div>
  );
}

function DifficultyBar({ solvedByDifficulty }: { solvedByDifficulty: { difficulty: string; count: number }[] }) {
  const easy = solvedByDifficulty.find((d) => d.difficulty === 'Easy')?.count ?? 0;
  const medium = solvedByDifficulty.find((d) => d.difficulty === 'Medium')?.count ?? 0;
  const hard = solvedByDifficulty.find((d) => d.difficulty === 'Hard')?.count ?? 0;
  const total = easy + medium + hard || 1;

  return (
    <div>
      <div className="flex h-1.5 rounded-full overflow-hidden mb-2.5">
        <div className="bg-green-300 dark:bg-green-800" style={{ width: `${(easy / total) * 100}%` }} />
        <div className="bg-yellow-300 dark:bg-yellow-800" style={{ width: `${(medium / total) * 100}%` }} />
        <div className="bg-red-300 dark:bg-red-800" style={{ width: `${(hard / total) * 100}%` }} />
      </div>
    </div>
  );
}

type ActivityRow = { key: string; title: string; href: string; when: number };

function RecentActivity({ rows }: { rows: ActivityRow[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="border border-border rounded-lg overflow-hidden mt-2.5">
      <div className="text-0_6 font-semibold text-muted-foreground uppercase tracking-wide px-3 py-2 bg-muted">
        Recent activity
      </div>
      {rows.map((r) => (
        <a
          key={r.key}
          href={r.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border text-0_7 text-foreground/85 hover:bg-muted/50"
        >
          <span className="flex-1 min-w-0 truncate">{r.title}</span>
          <span className="text-0_6 text-muted-foreground shrink-0">{timeAgo(r.when * 1000)}</span>
        </a>
      ))}
    </div>
  );
}

export function CodingPractice({ profiles }: { profiles?: CodingProfiles }) {
  const leetcode = useLeetcodeProfile(profiles?.leetcode ?? '');
  const codeforces = useCodeforcesProfile(profiles?.codeforces ?? '');

  if (!profiles?.leetcode && !profiles?.codeforces) {
    return <p className="text-0_7 text-muted-foreground">No coding profiles configured.</p>;
  }

  const lc: LeetcodeProfile | undefined = leetcode.isError ? undefined : leetcode.data;
  const cf: CodeforcesProfile | undefined = codeforces.isError ? undefined : codeforces.data;

  const rows: ActivityRow[] = [
    ...(lc?.recentSolved.map((s) => ({ key: s.url, title: s.title, href: s.url, when: s.when })) ?? []),
    ...(cf?.recentSolved.map((s) => ({ key: `${s.url}${s.when}`, title: s.name, href: s.url, when: s.when })) ?? []),
  ].sort((a, b) => b.when - a.when).slice(0, 8);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {profiles.leetcode && (
          <StatCardShell
            hue={LEETCODE_HUE}
            label="LeetCode"
            handle={profiles.leetcode}
            value={leetcode.isLoading || leetcode.isError ? '—' : totalSolved(lc?.solvedByDifficulty)}
          >
            {leetcode.isError && <p className="text-0_6 text-destructive">couldn&apos;t load LeetCode stats.</p>}
            {lc && !leetcode.isError && <DifficultyBar solvedByDifficulty={lc.solvedByDifficulty} />}
          </StatCardShell>
        )}
        {profiles.codeforces && (
          <StatCardShell
            hue={CODEFORCES_HUE}
            label="Codeforces"
            handle={profiles.codeforces}
            value={codeforces.isLoading ? '—' : codeforces.isError ? '—' : cf?.rating ?? '—'}
          >
            {codeforces.isError && <p className="text-0_6 text-destructive">couldn&apos;t load Codeforces stats.</p>}
            {cf && !codeforces.isError && (
              <p className="text-0_7 ml-8 text-muted-foreground">
                {cf.rank ?? 'unrated'}
                {cf.maxRating !== undefined && ` · max ${cf.maxRating}`}
              </p>
            )}
          </StatCardShell>
        )}
      </div>

      <RecentActivity rows={rows} />
    </div>
  );
}
