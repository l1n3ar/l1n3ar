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

export type Deployment = z.infer<typeof deploymentSchema>;
export type GetDeploymentsResult =
  | { ok: true; deployments: Deployment[] }
  | { ok: false; error: string };

export async function getDeployments(limit = 5): Promise<GetDeploymentsResult> {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  if (!token) {
    return { ok: false, error: 'VERCEL_ACCESS_TOKEN is not set' };
  }

  const params = new URLSearchParams({ limit: String(limit),target : 'production' });

  const result = await apiFetch({
    url: `https://api.vercel.com/v6/deployments?${params}`,
    headers: { Authorization: `Bearer ${token}` },
    schema: z.object({ deployments: z.array(deploymentSchema) }),
    errorMessage: (body, status) =>
      (body as { error?: { message?: string } } | null)?.error?.message ?? `Vercel API returned ${status}`,
  });

  if (!result.ok) return result;
  return { ok: true, deployments: result.data.deployments };
}
