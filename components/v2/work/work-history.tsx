'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ICON_STROKE } from '@/components/v2/constants';
import { PageBody } from '@/components/v2/page-body';
import { TimelineDot } from '@/components/v2/timeline-dot';
import { initials } from '@/components/v2/initials';
import { useIsMobile } from '@/hooks/use-mobile';
import { keyedPastelChipStyle } from '@/lib/pastel';
import { cn } from '@/lib/utils';
import type { WorkHistoryEntry } from '@/lib/types';

const LOGO_SIZE = 30;

function isCurrent(entry: WorkHistoryEntry): boolean {
  return /present|now/i.test(entry.range);
}

function groupById(entries: WorkHistoryEntry[]): WorkHistoryEntry[][] {
  const groups: WorkHistoryEntry[][] = [];
  for (const entry of entries) {
    const last = groups[groups.length - 1];
    if (last && last[0].id === entry.id) last.push(entry);
    else groups.push([entry]);
  }
  return groups;
}

function CompanyLogo({ id, org }: { id: string; org: string }) {
  const [failed, setFailed] = useState(false);
  const chipStyle = keyedPastelChipStyle(id);

  if (failed) {
    return (
      <div
        className="pastel-chip flex items-center justify-center text-0_7 font-semibold shrink-0 rounded-lg"
        style={{ ...chipStyle, width: LOGO_SIZE, height: LOGO_SIZE }}
      >
        {initials(org)}
      </div>
    );
  }

  return (
    <div>
      <Image
        src={`/images/logos/${id}.png`}
        alt={org}
        width={LOGO_SIZE}
        height={LOGO_SIZE}
        className="rounded-lg object-contain shrink-0"
        onError={() => setFailed(true)}
      />
    </div>

  );
}

function RoleEntry({ entry }: { entry: WorkHistoryEntry }) {
  return (
    <div>
      <div className="text-0_7 text-muted-foreground">{entry.role}</div>
      <div className="text-0_65 text-muted-foreground/70">{entry.range}</div>
      {entry.description && entry.description.length > 0 && (
        <p className="text-0_7 text-foreground/85 leading-relaxed mt-2">
          {entry.description.join('. ')}.
        </p>
      )}
    </div>
  );
}

function CompanyGroup({ group, isLast }: { group: WorkHistoryEntry[]; isLast: boolean }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(isMobile ? false : true);
  const { id, org } = group[0];
  const current = group.some(isCurrent);

  return (
    <div className="flex gap-3">
      <TimelineDot isLast={isLast} dotClassName={current ? 'bg-green-700' : 'bg-foreground'} />
      <div className="flex-1 min-w-0 pb-4 flex gap-3">
        <CompanyLogo id={id} org={org} />
        <div className="flex-1 min-w-0">
          <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-2 text-left">
            <span className="text-0_85 font-semibold">{org}</span>
            <ChevronDown
              className={cn('size-icon-xs text-muted-foreground shrink-0 transition-transform', open && 'rotate-180')}
              strokeWidth={ICON_STROKE}
            />
          </button>

          <div className={cn('grid transition-[grid-template-rows] duration-200 ease-out', open ? 'grid-rows-[1fr] ' : 'grid-rows-[0fr]')}>
            <div className="overflow-hidden">
              {group.length === 1 ? (
                <RoleEntry entry={group[0]} />
              ) : (
                <div className="flex flex-col gap-4">
                  {group.map((entry, i) => (
                    <div key={entry.role} className="flex gap-2.5">
                      <TimelineDot
                        isLast={i === group.length - 1}
                        dotClassName={isCurrent(entry) ? 'bg-green-700' : 'bg-foreground/60'}
                      />
                      <div className="flex-1 min-w-0 pb-1">
                        <RoleEntry entry={entry} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WorkHistory({
  entries, resumeHref,
}: {
  entries: WorkHistoryEntry[]; resumeHref?: string;
}) {
  const groups = groupById(entries);

  return (
    <PageBody
      title="Work experience"
      actions={resumeHref && (
        <Button
          variant='secondary'
          size="sm"
          render={<a href={resumeHref} target="_blank" rel="noopener noreferrer" />}
          className="gap-1.5 text-0_7 text-foreground"
        >
          <Download className="size-icon-xs" strokeWidth={ICON_STROKE} />
           Resume
        </Button>
      )}
    >
      <div className="p-4">
        {groups.map((group, i) => (
          <CompanyGroup key={group[0].id} group={group} isLast={i === groups.length - 1} />
        ))}
      </div>
    </PageBody>
  );
}
