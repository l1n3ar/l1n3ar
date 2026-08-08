import { L1n3ar } from '@/components/v2/l1n3ar/l1n3ar';
import { getOffTheClock, getSiteConfig } from '@/lib/content';

export default async function L1n3arPage() {
  const [site, offTheClock] = await Promise.all([getSiteConfig(), getOffTheClock()]);
  return <L1n3ar codingProfiles={site.codingProfiles} offTheClock={offTheClock} />;
}
