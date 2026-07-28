'use client';
import { useRef, useState } from 'react';
import { Masthead } from './masthead';
import { Sidebar } from './sidebar';
import { WorkLog } from './work-log';
import { AskPanel } from './ask-panel';
import { ContextPanel } from './context-panel';
import { CaseDialog, type CaseDialogHandle } from './case-dialog';
import { MobileTabBar, type MobileTab } from './mobile-tab-bar';
import type { Project, WorkHistoryEntry, Recommendation, SiteConfig } from '@/lib/schema';

export function PortfolioApp({
  site, workHistory, recommendations, projects,
}: {
  site: SiteConfig; workHistory: WorkHistoryEntry[]; recommendations: Recommendation[];
  projects: Project[];
}) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id);
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [askOpen, setAskOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('projects');

  const caseDialogRef = useRef<CaseDialogHandle>(null);

  const selectOnMobile = (id: string) => {
    setSelectedId(id);
    setMobileTab('details');
  };

  return (
    <div className="h-screen-safe overflow-hidden flex flex-col bg-cream text-ink font-body">
      <Masthead site={site} />

      <div
        className={`hidden md:grid flex-1 min-h-0 transition-[grid-template-columns] duration-300 ${
          sidebarOpen ? 'grid-cols-layout' : 'grid-cols-[3rem_1fr_20%]'
        }`}
      >
        <Sidebar
          about={site.about}
          history={workHistory}
          recs={recommendations}
          open={sidebarOpen}
          onToggleOpen={() => setSidebarOpen((o) => !o)}
        />

        <div
          className={`grid min-h-0 min-w-0 border-r border-g transition-[grid-template-rows] duration-300 ease-in-out ${
            askOpen
              ? 'grid-rows-[auto_minmax(0,1.3fr)_auto_minmax(0,1fr)]'
              : 'grid-rows-[auto_minmax(0,1fr)_auto_minmax(0,0fr)]'
          }`}
        >
          <WorkLog projects={projects} selectedId={selectedId} onSelect={setSelectedId} />
          <AskPanel
            projectName={selected.name}
            suggestions={selected.asks}
            open={askOpen}
            onToggleOpen={() => setAskOpen((o) => !o)}
          />
        </div>

        <ContextPanel project={selected} onOpenCase={(id) => caseDialogRef.current?.open(id)} />
      </div>

      <div className="flex flex-col flex-1 min-h-0 md:hidden">
        <MobileTabBar active={mobileTab} onChange={setMobileTab} />

        {mobileTab === 'about' && (
          <div className="flex-1 min-h-0 flex flex-col">
            <Sidebar
              about={site.about}
              history={workHistory}
              recs={recommendations}
              open
              onToggleOpen={() => {}}
              collapsible={false}
            />
          </div>
        )}

        {mobileTab === 'projects' && (
          <div className="flex-1 min-h-0 flex flex-col">
            <WorkLog projects={projects} selectedId={selectedId} onSelect={selectOnMobile} />
          </div>
        )}

               {mobileTab === 'details' && (
          <ContextPanel project={selected} onOpenCase={(id) => caseDialogRef.current?.open(id)} />
        )}

        {mobileTab === 'ask' && (
          <div className="flex-1 min-h-0 flex flex-col">
            <AskPanel
              projectName={selected.name}
              suggestions={selected.asks}
              open
              onToggleOpen={() => {}}
              collapsible={false}
            />
          </div>
        )}

 
      </div>

      <div className="bg-g text-cream px-6 py-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 md:gap-6">
        {site.footerLinks.map((l) => (
          <a
            key={l.label}
            href={l.href}
            {...(l.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
            className="font-heading italic text-0_8 text-cream/90 hover:text-cream"
          >
            {l.label}
          </a>
        ))}
        <span className="ml-auto font-body text-xs text-cream/65">{site.alterEgo}</span>
      </div>

      <CaseDialog ref={caseDialogRef} />
    </div>
  );
}
