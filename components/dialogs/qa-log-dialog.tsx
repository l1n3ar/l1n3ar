'use client';
import { useState, type FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAskedQuestions, type AskedQuestion } from '@/actions/logs';
import { timeAgo } from '@/lib/deployment-meta';
import { dialogClose, kicker } from '@/lib/typography';
import markdownStyles from '@/components/ask-panel/ask-panel.module.css';

export function QaLogDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [password, setPassword] = useState('');
  const [questions, setQuestions] = useState<AskedQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setPassword('');
      setQuestions(null);
      setError(null);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const result = await getAskedQuestions(password);
    setIsLoading(false);
    if (result === null) {
      setError('incorrect password');
      return;
    }
    setQuestions(result);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] max-w-lg max-h-[70vh] overflow-hidden flex flex-col gap-3 p-6"
      >
        <DialogClose render={<Button variant="ghost" className={`absolute top-3 right-3 p-0 h-auto ${dialogClose}`} />}>
          close ×
        </DialogClose>

        {questions === null ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-2">
            <Input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
            {error && <div className="text-0_7 text-destructive">{error}</div>}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'checking…' : 'unlock'}
            </Button>
          </form>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto gz-scroll flex flex-col gap-4 pt-2">
            {questions.length === 0 && <div className="text-0_8 text-ink/55">no questions yet.</div>}
            {questions.map((q, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-3 bg-g/5 rounded-sm px-3 py-2">
                  <div className={kicker}>{q.question}</div>
                  <div className="shrink-0 text-0_6 text-ink/40 uppercase tracking-wide">{timeAgo(q.createdAt)}</div>
                </div>
                <div className={`text-0_75 leading-snug text-ink/80 px-1 ${markdownStyles.markdownBody}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{q.answer}</ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
