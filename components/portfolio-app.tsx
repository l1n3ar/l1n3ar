'use client';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Masthead } from './masthead';
import { Sidebar } from './sidebar';
import { WorkLog } from './work-log';
import { AskPanel } from './ask-panel';
import { ContextPanel } from './context-panel';
import { CaseDialog, type CaseDialogHandle } from './case-dialog';
import { SiuTakeover, type SiuTakeoverHandle } from './siu-takeover';
import { MobileTabBar, type MobileTab } from './mobile-tab-bar';
import { CommandPalette } from './command-palette';
import { DeployStatus } from '@/components/deploy-status';
import { useRelease } from '@/lib/queries/release';
import { Tag } from 'lucide-react';
import type { Project, WorkHistoryEntry, Recommendation, SiteConfig, OffTheClock } from '@/lib/schema';

export function PortfolioApp({
  site, workHistory, recommendations, projects, initialProjectId, offTheClock,
}: {
  site: SiteConfig; workHistory: WorkHistoryEntry[]; recommendations: Recommendation[];
  projects: Project[]; initialProjectId?: string; offTheClock: OffTheClock;
}) {
  const { data: release } = useRelease();
  const validInitialId = projects.some((p) => p.id === initialProjectId) ? initialProjectId : undefined;

  const router = useRouter();
  const [selectedId, setSelectedId] = useState(validInitialId ?? projects[0]?.id);
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [askOpen, setAskOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>(validInitialId ? 'details' : 'projects');

  // The panel's default open height also doubles as the resize floor — dragging can only grow it.
  const DEFAULT_ASK_PANEL_HEIGHT = 340;
  const [askPanelHeight, setAskPanelHeight] = useState(DEFAULT_ASK_PANEL_HEIGHT);
  const [isResizingAsk, setIsResizingAsk] = useState(false);
  const isResizingAskRef = useRef(false);
  const workColumnRef = useRef<HTMLDivElement>(null);

  const startAskResize = (e: PointerEvent) => {
    isResizingAskRef.current = true;
    setIsResizingAsk(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onAskResizeMove = (e: PointerEvent) => {
    // Gate on a ref, not the isResizingAsk state — a fast drag can fire pointermove
    // before React commits the state update from pointerdown, dropping the first move(s).
    if (!isResizingAskRef.current || !workColumnRef.current) return;
    const containerRect = workColumnRef.current.getBoundingClientRect();

    const headerEl = workColumnRef.current.querySelector('[data-ask-panel-header]');
    const headerHeight = headerEl?.getBoundingClientRect().height ?? 0;
    // The dragged distance covers the header + body together — only the body portion
    // is the dynamic grid row, so the header's real height must be subtracted out,
    // otherwise the panel ends up taller than the cursor position implies.
    const desiredBodyHeight = containerRect.bottom - e.clientY - headerHeight;

    const handleEl = workColumnRef.current.querySelector('.cursor-row-resize');
    const handleHeight = handleEl?.getBoundingClientRect().height ?? 0;

    // Cap growth at a real, visible landmark — "WorkLog shows just its header plus its
    // first project" — measured directly off the rendered DOM, rather than assembled from
    // separately measured/guessed heights that can drift out of sync with each other.
    const workLogHeaderEl = workColumnRef.current.querySelector('[data-worklog-header]');
    const firstProjectEl = workLogHeaderEl?.nextElementSibling?.firstElementChild;
    const firstProjectBottom = firstProjectEl?.getBoundingClientRect().bottom
      ?? workLogHeaderEl?.getBoundingClientRect().bottom
      ?? containerRect.top;
    const maxHeight = containerRect.bottom - firstProjectBottom - handleHeight - headerHeight;

    setAskPanelHeight(Math.min(Math.max(desiredBodyHeight, DEFAULT_ASK_PANEL_HEIGHT), maxHeight));
  };
  const endAskResize = () => {
    isResizingAskRef.current = false;
    setIsResizingAsk(false);
  };

  const caseDialogRef = useRef<CaseDialogHandle>(null);
  const siuRef = useRef<SiuTakeoverHandle>(null);
  const triggerSiu = () => siuRef.current?.open();

  useEffect(() => {
    if (selectedId) router.replace(`?project=${selectedId}`, { scroll: false });
  }, [selectedId, router]);

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
          codingProfiles={site.codingProfiles}
          offTheClock={offTheClock}
          onTriggerSiu={triggerSiu}
        />

        <div
          ref={workColumnRef}
          className={`grid min-h-0 min-w-0 overflow-hidden border-r border-g ${isResizingAsk ? '' : 'transition-[grid-template-rows] duration-300 ease-in-out'}`}
          style={{
            gridTemplateRows: askOpen
              ? `auto minmax(0,1fr) 6px auto ${askPanelHeight}px`
              : 'auto minmax(0,1fr) auto minmax(0,0fr)',
          }}
        >
          <WorkLog projects={projects} selectedId={selectedId} onSelect={setSelectedId} />
          {askOpen && (
            <div
              onPointerDown={startAskResize}
              onPointerMove={onAskResizeMove}
              onPointerUp={endAskResize}
              className="cursor-row-resize touch-none bg-cream hover:bg-g/25 transition-colors"
            />
          )}
          <AskPanel
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
              codingProfiles={site.codingProfiles}
              offTheClock={offTheClock}
              onTriggerSiu={triggerSiu}
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
        <div className="ml-auto flex items-center gap-3">
          {release && (
            <a
              href={release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-0_7 text-cream/50 hover:text-cream/80"
            >
              <Tag className="h-3 w-3" />
              {release.tag}
            </a>
          )}
          {/* <DeployStatus className="text-cream/45" /> */}
        </div>
      </div>

      <CaseDialog ref={caseDialogRef} />
      <SiuTakeover ref={siuRef} />

      <CommandPalette
        projects={projects}
        site={site}
        onSelectProject={selectOnMobile}
        onOpenCase={(id) => caseDialogRef.current?.open(id)}
      />
    </div>
  );
}
