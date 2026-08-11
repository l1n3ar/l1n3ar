'use server';
import { z } from 'zod';
import { apiFetch } from '@/lib/api-client';

const contributionDaySchema = z.object({
  date: z.string(),
  contributionCount: z.number(),
});

const contributionsResponseSchema = z.object({
  data: z
    .object({
      user: z
        .object({
          contributionsCollection: z.object({
            contributionCalendar: z.object({
              weeks: z.array(z.object({ contributionDays: z.array(contributionDaySchema) })),
            }),
          }),
        })
        .nullable(),
    })
    .nullable(),
  errors: z.array(z.object({ message: z.string() })).optional(),
});

const CONTRIBUTIONS_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export type GithubContributionDay = { date: string; count: number };

export type GetGithubContributionsResult =
  | { ok: true; days: GithubContributionDay[]; total: number }
  | { ok: false; error: string };

async function getUserContributions(login: string, from: string, to: string, token: string) {
  return apiFetch({
    url: 'https://api.github.com/graphql',
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: { query: CONTRIBUTIONS_QUERY, variables: { login, from, to } },
    schema: contributionsResponseSchema,
    errorMessage: (body, status) =>
      (body as { message?: string } | null)?.message ?? `GitHub API returned ${status}`,
  });
}

export async function getGithubContributions(usernames: string[], year: number): Promise<GetGithubContributionsResult> {
  if (usernames.length === 0) return { ok: false, error: 'No GitHub usernames configured' };

  const token = process.env.GITHUB_TOKEN;
  if (!token) return { ok: false, error: 'GITHUB_TOKEN is not configured' };

  const from = `${year}-01-01T00:00:00Z`;
  const yearEnd = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
  const now = new Date();
  const to = (yearEnd.getTime() > now.getTime() ? now : yearEnd).toISOString();

  const results = await Promise.all(usernames.map((login) => getUserContributions(login, from, to, token)));

  const failures = results.filter((r) => !r.ok);
  if (failures.length === results.length) {
    const first = failures[0];
    return { ok: false, error: !first?.ok ? first.error : 'Could not reach GitHub' };
  }

  const totals = new Map<string, number>();
  for (const result of results) {
    if (!result.ok || result.data.errors?.length) continue;
    const weeks = result.data.data?.user?.contributionsCollection.contributionCalendar.weeks ?? [];
    for (const week of weeks) {
      for (const day of week.contributionDays) {
        totals.set(day.date, (totals.get(day.date) ?? 0) + day.contributionCount);
      }
    }
  }

  const days = Array.from(totals.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const total = days.reduce((sum, d) => sum + d.count, 0);

  return { ok: true, days, total };
}
