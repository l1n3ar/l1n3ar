'use server';
import { z } from 'zod';
import { apiFetch } from '@/lib/api-client';

const deploymentSchema = z.object({
  uid: z.string(),
  name: z.string(),
  url: z.string(),
  created: z.union([z.string(), z.number()]),
  state: z.string().optional(),
  target: z.string().nullable().optional(),
  inspectorUrl: z.string().optional(),
  meta: z.record(z.string()).optional(),
});

const paginationSchema = z.object({ count: z.number(), next: z.number().nullable().optional() });

export type Deployment = z.infer<typeof deploymentSchema>;
export type GetDeploymentsResult =
  | { ok: true; deployments: Deployment[]; nextCursor: number | null }
  | { ok: false; error: string };

/** `until` is a Vercel deployment `created` timestamp (ms) — pass the previous page's `nextCursor` to page backward through history. */
export async function getDeployments(limit = 10, until?: number): Promise<GetDeploymentsResult> {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  if (!token) {
    return { ok: false, error: 'VERCEL_ACCESS_TOKEN is not set' };
  }

  const params = new URLSearchParams({ limit: String(limit)});
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (projectId) params.set('projectId', projectId);
  const teamId = process.env.VERCEL_TEAM_ID;
  if (teamId) params.set('teamId', teamId);
  if (until) params.set('until', String(until));

  const result = await apiFetch({
    url: `https://api.vercel.com/v6/deployments?${params}`,
    headers: { Authorization: `Bearer ${token}` },
    schema: z.object({ deployments: z.array(deploymentSchema), pagination: paginationSchema.optional() }),
    errorMessage: (body, status) =>
      (body as { error?: { message?: string } } | null)?.error?.message ?? `Vercel API returned ${status}`,
  });

  if (!result.ok) return result;
  return {
    ok: true,
    deployments: result.data.deployments,
    nextCursor: result.data.pagination?.next ?? null,
  };
}
