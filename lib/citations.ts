import type { Message } from 'ai/react';

export type Citation = { source: string; label: string; score: number };

export function getCitations(message: Message): Citation[] {
  const annotation = message.annotations?.find(
    (a): a is { citations: Citation[] } =>
      typeof a === 'object' && a !== null && 'citations' in a,
  );
  return annotation?.citations ?? [];
}
