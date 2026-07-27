'use client';
import { useChat } from 'ai/react';
import { useEffect, useRef } from 'react';

export function AskPanel({ suggestions, onProjectSelected }: { suggestions: string[]; onProjectSelected: (id: string) => void }) {
  const { messages, input, handleInputChange, handleSubmit, append, addToolResult } = useChat({ api: '/api/ask' });
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resultsRef.current?.scrollTo({ top: resultsRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className="flex-1 min-h-0 flex flex-col border-t border-g">
      <div className="px-8 pt-3.5 pb-2 flex items-baseline gap-2 shrink-0">
        <div className="font-heading italic text-[13.5px] text-g">ask about the work</div>
      </div>

      <div ref={resultsRef} className="flex-1 min-h-0 overflow-auto px-8 gz-scroll">
        {messages.length === 0 && (
          <div className="flex gap-2 flex-wrap pb-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => append({ role: 'user', content: s })}
                className="font-heading italic text-[12.5px] px-2.5 py-1 border border-g/40 rounded-sm bg-transparent text-g cursor-pointer hover:bg-g/10"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className="pb-3">
            {m.role === 'user' ? (
              <div className="font-heading italic text-[15px] font-semibold mb-1.5">{m.content}</div>
            ) : (
              <p className="text-[14.5px] leading-relaxed max-w-[60ch] m-0">{m.content}</p>
            )}

            {/* Human-in-the-loop gate: the openCase tool has no server-side
                execute(), so it pauses here awaiting a decision. */}
            {m.toolInvocations?.map((ti) =>
              ti.state === 'call' && ti.toolName === 'openCase' ? (
                <div key={ti.toolCallId} className="border border-g border-l-[3px] px-3 py-2 flex items-center gap-2.5 my-2 bg-g/8">
                  <span className="font-heading italic text-[12.5px] mr-auto">
                    open the &ldquo;{(ti.args as { projectId: string }).projectId}&rdquo; case?
                  </span>
                  <button
                    type="button"
                    className="text-[11px] px-2.5 py-1 border border-g text-g bg-transparent rounded-sm cursor-pointer"
                    onClick={() => {
                      const { projectId } = ti.args as { projectId: string };
                      onProjectSelected(projectId);
                      addToolResult({ toolCallId: ti.toolCallId, result: `approved: ${projectId} case opened` });
                    }}
                  >
                    approve
                  </button>
                  <button
                    type="button"
                    className="text-[11px] px-2.5 py-1 border border-ink/25 text-ink/55 bg-transparent rounded-sm cursor-pointer"
                    onClick={() => addToolResult({ toolCallId: ti.toolCallId, result: 'rejected by the human.' })}
                  >
                    reject
                  </button>
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="px-8 pt-2.5 pb-4 shrink-0">
        <div className="flex items-center gap-2.5 border border-g rounded-sm px-3.5 py-2 bg-cream">
          <span className="font-heading italic text-g shrink-0">?</span>
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="ask something…"
            className="flex-1 border-0 bg-transparent outline-none text-[13px]"
          />
          <button type="submit" aria-label="ask" className="bg-transparent border-0 cursor-pointer p-0 shrink-0 text-g">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
