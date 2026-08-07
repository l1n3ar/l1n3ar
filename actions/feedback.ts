'use server';
import { neon } from '@neondatabase/serverless';
import { headers } from 'next/headers';

const sql = neon(process.env.DATABASE_URL!);

const MAX_CONTENT_LENGTH = 4000;
const MAX_NAME_LENGTH = 200;

export type SubmitFeedbackResult = { ok: true } | { ok: false; error: string };

export async function submitFeedback(name: string, content: string): Promise<SubmitFeedbackResult> {
  const trimmedContent = content.trim();
  if (!trimmedContent) return { ok: false, error: 'Feedback cannot be empty.' };
  if (trimmedContent.length > MAX_CONTENT_LENGTH) return { ok: false, error: 'Feedback is too long.' };

  const trimmedName = name.trim().slice(0, MAX_NAME_LENGTH);
  const forwardedFor = (await headers()).get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

  try {
    await sql`
      INSERT INTO feedback (name, content, ip)
      VALUES (${trimmedName || null}, ${trimmedContent}, ${ip})
    `;
    return { ok: true };
  } catch (error) {
    console.error('failed to save feedback', error);
    return { ok: false, error: 'Something went wrong — please try again.' };
  }
}

export type FeedbackEntry = {
  name: string | null;
  content: string;
  createdAt: string;
};

/** Returns null when the password doesn't match — callers should treat that as "not authorized", not "no data". */
export async function getFeedback(password: string): Promise<FeedbackEntry[] | null> {
  if (password !== process.env.QA_LOG_PASSWORD) return null;

  const rows = (await sql`
    SELECT name, content, created_at
    FROM feedback
    ORDER BY created_at DESC
    LIMIT 100
  `) as { name: string | null; content: string; created_at: string }[];

  return rows.map((r) => ({ name: r.name, content: r.content, createdAt: r.created_at }));
}
