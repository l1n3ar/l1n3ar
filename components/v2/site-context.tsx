'use client';
import { createContext, useContext, type ReactNode } from 'react';
import type { NavItem, Project, SiteConfig } from '@/lib/types';

type SiteContextValue = {
  site: SiteConfig;
  navItems: NavItem[];
  projects: Project[];
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({
  site, navItems, projects, children,
}: SiteContextValue & { children: ReactNode }) {
  return (
    <SiteContext.Provider value={{ site, navItems, projects }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within SiteProvider');
  return ctx;
}
