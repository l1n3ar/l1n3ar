import { useRouter } from 'next/navigation';
import { projectIcon } from '@/components/v2/projects/project-icons';
import { hueForKey, pastelChipStyle } from '@/lib/pastel';
import type { Project } from '@/lib/types';

const ICON_STROKE = 1.75;
const FEATURED_PROJECT_NAMES = ['phoenix', 'l1n3ar', 'eiger'];

export function FeaturedProjects({
  description, projects,
}: {
  description?: string; projects: Project[];
}) {
  const router = useRouter();
  const featured = FEATURED_PROJECT_NAMES
    .map((n) => projects.find((p) => p.name.toLowerCase().includes(n)))
    .filter((p): p is Project => Boolean(p));

  return (
    <div className="flex flex-col">
      {description && <p className="text-0_8 text-muted-foreground leading-snug mb-6 max-w-sm">{description}</p>}
      {featured.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="text-0_6 font-semibold text-muted-foreground uppercase ml-2">Featured</div>
          <div className="flex gap-2 flex-wrap">
            {featured.map((p) => {
              const Icon = projectIcon(p.id);
              const chipStyle = pastelChipStyle(hueForKey(p.id));
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/projects/${p.id}`);
                  }}
                  className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1.5 rounded-sm hover:bg-black/5 dark:hover:bg-white/10 text-0_7 font-medium transition-colors"
                >
                  <span
                    className="pastel-chip size-icon-md rounded-sm flex items-center justify-center shrink-0"
                    style={chipStyle}
                  >
                    <Icon className="size-icon-xs" strokeWidth={ICON_STROKE} />
                  </span>
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
