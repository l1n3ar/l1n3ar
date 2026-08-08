'use client';
import { useState, type FormEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PageBody } from '@/components/v2/page-body';
import { getAskedQuestions, type AskedQuestion } from '@/actions/logs';
import { getFeedback, type FeedbackEntry } from '@/actions/feedback';
import { timeAgo } from '@/lib/deployment-meta';

export default function QaLogPage() {
  const [password, setPassword] = useState('');
  const [questions, setQuestions] = useState<AskedQuestion[] | null>(null);
  const [feedback, setFeedback] = useState<FeedbackEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const [questionsResult, feedbackResult] = await Promise.all([
      getAskedQuestions(password),
      getFeedback(password),
    ]);
    setIsLoading(false);
    if (questionsResult === null || feedbackResult === null) {
      setError('Incorrect password.');
      return;
    }

    setQuestions(questionsResult);
    setFeedback(feedbackResult);
  }

  if (questions === null || feedback === null) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-4">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 mt-1">
          <Input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-40 text-0_7"
          />
          <Button type="submit" size="sm" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unlock'}
          </Button>
        </form>
        {error && <p className="text-0_7 text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <PageBody title="Admin" titleClassName="px-2">
      <Tabs defaultValue="questions" className="px-2">
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="questions" className="text-0_7">Questions</TabsTrigger>
          <TabsTrigger value="feedback" className="text-0_7">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          {feedback.length === 0 ? (
            <p className="text-0_7 text-muted-foreground">No feedback yet.</p>
          ) : (
            <div className="flex flex-col gap-3.5">
              {feedback.map((f, i) => (
                <div key={i} className="border border-border rounded-lg p-3.5 bg-card">
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <span className="flex-1 min-w-0 text-0_75 font-semibold">{f.name ?? 'Anonymous'}</span>
                    <span className="text-0_6 text-muted-foreground shrink-0">
                      {timeAgo(new Date(f.createdAt).getTime())}
                    </span>
                  </div>
                  <p className="text-0_7 leading-relaxed text-muted-foreground whitespace-pre-wrap">{f.content}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="questions">
          {questions.length === 0 ? (
            <p className="text-0_7 text-muted-foreground">No questions yet.</p>
          ) : (
            <div className="flex flex-col gap-3.5">
              {questions.map((q, i) => (
                <div key={i} className="border border-border rounded-lg p-3.5 bg-card">
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <span className="flex-1 min-w-0 text-0_75 font-semibold">{q.question}</span>
                    <span className="text-0_6 text-muted-foreground shrink-0">{q.ip}</span>
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
        </TabsContent>
      </Tabs>
    </PageBody>
  );
}
