'use server';
import { z } from 'zod';
import { apiFetch } from '@/lib/api-client';
import type { ProjectRepo } from '@/lib/types';

const pullRequestSchema = z.object({
  number: z.number(),
  title: z.string(),
  html_url: z.string(),
  state: z.string(),
  merged_at: z.string().nullable(),
  created_at: z.string(),
  user: z.object({ login: z.string() }).nullable(),
});

export type GithubPrStatus = 'open' | 'merged' | 'closed';

export type GithubPullRequest = {
  number: number;
  title: string;
  url: string;
  status: GithubPrStatus;
  createdAt: string;
  author: string | null;
  repoLabel: string;
  repoName : string;
};

export type GetGithubPullRequestsResult =
  | { ok: true; pullRequests: GithubPullRequest[] }
  | { ok: false; error: string };

async function getRepoPullRequests(repo: Pick<ProjectRepo, 'label' | 'owner' | 'repo'>) {
  const token = process.env.GITHUB_TOKEN;
  return apiFetch({
    url: `https://api.github.com/repos/${repo.owner}/${repo.repo}/pulls?state=all&per_page=10`,
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    schema: z.array(pullRequestSchema),
    errorMessage: (body, status) =>
      (body as { message?: string } | null)?.message ?? `GitHub API returned ${status}`,
  });
}

export async function getGithubPullRequests(repos: ProjectRepo[]): Promise<GetGithubPullRequestsResult> {
  const results = await Promise.all(
    repos.map(async (repo) => ({ repo, result: await getRepoPullRequests(repo) })),
  );

  const failures = results.filter((r) => !r.result.ok);
  if (failures.length === results.length) {
    const first = failures[0]?.result;
    return { ok: false, error: !first?.ok ? first.error : 'Could not reach GitHub' };
  }

  const pullRequests = results
    .filter((r) => r.result.ok)
    .flatMap(({ repo, result }) =>
      (result.ok ? result.data : []).map((pr) => ({
        number: pr.number,
        title: pr.title,
        url: pr.html_url,
        status: (pr.state === 'open' ? 'open' : pr.merged_at ? 'merged' : 'closed') as GithubPrStatus,
        createdAt: pr.created_at,
        author: pr.user?.login ?? null,
        repoLabel: repo.label,
        repoName : repo.repo
      })),
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return { ok: true, pullRequests };
}
