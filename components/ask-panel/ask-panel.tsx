'use client';
import type { FormEvent } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '../section-header';
import { CitationsMarker, getCitations } from './citations-marker';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { kicker } from '@/lib/typography';
import styles from './ask-panel.module.css';

function AssistantAvatar() {
  return <img src="/icon" alt="" className="h-5 w-5 rounded-sm shrink-0 mt-1" />;
}

export function AskPanel({
   suggestions, open, onToggleOpen, collapsible = true,
}: {
 suggestions: string[]; open: boolean; onToggleOpen: () => void;
  collapsible?: boolean;
}) {
  const { messages, input, setInput, handleInputChange, append, setMessages, isLoading, error } = useChat({ api: '/api/ask' });
  const lastMessage = messages[messages.length - 1];
  const isWaitingForFirstToken = isLoading && lastMessage?.role !== 'assistant';

  const { scrollRef, showScrollButton, handleScroll, scrollToBottom, resetScroll } = useAutoScroll(messages);

  // Each new question starts a fresh exchange rather than a running conversation —
  // the panel only ever shows the latest question and its answer.
  const ask = (content: string) => {
    if (!content.trim() || isLoading) return;
    setMessages([]);
    resetScroll();
    append({ role: 'user', content });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const content = input;
    setInput('');
    ask(content);
  };

  return (
    <>
      <div data-ask-panel-header className="px-6 py-2 pb-2 border-t border-g">
        {collapsible ? (
          <SectionHeader
            label={<>ask about my work</>}
            open={open}
            onToggle={onToggleOpen}
          />
        ) : (
          <div className={kicker}>ask about my work</div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="font-heading italic text-1_1 text-g">ask me anything</div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {suggestions.map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  className="font-heading italic text-0_8 px-2.5 py-1 border-g/40"
                  onClick={() => ask(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 relative">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="h-full overflow-y-auto gz-scroll px-6 py-4 flex flex-col gap-3"
            >
              {messages.map((m) => (
                <div key={m.id} className="flex flex-col gap-1">
                  {m.role === 'assistant' && getCitations(m).length > 0 && (
                    <CitationsMarker citations={getCitations(m)} />
                  )}
                  <div className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'assistant' && <AssistantAvatar />}
                    <div
                      className={`text-0_7 leading-snug max-w-[80%] rounded-sm px-3 py-2 ${
                        m.role === 'user' ? 'bg-g text-cream' : `${styles.markdownBody} text-ink`
                      }`}
                    >
                      {m.role === 'assistant' ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isWaitingForFirstToken && (
                <div className="flex gap-2 justify-start">
                  <AssistantAvatar />
                  <div className="text-0_7 text-ink/50 italic px-3 py-2">thinking…</div>
                </div>
              )}
              {error && (
                <div className="text-0_7 text-destructive/80 italic px-3 py-2">
                  something went wrong — try again in a moment.
                </div>
              )}
            </div>

            {showScrollButton && (
              <button
                type="button"
                onClick={scrollToBottom}
                aria-label="scroll to latest message"
                className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-g text-cream flex items-center justify-center shadow-md hover:bg-g/90"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        <form onSubmit={onSubmit} className="px-6 pt-2.5 pb-4 shrink-0">
          <div className="flex items-center gap-2.5 rounded-sm px-3.5 py-2 bg-g">
            <span className="font-heading italic text-cream/70 shrink-0">?</span>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="ask something…"
              className="flex-1 border-0 p-0 h-auto text-0_8 text-cream placeholder:text-cream/50"
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              aria-label="ask"
              className="text-cream hover:text-cream/80 hover:bg-transparent"
              disabled={isLoading}
            >
              <Send className="h-[1.1rem] w-[1.1rem]" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
