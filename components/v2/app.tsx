'use client';
import { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/v2/sidebar';
import { Navbar } from '@/components/v2/navbar';
import { Home } from '@/components/v2/sections/home';
import type {
  Project, WorkHistoryEntry, Recommendation, SiteConfig, OffTheClock, NavItem, HomeTileContent, V2Section,
} from '@/lib/types';

export function App({
  site, workHistory, recommendations, projects, offTheClock, navItems, homeTiles,
}: {
  site: SiteConfig; workHistory: WorkHistoryEntry[]; recommendations: Recommendation[];
  projects: Project[]; offTheClock: OffTheClock; navItems: NavItem[]; homeTiles: HomeTileContent[];
}) {
  const [section, setSection] = useState<V2Section>('home');
  const title = navItems.find((i) => i.section === section)?.label ?? section;

  return (
    <div className="v2 font-sans">
      <SidebarProvider style={{ '--sidebar-width': 'clamp(12rem, 15vw, 15rem)' } as React.CSSProperties}>
        <AppSidebar site={site} navItems={navItems} section={section} onSectionChange={setSection} />
        <SidebarInset className="h-screen-safe">
          <Navbar title={title} feedbackEmail={site.email} />
          <div className="flex-1 min-h-0 overflow-y-auto gz-scroll">
            <div className="max-w-[90rem] mx-auto p-5 h-full">
              {section === 'home' ? (
                <Home tiles={homeTiles} workHistory={workHistory} onNavigate={setSection} />
              ) : (
                <SectionPlaceholder
                  section={section}
                  projectCount={projects.length}
                  recommendationCount={recommendations.length}
                  musicCount={offTheClock.music.length}
                />
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

// Temporary stand-in for each section's real UI — replaced screen by screen in the next milestones.
function SectionPlaceholder({
  section, projectCount, recommendationCount, musicCount,
}: {
  section: V2Section; projectCount: number; recommendationCount: number; musicCount: number;
}) {
  const counts: Partial<Record<V2Section, string>> = {
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
    <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
      <div className="text-0_8 font-medium text-foreground mb-1 capitalize">{section}</div>
      <p className="text-0_8">{counts[section]}</p>
    </div>
  );
}
