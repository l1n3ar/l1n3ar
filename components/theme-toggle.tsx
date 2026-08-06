'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { getTheme, setTheme } from '@/lib/theme';
import { metaItalic } from '@/lib/typography';

export function ThemeToggle({
  className, size = 'icon', iconClassName = 'h-4 w-4', strokeWidth, tooltipClassName = metaItalic,
}: {
  className?: string; size?: 'icon' | 'icon-sm'; iconClassName?: string; strokeWidth?: number;
  tooltipClassName?: string;
}) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(getTheme() === 'dark');
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    setTheme(next ? 'dark' : 'light');
  };

  if (dark === null) return <div className={className} aria-hidden />;

  return (
    <Tooltip>
      <TooltipTrigger
        render={<Button variant="ghost" size={size} aria-label="toggle theme" onClick={toggle} className={className} />}
      >
        {dark
          ? <Sun className={iconClassName} strokeWidth={strokeWidth} />
          : <Moon className={iconClassName} strokeWidth={strokeWidth} />}
      </TooltipTrigger>
      <TooltipContent className={tooltipClassName}>toggle theme</TooltipContent>
    </Tooltip>
  );
}
