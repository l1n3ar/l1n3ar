import { WorkHistory } from '@/components/v2/work/work-history';
import { getSiteConfig, getWorkHistory } from '@/lib/content';

export default async function WorkPage() {
  const [workHistory, site] = await Promise.all([getWorkHistory(), getSiteConfig()]);
  const resumeHref = site.footerLinks.find((l) => l.label.toLowerCase().includes('resume'))?.href;
  return <WorkHistory entries={workHistory} resumeHref={resumeHref} />;
}
