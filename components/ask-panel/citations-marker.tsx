'use client';
import { useState } from 'react';
import type { Message } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Marker, MarkerContent } from '@/components/ui/marker';

export type Citation = { source: string; label: string };

export function getCitations(message: Message): Citation[] {
  const annotation = message.annotations?.find(
    (a): a is { citations: Citation[] } =>
      typeof a === 'object' && a !== null && 'citations' in a,
  );
  return annotation?.citations ?? [];
}

export function CitationsMarker({ citations }: { citations: Citation[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="max-w-[80%] ml-7 rounded-sm py-1">
      <Button variant="ghost" onClick={() => setExpanded((e) => !e)} className="w-fit text-left" size="sm">
        <Marker className="text-0_6">
          <MarkerContent>
            reading {citations.length} source{citations.length === 1 ? '' : 's'}
          </MarkerContent>
        </Marker>
      </Button>
      {expanded && (
        <div className="flex flex-col gap-1 pt-1.5 max-h-28 pl-2 border-l-2 border-g overflow-y-auto gz-scroll">
          {citations.map((c) => (
            <span key={c.source} className="text-0_6 text-ink/50 italic rounded-sm px-1.5 py-0.5">
              {c.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
