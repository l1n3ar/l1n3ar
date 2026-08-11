'use client';
import { useMemo, useState } from 'react';
import { SiGithub } from '@icons-pack/react-simple-icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useGithubContributions } from '@/hooks/coding';
import { heatLevelStyle } from '@/lib/pastel';

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const FIRST_YEAR = 2022;
const HEAT_HUE = 142;

type GridDay = { date: string; count: number; inRange: boolean };

function startOfWeek(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d;
}

function weeksInFullYear(year: number): number {
  const gridStart = startOfWeek(new Date(Date.UTC(year, 0, 1)));
  const gridEnd = new Date(Date.UTC(year, 11, 31));
  gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - gridEnd.getUTCDay()));
  return Math.round((gridEnd.getTime() - gridStart.getTime()) / MS_PER_DAY / 7) + 1;
}

function buildWeeks(year: number, countsByDate: Map<string, number>, today: Date): GridDay[][] {
  const jan1 = new Date(Date.UTC(year, 0, 1));
  const isCurrentYear = year === today.getUTCFullYear();
  const rangeEnd = isCurrentYear ? today : new Date(Date.UTC(year, 11, 31));

  const gridStart = startOfWeek(jan1);
  const gridEnd = new Date(rangeEnd);
  gridEnd.setUTCDate(gridEnd.getUTCDate() + (6 - gridEnd.getUTCDay()));

  const weeks: GridDay[][] = [];
  let week: GridDay[] = [];
  for (let cursor = gridStart; cursor.getTime() <= gridEnd.getTime(); cursor = new Date(cursor.getTime() + MS_PER_DAY)) {
    const iso = cursor.toISOString().slice(0, 10);
    week.push({
      date: iso,
      count: countsByDate.get(iso) ?? 0,
      inRange: cursor.getUTCFullYear() === year && cursor.getTime() <= rangeEnd.getTime(),
    });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  return weeks;
}

function levelForCount(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}

export function GithubContributions({ usernames }: { usernames: string[] }) {
  const today = useMemo(() => new Date(), []);
  const currentYear = today.getUTCFullYear();
  const [year, setYear] = useState(currentYear);
  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = currentYear; y >= FIRST_YEAR; y--) list.push(y);
    return list;
  }, [currentYear]);
  const maxWeeks = useMemo(() => Math.max(...years.map(weeksInFullYear)), [years]);

  const { data, isLoading, isError } = useGithubContributions(usernames, year);

  const weeks = useMemo(() => {
    const countsByDate = new Map((data?.days ?? []).map((d) => [d.date, d.count]));
    return buildWeeks(year, countsByDate, today);
  }, [data, year, today]);

  if (usernames.length === 0) return null;

  return (
    <div className="hidden sm:block border border-border rounded-lg p-3 bg-card mb-2.5">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-1.5 text-0_8 font-semibold">
          <SiGithub className="size-icon-sm" />
          GitHub
        </div>
        <span className="text-0_6 text-muted-foreground">
          {isLoading ? '—' : isError ? "couldn't load GitHub activity." : `${data?.total ?? 0} contributions in ${year}`}
        </span>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col gap-2 shrink-0">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={`text-0_6 text-left px-1.5 py-0.5 rounded transition-colors ${
                y === year
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
        <div className="flex-1 border-l border-border pl-3 overflow-x-auto">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${maxWeeks}, minmax(0, 1fr))` }}>
            {weeks.map((week) => (
              <div key={week[0]?.date} className="grid gap-1">
                {week.map((day) => {
                  const level = levelForCount(day.count);
                  return day.inRange ? (
                    <Tooltip key={day.date}>
                      <TooltipTrigger>
                        <div
                          className={`aspect-square rounded-[2px] ${level === 0 ? 'bg-muted' : 'heat-cell'}`}
                          style={level === 0 ? undefined : heatLevelStyle(HEAT_HUE, level)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        {`${day.count} contribution${day.count === 1 ? '' : 's'} on ${formatDateLabel(day.date)}`}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div key={day.date} className="aspect-square" />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
