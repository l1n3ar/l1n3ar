import { client } from '@/sanity/lib/client';
import type {
  Project, WorkHistoryEntry, Recommendation, SiteConfig, OffTheClock, NavItem, HomeTileContent,
} from './types';

export async function getSiteConfig(): Promise<SiteConfig> {
  return client.fetch(`*[_type == "siteConfig"][0]{
    name, role, location, email, about, alterEgo, footerLinks, codingProfiles
  }`);
}

export async function getWorkHistory(): Promise<WorkHistoryEntry[]> {
  return client.fetch(`*[_type == "workHistoryEntry"] | order(order desc){
    id, org, role, range, description, order
  }`);
}

export async function getRecommendations(): Promise<Recommendation[]> {
  return client.fetch(`*[_type == "recommendation"] | order(order desc){
    who, quote, order
  }`);
}

export async function getOffTheClock(): Promise<OffTheClock> {
  const music = await client.fetch(`*[_type == "musicEntry"] | order(order asc){
    band, tagline, now, links
  }`);
  return { music };
}

export async function getNavItems(): Promise<NavItem[]> {
  return client.fetch(`*[_type == "navItem" && hidden != true] | order(order asc){
    href, label, group, order, hidden
  }`);
}

export async function getHomeTiles(): Promise<HomeTileContent[]> {
  return client.fetch(`*[_type == "homeTile"] | order(order asc){
    key, title, description, buttonLabel, icon, order
  }`);
}

export async function getAllProjects(): Promise<Project[]> {
  return client.fetch(`*[_type == "project"] | order(order asc){
    "id": slug.current,
    name, org, year, role, line, description, github, demo, metrics, order, asks, category,
    "tech": tech[]->name,
    highlights,
    body
  }`);
}
