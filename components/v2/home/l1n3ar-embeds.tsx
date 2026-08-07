import { MiniLeetCode } from '@/components/v2/home/mini-leetcode';

export function L1n3arEmbeds({ description, leetcodeHandle }: { description?: string; leetcodeHandle?: string }) {
  return (
    <div className="flex flex-col">
      {description && <p className="text-0_6 text-muted-foreground leading-snug">{description}</p>}
      <div className="mt-2 flex flex-col gap-2 min-h-0 overflow-y-auto gz-scroll">
        {leetcodeHandle && <MiniLeetCode handle={leetcodeHandle} />}
      </div>
    </div>
  );
}
