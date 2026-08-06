'use client';
import { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/v2/sidebar';
import { Navbar } from '@/components/v2/navbar';
import type {
  Project, WorkHistoryEntry, Recommendation, SiteConfig, OffTheClock, NavItem, V2Section,
} from '@/lib/types';

export function App({
  site, workHistory, recommendations, projects, offTheClock, navItems,
}: {
  site: SiteConfig; workHistory: WorkHistoryEntry[]; recommendations: Recommendation[];
  projects: Project[]; offTheClock: OffTheClock; navItems: NavItem[];
}) {
  const [section, setSection] = useState<V2Section>('home');
  const title = navItems.find((i) => i.section === section)?.label ?? section;

  return (
    <div className="v2 font-sans">
      <SidebarProvider>
        <AppSidebar site={site} navItems={navItems} section={section} onSectionChange={setSection} />
        <SidebarInset className="h-screen-safe">
          <Navbar title={title} feedbackEmail={site.email} />
          <div className="flex-1 min-h-0 overflow-y-auto gz-scroll">
            <div className="max-w-[1440px] mx-auto p-5">
              <SectionPlaceholder section={section} projectCount={projects.length} workHistoryCount={workHistory.length} recommendationCount={recommendations.length} musicCount={offTheClock.music.length} />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

// Temporary stand-in for each section's real UI — replaced screen by screen in the next milestones.
function SectionPlaceholder({
  section, projectCount, workHistoryCount, recommendationCount, musicCount,
}: {
  section: V2Section; projectCount: number; workHistoryCount: number; recommendationCount: number; musicCount: number;
}) {
  const counts: Record<V2Section, string> = {
    home: 'bento grid coming next',
    projects: `${projectCount} projects loaded`,
    ask: 'RAG chat coming next',
    recommendations: `${recommendationCount} recommendations loaded`,
    coding: 'LeetCode/Codeforces stats coming next',
    offclock: `${musicCount} bands loaded`,
    metrics: 'live metrics coming next',
    deployments: 'deployment timeline coming next',
    qalog: 'password-gated Q&A log coming next',
  };

  return (
    <div className="rounded-xl border border-border p-8 text-center text-muted-foreground">
      <div className="text-sm font-medium text-foreground mb-1 capitalize">{section}</div>
      <p className="text-sm">{counts[section]}</p>
      {section === 'home' && <p className="text-xs mt-1">work history entries loaded: {workHistoryCount}</p>}
    </div>
  );
}
