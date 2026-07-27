'use client';
import { useRef, useState } from 'react';
import { Masthead } from './Masthead';
import { Sidebar } from './Sidebar';
import { WorkLog } from './WorkLog';
import { AskPanel } from './AskPanel';
import { ContextPanel } from './ContextPanel';
import { CaseDialog, type CaseDialogHandle } from './CaseDialog';
import { IndexDialog, type IndexDialogHandle } from './IndexDialog';
import type { Project, WorkHistoryEntry, Recommendation, TechIconMap, SiteConfig } from '@/lib/schema';

// This is the one piece of real interactive plumbing the design needs:
// which project is selected, and which dialogs are open. The AI
// retrieval/streaming and the approve-reject gate live in AskPanel, wired
// to /api/ask via the Vercel AI SDK.
export function PortfolioApp({
  site, workHistory, recommendations, projects, iconMap,
}: {
  site: SiteConfig; workHistory: WorkHistoryEntry[]; recommendations: Recommendation[];
  projects: Project[]; iconMap: TechIconMap;
}) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id);
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  const caseDialogRef = useRef<CaseDialogHandle>(null);
  const indexDialogRef = useRef<IndexDialogHandle>(null);

  return (
    <div className="h-screen flex flex-col bg-cream text-ink font-body">
      <Masthead site={site} />

      <div className="grid flex-1 min-h-0" style={{ gridTemplateColumns: '300px 1fr 300px' }}>
        <Sidebar about={site.about} history={workHistory} recs={recommendations} />

        <div className="flex flex-col min-h-0 border-r border-g">
          <WorkLog projects={projects} onSelect={setSelectedId} onOpenIndex={() => indexDialogRef.current?.open()} />
          <AskPanel suggestions={selected.asks} onProjectSelected={setSelectedId} />
        </div>

        <ContextPanel project={selected} iconMap={iconMap} onOpenCase={(id) => caseDialogRef.current?.open(id)} />
      </div>

      <div className="bg-g text-cream px-10 py-3 flex items-baseline gap-6">
        {site.footerLinks.map((l) => (
          <a key={l.label} href={l.href} className="font-heading italic text-[12.5px] text-cream/90 hover:text-cream">
            {l.label}
          </a>
        ))}
        <span className="ml-auto font-heading italic text-xs text-cream/65">{site.location}</span>
      </div>

      <CaseDialog ref={caseDialogRef} projects={projects} />
      <IndexDialog ref={indexDialogRef} projects={projects} onSelect={setSelectedId} />
    </div>
  );
}
