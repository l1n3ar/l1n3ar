import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PanelLoading({ className }: { className?: string }) {
  return (
    <div className={cn('flex justify-center py-8', className)}>
      <Loader2 className="h-4 w-4 animate-spin text-g" />
    </div>
  );
}

export function PanelError({ message, className }: { message: string; className?: string }) {
  return <div className={cn('text-0_8 text-destructive py-6 break-words', className)}>{message}</div>;
}
