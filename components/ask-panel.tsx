'use client';
import { useChat } from 'ai/react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionHeader } from './section-header';
import { kicker } from '@/lib/typography';

export function AskPanel({
  projectName, suggestions, open, onToggleOpen, collapsible = true,
}: {
  projectName: string; suggestions: string[]; open: boolean; onToggleOpen: () => void;
  collapsible?: boolean;
}) {
  const { input, handleInputChange, handleSubmit } = useChat({ api: '/api/ask' });

  return (
    <>
      <div className="px-6 pt-3.5 pb-2 border-t border-g">
        {collapsible ? (
          <SectionHeader
            label={<>ask about <span className="underline font-bold">{projectName}</span></>}
            open={open}
            onToggle={onToggleOpen}
          />
        ) : (
          <div className={kicker}>ask about <span className="underline font-bold">{projectName}</span></div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden flex flex-col" inert={!open}>
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
          <div className="font-heading italic text-1_1 text-g">coming soon</div>
          <p className="text-0_8 text-ink/55 max-w-[34ch] leading-snug">
            a live assistant that can answer questions about my work :)
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {suggestions.map((s) => (
              <Button key={s} variant="outline" className="font-heading italic text-0_8 px-2.5 py-1 border-g/40">
                {s}
              </Button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pt-2.5 pb-4 shrink-0 opacity-40">
          <div className="flex items-center gap-2.5 rounded-sm px-3.5 py-2 bg-g">
            <span className="font-heading italic text-cream/70 shrink-0">?</span>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="ask something…"
              className="flex-1 border-0 p-0 h-auto text-0_8 text-cream placeholder:text-cream/50"
              disabled
            />
            <Button type="submit" variant="ghost" size="icon" aria-label="ask" className="text-cream hover:text-cream/80 hover:bg-transparent">
              <Send className="h-[1.1rem] w-[1.1rem]" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
