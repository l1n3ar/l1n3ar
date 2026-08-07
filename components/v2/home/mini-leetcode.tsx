import { Code2 } from 'lucide-react';
import { ICON_STROKE } from '@/components/v2/constants';
import { totalSolved, useLeetcodeProfile } from '@/hooks/coding';
import { pastelChipStyle } from '@/lib/pastel';

const LEETCODE_HUE = 55;

export function MiniLeetCode({ handle }: { handle: string }) {
  const { data, isLoading, isError } = useLeetcodeProfile(handle);

  return (
    <div className="flex items-center gap-2 border border-border mt-2 rounded-lg p-2 bg-card">
      <div
        className="pastel-chip size-icon-md rounded-md flex items-center justify-center shrink-0"
        style={pastelChipStyle(LEETCODE_HUE)}
      >
        <Code2 className="size-icon-xs" strokeWidth={ICON_STROKE} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-0_6 font-semibold truncate">LeetCode</div>
        <div className="text-0_6 text-muted-foreground truncate">{handle}</div>
      </div>
      <span className="text-0_9 font-semibold shrink-0">
        {isLoading || isError ? '—' : totalSolved(data?.solvedByDifficulty)}
      </span>
    </div>
  );
}
