'use client';
import { useChat } from 'ai/react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionHeader } from './section-header';
import { kicker } from '@/lib/typography';

export function AskPanel({
   suggestions, open, onToggleOpen, collapsible = true,
}: {
 suggestions: string[]; open: boolean; onToggleOpen: () => void;
  collapsible?: boolean;
}) {
  const { messages, input, handleInputChange, handleSubmit, append, isLoading, error } = useChat({ api: '/api/ask' });

  return (
    <>
      <div className="px-6 py-2 pb-2 border-t border-g">
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

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col" inert={!open}>
        {messages.length === 0 ? (
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <div className="font-heading italic text-1_1 text-g">ask me anything</div>
            <p className="text-0_8 text-ink/55 max-w-[34ch] leading-snug">
              a live assistant that can answer questions about my work
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {suggestions.map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  className="font-heading italic text-0_8 px-2.5 py-1 border-g/40"
                  onClick={() => append({ role: 'user', content: s })}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 flex flex-col gap-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`text-0_8 leading-snug max-w-[85%] rounded-sm px-3 py-2 whitespace-pre-wrap ${
                  m.role === 'user' ? 'self-end bg-g text-cream' : 'self-start bg-g/10 text-ink'
                }`}
              >
                {m.content}
              </div>
            ))}
            {isLoading && (
              <div className="self-start text-0_8 text-ink/50 italic px-3 py-2">thinking…</div>
            )}
            {error && (
              <div className="self-start text-0_8 text-red-600/80 italic px-3 py-2">
                something went wrong — try again in a moment.
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 pt-2.5 pb-4 shrink-0">
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
