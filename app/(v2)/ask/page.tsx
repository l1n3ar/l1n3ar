import { AskChat } from '@/components/v2/sections/ask-chat';
import { getAllProjects, getSiteConfig } from '@/lib/content';

const MAX_SUGGESTIONS = 5;

function pickRandom<T>(items: T[], count: number): T[] {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

export default async function AskPage() {
  const [projects, site] = await Promise.all([getAllProjects(), getSiteConfig()]);
  const asks = projects.map((p) => p.asks[0]).filter((ask): ask is string => Boolean(ask));
  const suggestions = pickRandom(asks, MAX_SUGGESTIONS);

  return (
    <AskChat
      siteName={site.name}
      suggestions={suggestions}
      apiBody={{}}
      inputPosition="center"
      className="h-full"
    />
  );
}
