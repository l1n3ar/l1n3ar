'use client';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ICON_STROKE } from '@/components/v2/constants';
import { initials } from '@/components/v2/initials';
import { ProjectCard } from '@/components/v2/projects/project-card';
import { splitWho } from '@/components/v2/recommendations/recommendation-utils';
import { sectionHref } from '@/components/v2/section-routes';
import { useSite } from '@/components/v2/site-context';
import { keyedPastelChipStyle } from '@/lib/pastel';
import type { Project, Recommendation } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

const FEATURED_PROJECT_NAMES = ['l1n3ar', 'eiger', 'phoenix'];

export function Home({
  recommendation,
}: {
  recommendation?: Recommendation;
}) {
  const router = useRouter();
  const { projects } = useSite();

  const featured = FEATURED_PROJECT_NAMES
    .map((n) => projects.find((p) => p.name.toLowerCase().includes(n)))
    .filter((p): p is Project => Boolean(p));

  const recInfo = recommendation ? splitWho(recommendation.who) : null;
  const recChipStyle = recommendation ? keyedPastelChipStyle(recommendation.who) : undefined;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-lg lg:text-xl flex font-light items-center gap-2 flex-wrap">
          tech @ BARBRI <Separator orientation="vertical" className="h-4 hidden lg:inline bg-muted-foreground data-[orientation=vertical]:self-center" /> <span className='hidden lg:inline'>previously @ lega.ai (acquired by BARBRI)</span>
          {/* <Image src="/images/logos/barbri.png" alt="BARBRI" width={96} height={96} className="h-10 w-auto align-middle" /> */}
        </h1>
        <Button variant="link" onClick={() => router.push(sectionHref('work'))} className="h-auto px-0 lg:mt-2 gap-1 text-0_7 font-semibold">
          View work experience
          <ArrowRight className="size-icon-xs" strokeWidth={ICON_STROKE} />
        </Button>
      </div>

      <div>
        <div className="text-0_9 font-semibold mb-4">Featured projects</div>

        {featured.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {featured.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}

        <Button variant="link" onClick={() => router.push(sectionHref('projects'))} className="h-auto px-0 mt-4 gap-1 text-0_7 font-semibold">
          Browse projects
          <ArrowRight className="size-icon-xs" strokeWidth={ICON_STROKE} />
        </Button>
      </div>

      {recommendation && recInfo && (
        <div>
          <p className="text-0_8 leading-relaxed text-muted-foreground max-w-2xl">&quot;{recommendation.quote}&quot;</p>
          <div className="flex items-center gap-2.5 mt-4">
            <span
              className="pastel-chip size-icon-lg rounded-md flex items-center justify-center text-0_6 font-semibold shrink-0"
              style={recChipStyle}
            >
              {initials(recInfo.name)}
            </span>
            <span className="text-0_7 text-muted-foreground">
              {recInfo.name}
              {recInfo.role ? `, ${recInfo.role}` : ''}
            </span>
          </div>
          <Button variant="link" onClick={() => router.push(sectionHref('recommendations'))} className="h-auto px-0 mt-4 gap-1 text-0_7 font-semibold">
            View all recommendations
            <ArrowRight className="size-icon-xs" strokeWidth={ICON_STROKE} />
          </Button>
        </div>
      )}
    </div>
  );
}
