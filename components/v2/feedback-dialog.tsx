'use client';
import { useState, type FormEvent } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { submitFeedback } from '@/actions/feedback';
import { Loader2 } from 'lucide-react';

export function FeedbackDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setName('');
      setContent('');
      setError(null);
      setSent(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = await submitFeedback(name, content);
    setIsSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md rounded-lg font-sans not-italic">
        {
          !sent &&  <DialogTitle className="text-0_8 font-semibold">Send feedback</DialogTitle>
        }
       

        {sent ? (
          <p className="text-0_75 text-muted-foreground">Thank you, I always appreciate feedback!</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (optional)"
              className="text-0_75"
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell me what I can improve, bugs you've found or just leave a nice comment if you're feelin' like it!"
              required
              rows={5}
              className="text-0_75"
            />
            {error && <p className="text-0_7 text-destructive">{error}</p>}
            <Button type="submit" size="sm" disabled={isSubmitting || !content.trim()} className="self-end">
              {isSubmitting ? <Loader2 className='h-4 w-4 animate-spin'/> : 'Send'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
