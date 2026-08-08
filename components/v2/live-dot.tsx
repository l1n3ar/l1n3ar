export function LiveDot({ className = 'shrink-0' }: { className?: string }) {
  return (
    <span className={`relative inline-flex size-1.5 ${className}`}>
      <span className="absolute inline-flex size-full rounded-full bg-green-600 dark:bg-green-500 opacity-60 animate-ping" />
      <span className="relative inline-flex size-1.5 rounded-full bg-green-600 dark:bg-green-500" />
    </span>
  );
}
