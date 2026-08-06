'use client';
import { useState, type FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAskedQuestions, type AskedQuestion } from '@/actions/logs';
import { timeAgo } from '@/lib/deployment-meta';

export function QaLog() {
  const [password, setPassword] = useState('');
  const [questions, setQuestions] = useState<AskedQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const result = await getAskedQuestions(password);
    setIsLoading(false);
    if (result === null) {
      setError('Incorrect password.');
      return;
    }
    setQuestions(result);
  }

  if (questions === null) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-center px-4">
   
        <div className="text-0_8 font-semibold">Q&amp;A log is admin-only</div>

        <form onSubmit={handleSubmit} className="flex items-center gap-1.5 mt-1">
          <Input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-40 text-0_7"
          />
          <Button type="submit" size="sm" disabled={isLoading}>
            {isLoading ? 'Checking…' : 'Unlock'}
          </Button>
        </form>
        {error && <p className="text-0_7 text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-0_9 font-semibold mb-3.5">Q&amp;A log</h1>
      {questions.length === 0 ? (
        <p className="text-0_7 text-muted-foreground">No questions yet.</p>
      ) : (
        <div className="flex flex-col gap-3.5">
          {questions.map((q, i) => (
            <div key={i} className="border border-border rounded-lg p-3.5 bg-card">
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <span className="text-0_75 font-semibold">{q.question}</span>
                <span className="text-0_6 text-muted-foreground shrink-0">
                  {timeAgo(new Date(q.createdAt).getTime())}
                </span>
              </div>
              <div className="text-0_7 leading-relaxed text-muted-foreground [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_code]:font-mono [&_code]:text-0_6 [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{q.answer}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
