// v2 build in progress — replaced piece by piece across the v2-redesign branch. Old site lives at /v1.
export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center text-center">
      <div>
        <div className="text-lg font-medium">v2 — under construction</div>
        <p className="text-sm text-muted-foreground mt-1">
          in the meantime, the old site is at <a href="/v1" className="underline">/v1</a>.
        </p>
      </div>
    </div>
  );
}
