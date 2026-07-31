'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { getTheme, setTheme } from '@/lib/theme';
import { metaItalic } from '@/lib/typography';

export function ThemeToggle({ className }: { className?: string }) {
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
        render={<Button variant="ghost" size="icon" aria-label="toggle theme" onClick={toggle} className={className} />}
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </TooltipTrigger>
      <TooltipContent className={metaItalic}>toggle theme</TooltipContent>
    </Tooltip>
  );
}
