'use client';
import { useState } from 'react';
import { Check, Copy, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CopyButton({
  text, className, label = 'copy', icon: Icon = Copy,
}: { text: string | (() => string); className?: string; label?: string; icon?: LucideIcon }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const value = typeof text === 'function' ? text() : text;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={copied ? 'copied' : label}
      onClick={handleCopy}
      className={cn('flex-shrink-0', className)}
    >
      {copied ? <Check className="h-2 w-2" /> : <Icon className="h-2 w-2" />}
    </Button>
  );
}
