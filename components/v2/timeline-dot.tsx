export function TimelineDot({ isLast, dotClassName = 'bg-foreground' }: { isLast: boolean; dotClassName?: string }) {
  return (
    <div className="flex flex-col items-center w-2.5 shrink-0">
      <span className={`size-dot rounded-full mt-1 shrink-0 ${dotClassName}`} />
      {!isLast && <span className="w-px flex-1 bg-foreground/25 mt-0.5" />}
    </div>
  );
}
