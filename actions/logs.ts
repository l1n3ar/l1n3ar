'use server'
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);


export const logQuestion = async (prompt: string, answer: string, citations: any, ip: string) => {
    try {
    await sql`
      INSERT INTO asked_questions (question, answer, citations, ip)
      VALUES (${prompt}, ${answer}, ${JSON.stringify(citations)}::jsonb, ${ip})
    `;
  } catch (error) {
    console.error('failed to log asked question', error);
  }
}

export type AskedQuestion = {
  question: string;
  answer: string;
  createdAt: string;
  ip : string;
};


export async function getAskedQuestions(password: string): Promise<AskedQuestion[] | null> {
  if (password !== process.env.QA_LOG_PASSWORD) return null;

  const rows = (await sql`
    SELECT question, answer, created_at,ip
    FROM asked_questions
    ORDER BY created_at DESC
    LIMIT 100
  `) as { question: string; answer: string; created_at: string,ip : string }[];

  return rows.map((r) => ({ question: r.question, answer: r.answer, createdAt: r.created_at,ip : r.ip }));
}