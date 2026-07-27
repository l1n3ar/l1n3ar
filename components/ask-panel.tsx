'use client';
import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { kicker } from '@/lib/typography';

export function AskPanel({ suggestions, onProjectSelected }: { suggestions: string[]; onProjectSelected: (id: string) => void }) {
  const { messages, input, handleInputChange, handleSubmit, append, addToolResult } = useChat({ api: '/api/ask' });
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resultsRef.current?.scrollTo({ top: resultsRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 flex flex-col border-t border-g">
      <div className="px-8 pt-3.5 pb-2 flex items-baseline gap-2 shrink-0">
        <div className={kicker}>ask about the work</div>
      </div>

      <div ref={resultsRef} className="flex-1 min-h-0 overflow-auto px-8 gz-scroll">
        {messages.length === 0 && (
          <div className="flex gap-2 flex-wrap pb-2">
            {suggestions.map((s) => (
              <Button
                key={s}
                variant="outline"
                className="text-0_8 px-2.5 py-1 border-g/40"
                onClick={() => append({ role: 'user', content: s })}
              >
                {s}
              </Button>
            ))}
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className="pb-3">
            {m.role === 'user' ? (
              <div className="font-heading italic text-0_9 font-semibold mb-1.5">{m.content}</div>
            ) : (
              <p className="text-0_9 leading-relaxed max-w-[60ch] m-0">{m.content}</p>
            )}

            {/* openCase has no server-side execute(), so the stream pauses
                here awaiting an approve/reject decision. */}
            {m.toolInvocations?.map((ti) =>
              ti.state === 'call' && ti.toolName === 'openCase' ? (
                <div key={ti.toolCallId} className="border border-g border-l-[0.2rem] px-3 py-2 flex items-center gap-2.5 my-2 bg-g/8">
                  <span className="font-heading italic text-0_8 mr-auto">
                    open the &ldquo;{(ti.args as { projectId: string }).projectId}&rdquo; case?
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const { projectId } = ti.args as { projectId: string };
                      onProjectSelected(projectId);
                      addToolResult({ toolCallId: ti.toolCallId, result: `approved: ${projectId} case opened` });
                    }}
                  >
                    approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-ink/25 text-ink/55 hover:bg-transparent"
                    onClick={() => addToolResult({ toolCallId: ti.toolCallId, result: 'rejected by the human.' })}
                  >
                    reject
                  </Button>
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="px-8 pt-2.5 pb-4 shrink-0">
        <div className="flex items-center gap-2.5 rounded-sm px-3.5 py-2 bg-g">
          <span className="font-heading italic text-cream/70 shrink-0">?</span>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="ask something…"
            className="flex-1 border-0 p-0 h-auto text-0_8 text-cream placeholder:text-cream/50"
          />
          <Button type="submit" variant="ghost" size="icon" aria-label="ask" className="text-cream hover:text-cream/80 hover:bg-transparent">
            <Send className="h-[1.1rem] w-[1.1rem]" />
          </Button>
        </div>
      </form>
    </div>
  );
}
