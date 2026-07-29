'use client';
import { useState } from 'react';
import { Check, Copy, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function CopyButton({
  text, className, label = 'copy', icon: Icon = Copy, tooltip,
}: {
  text: string | (() => string); className?: string; label?: string; icon?: LucideIcon; tooltip?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const value = typeof text === 'function' ? text() : text;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const icon = copied ? <Check className="h-2 w-2" /> : <Icon className="h-2 w-2" />;
  const buttonProps = {
    variant: 'ghost' as const,
    size: 'icon' as const,
    'aria-label': copied ? 'copied' : label,
    onClick: handleCopy,
    className: cn('flex-shrink-0', className),
  };

  if (!tooltip) return <Button {...buttonProps}>{icon}</Button>;

  return (
    <Tooltip>
      <TooltipTrigger render={<Button {...buttonProps} />}>{icon}</TooltipTrigger>
      <TooltipContent className="font-heading italic text-0_7">{copied ? 'copied' : tooltip}</TooltipContent>
    </Tooltip>
  );
}
