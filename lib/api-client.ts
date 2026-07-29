import axios from 'axios';
import type { ZodType, ZodTypeDef } from 'zod';

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function apiFetch<T>(options: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  // Input left as `any` (not tied to T) so schemas built with z.preprocess —
  // whose input type legitimately differs from their output type T — still infer T correctly.
  schema: ZodType<T, ZodTypeDef, any>;
  errorMessage?: (body: unknown, status: number) => string;
}): Promise<ApiResult<T>> {
  const method = options.method ?? 'GET';
  console.log(`[api] → ${method} ${options.url}`);

  try {
    const response = await axios.request({
      url: options.url,
      method,
      headers: options.headers,
      data: options.body,
      validateStatus: () => true,
    });

    console.log(`[api] ← ${response.status} ${method} ${options.url}`);

    if (response.status < 200 || response.status >= 300) {
      const message = options.errorMessage?.(response.data, response.status) ?? `Request failed with status ${response.status}`;
      console.error(`[api] ✗ ${method} ${options.url} — ${message}`);
      return { ok: false, error: message };
    }

    const parsed = options.schema.safeParse(response.data);
    if (!parsed.success) {
      console.error(`[api] ✗ ${method} ${options.url} — unexpected response shape`);
      return { ok: false, error: 'Unexpected response shape' };
    }
    return { ok: true, data: parsed.data };
  } catch (err) {
    let hostname = options.url;
    try {
      hostname = new URL(options.url).hostname;
    } catch {
      // leave hostname as the raw url
    }
    console.error(`[api] ✗ ${method} ${options.url} — could not reach ${hostname}`, err);
    return { ok: false, error: `Could not reach ${hostname}` };
  }
}
