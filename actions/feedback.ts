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
