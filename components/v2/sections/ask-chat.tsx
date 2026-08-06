'use client';
import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSite } from '@/components/v2/site-context';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { getCitations, type Citation } from '@/lib/citations';
import { cn } from '@/lib/utils';

const ICON_STROKE = 1.75;

// Cycled while waiting for the first token, so a slow answer doesn't just sit on "thinking…".
const THINKING_MESSAGES = [
  'frobnicating',
  'zhuzhing the answer',
  'sploinking around',
  'discombobulating',
  'wibbling the data',
  'narfling the garthog',
  'gloopifying',
  'bamboozling the bits',
  'quazzling',
  'flibbertigibbeting',
  'spiffbuffing',
  'blorping',
];

function useThinkingMessage(active: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => {
      setIndex(Math.floor(Math.random() * THINKING_MESSAGES.length));
    }, 0);
    return () => clearTimeout(id);
  }, [active]);

  return THINKING_MESSAGES[index];
}

function formatTimestamp(date?: Date) {
  if (!date) return '';
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// Mirrors v1's citations-marker.tsx layout (source / confidence rows with a progress
// bar) at v2 scale/tokens — deliberately not v1's component, which is styled with
// v1-only classes (text-ink, border-g, italic) that don't resolve inside .v2.
function CitationsList({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;
  return (
    <div className="max-w-full ml-8 border-l-2 border-border pl-2 py-1 mb-4">
      <div className="flex items-center gap-2 text-[0.625rem] text-muted-foreground/70 uppercase tracking-wide px-1 pb-1 mb-1 border-b border-border">
        <span className="flex-1">source</span>
        <span className="w-14 shrink-0 text-right">confidence</span>
      </div>
      <div className="flex flex-col gap-0.5 max-h-24 overflow-y-auto thin-scroll">
        {citations.map((c) => {
          const pct = Math.round(c.score * 100);
          return (
            <div key={c.source} className="flex items-center gap-2 text-[0.65rem] text-muted-foreground px-1 font-light">
              <span className="truncate min-w-0 flex-1">{c.label}</span>
              <Progress value={pct} className="w-10 shrink-0" indicatorClassName="bg-green-700 dark:bg-green-500" />
              <span className="text-muted-foreground/70 shrink-0 font-mono w-6 text-right">{pct}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AskChat({
  suggestions, apiBody, title, inputPosition = 'bottom', className, style,
}: {
  suggestions: string[];
  apiBody?: Record<string, unknown>;
  title?: string;
  inputPosition?: 'bottom' | 'center';
  className?: string;
  style?: CSSProperties;
}) {
  const { site } = useSite();
  const initials = site.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const {
    messages, input, setInput, handleInputChange, append, setMessages, isLoading, error,
  } = useChat({ api: '/api/ask', body: apiBody });

  const hasMessages = messages.length > 0;
  const lastMessage = messages[messages.length - 1];
  const isWaitingForFirstToken = isLoading && lastMessage?.role !== 'assistant';
  const thinkingMessage = useThinkingMessage(isWaitingForFirstToken);

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

  const centering = inputPosition === 'center';
  // Grows to push the suggestions+input toward the vertical middle while the chat is
  // empty, then smoothly collapses to 0 on the first message so the input settles at
  // the bottom instead of jumping there — flex-grow is a plain number, so it animates.
  const spacer = centering && (
    <div className={`transition-[flex-grow] duration-500 ease-out ${hasMessages ? 'grow-0' : 'grow'}`} />
  );

  const suggestionChips = (
    <>
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          type="button"
          variant="outline"
          onClick={() => ask(suggestion)}
          className="bg-muted h-auto whitespace-normal text-0_7 text-left justify-start px-3 py-2 rounded-lg self-start border-transparent capitalize"
        >
          {suggestion}
        </Button>
      ))}
    </>
  );

  const inputForm = (
    <form
      onSubmit={onSubmit}
      className={cn(
        'flex items-center gap-1.5 border border-border rounded-lg px-2.5 py-2 bg-card',
        centering && 'w-full max-w-xl mx-auto',
      )}
    >
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder="ask something…"
        disabled={isLoading}
        className="flex-1 min-w-0 h-auto border-none shadow-none px-0 bg-transparent text-0_7 focus-visible:ring-0"
      />
      <Button
        type="submit"
        size="icon-xs"
        disabled={isLoading || !input.trim()}
        aria-label="send"
        className="size-icon-xl rounded-md bg-foreground text-background hover:bg-foreground/90 shrink-0"
      >
        <Send className="size-icon-xs" strokeWidth={ICON_STROKE} />
      </Button>
    </form>
  );

  return (
    <div className={cn('min-w-0 flex flex-col border border-border rounded-lg p-4', className)} style={style}>
      {title && (
        <div className="text-0_6 text-muted-foreground tracking-wide mb-3">{title}</div>
      )}

      <div className="flex-1 min-h-0 min-w-0 flex flex-col mb-2.5">
        {spacer}

        {hasMessages ? (
          <div className="relative flex-1 min-h-0 min-w-0">
            <ScrollArea
              viewportRef={scrollRef}
              onViewportScroll={handleScroll}
              className="h-full min-w-0"
            >
              <div className="flex flex-col gap-3 pr-2">
                {messages.map((m) => {
                  const citations = m.role === 'assistant' ? getCitations(m) : [];
                  return (
                    <div key={m.id} className={`min-w-0 w-full flex flex-col gap-1 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <CitationsList citations={citations} />
                      <div className={`min-w-0 max-w-full flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {m.role === 'assistant' && (
                          <Avatar size="sm" className="shrink-0 rounded-md bg-primary after:rounded-md">
                            <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-0_6">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`min-w-0 max-w-[85%] [overflow-wrap:anywhere] text-0_7 leading-relaxed rounded-lg px-3 py-2 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_strong]:font-semibold [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_code]:font-mono [&_code]:text-0_6 [&_code]:bg-background/50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded ${
                            m.role === 'user' ? 'bg-foreground text-background' : 'bg-muted/50'
                          }`}
                        >
                          {m.role === 'assistant' ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                          ) : (
                            m.content
                          )}
                        </div>
                      </div>
                      <span className={`text-0_6 text-muted-foreground/70 ${m.role === 'assistant' ? 'ml-9' : 'mr-0.5'}`}>
                        {formatTimestamp(m.createdAt)}
                      </span>
                    </div>
                  );
                })}
                {isWaitingForFirstToken && (
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" className="shrink-0 rounded-md bg-primary after:rounded-md">
                      <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-0_6">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-[0.8rem] font-light text-muted-foreground px-1 animate-pulse">{thinkingMessage}</div>
                  </div>
                )}
                {error && (
                  <div className="text-0_7 text-destructive italic px-1">
                    something went wrong — try again in a moment.
                  </div>
                )}
              </div>
            </ScrollArea>

            {showScrollButton && (
              <Button
                type="button"
                size="icon-sm"
                onClick={scrollToBottom}
                aria-label="scroll to latest message"
                className="absolute bottom-3 right-3 rounded-full shadow-md"
              >
                <ChevronDown className="size-icon-xs" strokeWidth={ICON_STROKE} />
              </Button>
            )}
          </div>
        ) : centering ? (
          <div className="flex flex-col items-center gap-4 px-4">
            {inputForm}
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
              {suggestionChips}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-2 justify-end">
            {suggestionChips}
          </div>
        )}

        {spacer}
      </div>

      {!(centering && !hasMessages) && inputForm}
    </div>
  );
}
