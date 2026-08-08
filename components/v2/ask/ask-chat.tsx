'use client';
import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowUp, ChevronDown, CornerDownRight, X,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CitationsList } from '@/components/v2/ask/citations-list';
import { ICON_STROKE } from '@/components/v2/constants';
import { initials } from '@/components/v2/initials';
import { useSite } from '@/components/v2/site-context';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCitations } from '@/lib/citations';
import { keyedPastelChipStyle } from '@/lib/pastel';
import { cn } from '@/lib/utils';
import { Project } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const MOBILE_MAX_SUGGESTIONS = 3;

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

function OwnerAvatar({ initials }: { initials: string }) {
  return (
    <Avatar size="sm" className="shrink-0 rounded-md bg-primary after:rounded-md">
      <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-0_6">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export function AskChat({
  project, inputPosition = 'bottom', className, style, suggestions, onClose,
}: {
  project?: Project;
  suggestions?: string[];
  inputPosition?: 'bottom' | 'center';
  className?: string;
  style?: CSSProperties;
  onClose?: () => void;
}) {
  const { site } = useSite();
  const ownerInitials = initials(site.name);
  const isMobile = useIsMobile();
  const visibleSuggestions = project ? (isMobile ? project.asks.slice(0, MOBILE_MAX_SUGGESTIONS) : project.asks) : suggestions;
  const [placeholderSuggestion] = useState(() => (
    visibleSuggestions && visibleSuggestions.length > 0
      ? visibleSuggestions[Math.floor(Math.random() * visibleSuggestions.length)]
      : undefined
  ));
  const {
    messages, input, setInput, handleInputChange, append, setMessages, isLoading, error,
  } = useChat({ api: '/api/ask' });

  const hasMessages = messages.length > 0;
  const lastMessage = messages[messages.length - 1];
  const isWaitingForFirstToken = isLoading && lastMessage?.role !== 'assistant';
  const thinkingMessage = useThinkingMessage(isWaitingForFirstToken);

  const { scrollRef, showScrollButton, handleScroll, scrollToBottom, resetScroll } = useAutoScroll(messages);

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
  const spacer = centering && (
    <div className={`transition-[flex-grow] duration-500 ease-out ${hasMessages ? 'grow-0' : 'grow'}`} />
  );

  const suggestionChips = (
    <>
      {visibleSuggestions?.map((suggestion) => (
        <Button
          key={suggestion}
          type="button"
          variant="outline"
          onClick={() => ask(suggestion)}
          className="h-auto max-w-full bg-transparent whitespace-normal text-0_7 text-left justify-center px-3 py-2 rounded-lg self-start border-transparent transition-colors flex items-start"
        >
          <CornerDownRight />
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
        placeholder={placeholderSuggestion ?? 'Ask me about my work!'}
        disabled={isLoading}
        className="flex-1 min-w-0 h-auto border-none shadow-none px-0 bg-transparent text-0_7 focus-visible:ring-0"
      />
      <Button
        type="submit"
        size="icon-xs"
        disabled={isLoading || !input.trim()}
        aria-label="send"
        className="size-icon-xl rounded-sm bg-foreground text-background hover:bg-foreground/90 shrink-0"
      >
        <ArrowUp className="size-icon-xs" strokeWidth={ICON_STROKE} />
      </Button>
    </form>
  );

  return (
    <div className={cn('relative min-w-0 flex flex-col  rounded-lg p-4 lg:shadow-md', className)} style={style}>
      {onClose && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="close ask panel"
          onClick={onClose}
          className="absolute top-2 right-2 z-10"
        >
          <X className="size-icon-xs" strokeWidth={ICON_STROKE} />
        </Button>
      )}

      {project?.description && !hasMessages && isMobile && (
        <div className="text-0_6 text-muted-foreground tracking-wide mb-3 p-2 border border-dashed rounded-lg">{project.description}</div>
      )}

      {
        inputPosition === 'bottom' && !isMobile && 
        <>
        <span className='font-light text-xs mb-3'>Ask about <span className='font-semibold'>{project?.name}</span> </span>
        <Separator />
        </>
      }

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
                        {m.role === 'assistant' && <OwnerAvatar initials={ownerInitials} />}
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
                      <span className={`text-0_6 text-muted-foreground/70 ${m.role === 'assistant' ? 'ml-8' : 'mr-0.5'}`}>
                        {formatTimestamp(m.createdAt)}
                      </span>
                    </div>
                  );
                })}
                {isWaitingForFirstToken && (
                  <div className="flex items-center gap-2">
                    <OwnerAvatar initials={ownerInitials} />
                    <div className="text-0_8-static font-light text-muted-foreground px-1 animate-pulse">{thinkingMessage}</div>
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
          <div className="flex flex-col items-center gap-4 px-4 min-w-0 w-full">
            {inputForm}
            <div className="flex flex-wrap justify-center gap-2 max-w-lg min-w-0">
              {suggestionChips}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-2 justify-end min-w-0">
            {suggestionChips}
          </div>
        )}

        {spacer}
      </div>

      {!(centering && !hasMessages) && inputForm}
    </div>
  );
}
