import { Loader2 } from 'lucide-react';
import { ICON_STROKE } from '@/components/v2/constants';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center py-10">
      <Loader2 className="size-icon-sm animate-spin text-muted-foreground" strokeWidth={ICON_STROKE} />
    </div>
  );
}

export function ErrorMessage({ error }: { error?: { message?: string } | null }) {
  return <p className="text-0_8 text-destructive">{error?.message ?? 'something went wrong.'}</p>;
}
