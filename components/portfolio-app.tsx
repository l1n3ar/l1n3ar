'use client';
import { useRef, useState } from 'react';
import { Masthead } from './masthead';
import { Sidebar } from './sidebar';
import { WorkLog } from './work-log';
import { AskPanel } from './ask-panel';
import { ContextPanel } from './context-panel';
import { CaseDialog, type CaseDialogHandle } from './case-dialog';
import type { Project, WorkHistoryEntry, Recommendation, SiteConfig } from '@/lib/schema';

export function PortfolioApp({
  site, workHistory, recommendations, projects,
}: {
  site: SiteConfig; workHistory: WorkHistoryEntry[]; recommendations: Recommendation[];
  projects: Project[];
}) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id);
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  const caseDialogRef = useRef<CaseDialogHandle>(null);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-cream text-ink font-body">
      <Masthead site={site} />

      <div className="grid grid-cols-layout flex-1 min-h-0">
        <Sidebar about={site.about} history={workHistory} recs={recommendations} />

        <div className="flex flex-col min-h-0 min-w-0 border-r border-g">
          <WorkLog projects={projects} selectedId={selectedId} onSelect={setSelectedId} />
          <AskPanel suggestions={selected.asks} onProjectSelected={setSelectedId} />
        </div>

        <ContextPanel project={selected} onOpenCase={(id) => caseDialogRef.current?.open(id)} />
      </div>

      <div className="bg-g text-cream px-6 py-3 flex items-baseline gap-6">
        {site.footerLinks.map((l) => (
          <a key={l.label} href={l.href} className="font-heading italic text-0_8 text-cream/90 hover:text-cream">
            {l.label}
          </a>
        ))}
        <span className="ml-auto font-heading italic text-xs text-cream/65">{site.location}</span>
      </div>

      <CaseDialog ref={caseDialogRef} projects={projects} />
    </div>
  );
}
