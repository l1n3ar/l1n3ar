'use server';
import { execSync } from 'node:child_process';
import { z } from 'zod';
import { apiFetch } from '@/lib/api-client';

/** Resolves owner/slug for wherever this is running: Vercel's build env in production,
 *  or the local git remote in dev — same repo identity, discovered differently per environment. */
function getRepoOwnerAndSlug(): { owner: string; slug: string } | undefined {
  const vercelOwner = process.env.VERCEL_GIT_REPO_OWNER;
  const vercelSlug = process.env.VERCEL_GIT_REPO_SLUG;
  if (vercelOwner && vercelSlug) return { owner: vercelOwner, slug: vercelSlug };

  try {
    const remote = execSync('git config --get remote.origin.url', { cwd: process.cwd() }).toString().trim();
    const match = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    return match ? { owner: match[1], slug: match[2] } : undefined;
  } catch {
    return undefined;
  }
}

const releaseSchema = z.object({
  tag_name: z.string(),
  name: z.string().nullable(),
  html_url: z.string(),
  published_at: z.string(),
});

export type Release = { tag: string; name: string | null; url: string; publishedAt: string };
export type GetLatestReleaseResult =
  | { ok: true; release: Release }
  | { ok: false; error: string };

export async function getLatestRelease(): Promise<GetLatestReleaseResult> {
  const repo = getRepoOwnerAndSlug();
  if (!repo) {
    return { ok: false, error: 'repo owner/slug not available' };
  }
  const { owner, slug } = repo;

  const result = await apiFetch({
    url: `https://api.github.com/repos/${owner}/${slug}/releases/latest`,
    headers: { Accept: 'application/vnd.github+json' },
    schema: releaseSchema,
    errorMessage: (body, status) =>
      (body as { message?: string } | null)?.message ?? `GitHub API returned ${status}`,
  });

  if (!result.ok) return result;
  return {
    ok: true,
    release: {
      tag: result.data.tag_name,
      name: result.data.name,
      url: result.data.html_url,
      publishedAt: result.data.published_at,
    },
  };
}
