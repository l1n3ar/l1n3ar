'use server';
import { z } from 'zod';

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

  const params = new URLSearchParams({ limit: String(limit) });

  let response: Response;
  try {
    response = await fetch(`https://api.vercel.com/v6/deployments?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
  } catch {
    return { ok: false, error: 'Could not reach the Vercel API' };
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = body?.error?.message ?? `Vercel API returned ${response.status}`;
    return { ok: false, error: message };
  }

  const parsed = z.object({ deployments: z.array(deploymentSchema) }).safeParse(body);
  if (!parsed.success) {
    return { ok: false, error: 'Unexpected response shape from the Vercel API' };
  }

  return { ok: true, deployments: parsed.data.deployments };
}
