import { SectionPlaceholder } from '@/components/v2/section-placeholder';
import { getOffTheClock } from '@/lib/content';

export default async function OffClockPage() {
  const offTheClock = await getOffTheClock();
  return <SectionPlaceholder title="Off the clock" note={`${offTheClock.music.length} bands loaded`} />;
}
