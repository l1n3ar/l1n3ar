import { WorkHistory } from '@/components/v2/work/work-history';
import { getWorkHistory } from '@/lib/content';

export default async function WorkPage() {
  const workHistory = await getWorkHistory();
  return <WorkHistory entries={workHistory} />;
}
