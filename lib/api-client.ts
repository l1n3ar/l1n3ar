import type { ZodType } from 'zod';

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function apiFetch<T>(url: string, options: {
  init?: RequestInit;
  schema: ZodType<T>;
  errorMessage?: (body: unknown, status: number) => string;
}): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(url, options.init);
  } catch {
    return { ok: false, error: `Could not reach ${new URL(url).hostname}` };
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = options.errorMessage?.(body, response.status) ?? `Request failed with status ${response.status}`;
    return { ok: false, error: message };
  }

  const parsed = options.schema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, error: 'Unexpected response shape' };
  }

  return { ok: true, data: parsed.data };
}
