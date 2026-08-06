'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ExternalLink, Send } from 'lucide-react';
import { CaseStudyBody } from '@/components/v2/sections/case-study-body';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BRAND_ICONS } from '@/components/v2/tech-icons';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { useSplitResize } from '@/hooks/use-split-resize';
import { getCitations, type Citation } from '@/lib/citations';
import { hueForKey, pastelChipStyle, tilePastel } from '@/lib/pastel';
import { hasCaseStudy, type Project } from '@/lib/types';

const ICON_STROKE = 1.75;

// Cycled while waiting for the first token, so a slow answer doesn't just sit on "thinking…".
const THINKING_MESSAGES = [
  'thinking…',
  'reading through the case study…',
  'checking the details…',
  'putting an answer together…',
  'almost there…',
];

function useThinkingMessage(active: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setIndex((current) => {
        if (THINKING_MESSAGES.length <= 1) return current;
        let next = current;
        while (next === current) next = Math.floor(Math.random() * THINKING_MESSAGES.length);
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
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
    <div className="max-w-full   border-l-2 border-border pl-2 py-1 mb-4">
      <div className="flex items-center gap-2 text-[0.625rem] text-muted-foreground/70 uppercase tracking-wide px-1 pb-1 mb-1 border-b border-border">
        <span className="flex-1">source</span>
        <span className="w-14 shrink-0 text-right">confidence</span>
      </div>
      <div className="flex flex-col gap-0.5 max-h-24 overflow-y-auto thin-scroll">
        {citations.map((c) => {
          const pct = Math.round(c.score * 100);
          return (
            <div key={c.source} className="flex items-center gap-2 text-[0.625rem] text-muted-foreground px-1">
              <span className="truncate min-w-0 flex-1 capitalize">{c.label}</span>
              <Progress value={pct} className="w-10 shrink-0" indicatorClassName="bg-green-600 dark:bg-green-500" />
              <span className="text-muted-foreground/70 shrink-0 font-mono w-6 text-right">{pct}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProjectDetail({ project, siteName }: { project: Project; siteName: string }) {
  const { containerRef, leftPercent, startResize, onResizeMove, endResize } = useSplitResize();
  const accentColor = tilePastel(hueForKey(project.id)).fg;

  return (
    <div
      ref={containerRef}
      className="h-full min-h-0 flex"
      onPointerMove={onResizeMove}
      onPointerUp={endResize}
      onPointerCancel={endResize}
    >
      <div
        className="min-w-0 overflow-y-auto border border-border rounded-lg p-4 thin-scroll"
        style={{ width: `${leftPercent}%` }}
      >
        <h1 className="text-1_2 font-semibold mb-1">{project.name}</h1>
        <div className="text-0_7 text-muted-foreground mb-3.5">
          {project.org} · {project.year} · {project.role}
        </div>
        <p className="text-0_8 leading-relaxed mb-3.5">{project.description}</p>

             <div className="flex gap-1.5 flex-wrap mb-4">
          {project.tech.map((t) => (
            <span key={t} className="text-0_6 capitalize px-2 py-0.5 rounded-full bg-muted text-foreground">{t}</span>
          ))}
        </div>

        <div className="flex gap-1.5 flex-wrap mb-4">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-0_7 text-foreground px-2.5 py-1.5 rounded-md border border-border bg-card flex items-center gap-1.5"
            >
              <BRAND_ICONS.github className="size-icon-xs" color="currentColor" /> Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-0_7 text-foreground px-2.5 py-1.5 rounded-md border border-border bg-card flex items-center gap-1.5"
            >
              <ExternalLink className="size-icon-xs" strokeWidth={ICON_STROKE} /> View demo
            </a>
          )}
        </div>

   

        {hasCaseStudy(project) && (
          <div className="border-t border-border pt-4 overflow-y-auto">
            {/* <div className="w-10 h-[3px] rounded-full mb-4" style={{ backgroundColor: accentColor }} /> */}
            <CaseStudyBody body={project.body} />
          </div>
        )}
      </div>

      <div
        onPointerDown={startResize}
        className="w-2.5 shrink-0 cursor-col-resize flex items-center justify-center group"
      >
        <div className="w-px h-8 bg-muted-foreground/40 group-hover:bg-muted-foreground/50" />
      </div>

      <ProjectAskPanel project={project} width={100 - leftPercent} siteName={siteName} />
    </div>
  );
}

function ProjectAskPanel({ project, width, siteName }: { project: Project; width: number; siteName: string }) {
  const initials = siteName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const {
    messages, input, setInput, handleInputChange, append, setMessages, isLoading, error,
  } = useChat({ api: '/api/ask', body: { projectId: project.id, projectName: project.name } });

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

  return (
    <div
      className="min-w-0 shrink-0 flex flex-col border border-border rounded-lg p-4"
      style={{ width: `${width}%` }}
    >
      <div className="text-0_6 text-muted-foreground  tracking-wide mb-3">
        Ask about {project.name}
      </div>

      <div className="flex-1 min-h-0 min-w-0 flex flex-col mb-2.5">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col gap-2 justify-end">
            {project.asks.map((suggestion) => {
              const chipStyle = pastelChipStyle(hueForKey(suggestion));
              return (
                <Button
                  key={suggestion}
                  type="button"
                  variant="outline"
                  onClick={() => ask(suggestion)}
                  className="pastel-chip h-auto whitespace-normal text-0_7 text-left justify-start px-3 py-2 rounded-full self-start border-transparent"
                  style={chipStyle}
                >
                  {suggestion}
                </Button>
              );
            })}
          </div>
        ) : (
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
                    <div className="text-0_7 text-muted-foreground italic px-1">{thinkingMessage}</div>
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
        )}
      </div>

      <form onSubmit={onSubmit} className="flex items-center gap-1.5 border border-border rounded-lg px-2.5 py-2 bg-card">
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
    </div>
  );
}
