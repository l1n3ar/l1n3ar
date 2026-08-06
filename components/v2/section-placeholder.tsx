// Temporary stand-in for a section's real UI — replaced screen by screen in upcoming milestones.
export function SectionPlaceholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
      <div className="text-0_8 font-medium text-foreground mb-1">{title}</div>
      <p className="text-0_8">{note}</p>
    </div>
  );
}
