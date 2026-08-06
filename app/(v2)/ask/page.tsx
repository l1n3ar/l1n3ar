import { AskChat } from '@/components/v2/sections/ask-chat';
import { getAllProjects, getSiteConfig } from '@/lib/content';

const MAX_SUGGESTIONS = 5;

export default async function AskPage() {
  const [projects, site] = await Promise.all([getAllProjects(), getSiteConfig()]);
  const suggestions = projects
    .map((p) => p.asks[0])
    .filter((ask): ask is string => Boolean(ask))
    .sort(() => Math.random() - 0.5)
    .slice(0, MAX_SUGGESTIONS);

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
