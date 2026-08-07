'use client';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { getTheme, setTheme, THEME_CHANGE_EVENT } from '@/lib/theme';
import { metaItalic } from '@/lib/typography';

export function ThemeToggle({
  className, size = 'icon', iconClassName = 'h-4 w-4', strokeWidth, tooltipClassName = metaItalic,
}: {
  className?: string; size?: 'icon' | 'icon-sm'; iconClassName?: string; strokeWidth?: number;
  tooltipClassName?: string;
}) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    // Deliberately not a lazy useState initializer: that would run during SSR/hydration
    // too (no `document` there, or a value that mismatches the server-rendered `null`
    // placeholder below). Reading the real theme only after mount avoids a hydration
    // mismatch — this is a justified exception to the set-state-in-effect rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(getTheme() === 'dark');
    const onChange = () => setDark(getTheme() === 'dark');
    window.addEventListener(THEME_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
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
        render={<Button variant="ghost" size='icon-xs' aria-label="toggle theme" onClick={toggle} className={className} />}
      >
        {dark
          ? <Sun className={iconClassName} strokeWidth={strokeWidth} />
          : <Moon className={iconClassName} strokeWidth={strokeWidth} />}
      </TooltipTrigger>
      <TooltipContent className={tooltipClassName}>toggle theme</TooltipContent>
    </Tooltip>
  );
}
