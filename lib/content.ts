import { client } from '@/sanity/lib/client';
import type {
  Project, WorkHistoryEntry, Recommendation, SiteConfig, OffTheClock,
} from './schema';

export async function getSiteConfig(): Promise<SiteConfig> {
  return client.fetch(`*[_type == "siteConfig"][0]{
    name, role, location, email, about, alterEgo, footerLinks, codingProfiles
  }`);
}

export async function getWorkHistory(): Promise<WorkHistoryEntry[]> {
  return client.fetch(`*[_type == "workHistoryEntry"] | order(order desc){
    org, role, range, order
  }`);
}

export async function getRecommendations(): Promise<Recommendation[]> {
  return client.fetch(`*[_type == "recommendation"] | order(order asc){
    who, quote, order
  }`);
}

export async function getOffTheClock(): Promise<OffTheClock> {
  const music = await client.fetch(`*[_type == "musicEntry"] | order(order asc){
    band, tagline, now, links
  }`);
  return { music };
}

export async function getAllProjects(): Promise<Project[]> {
  return client.fetch(`*[_type == "project"] | order(order asc){
    "id": slug.current,
    name, org, year, role, line, description, tech, github, demo, metrics, order, asks,
    highlights,
    body
  }`);
}
