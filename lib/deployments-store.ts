import { useEffect } from 'react';
import { create } from 'zustand';
import { getDeployments, type Deployment } from '@/actions/deployments';

const REVALIDATE_MS = 60_000;

type Status = 'idle' | 'loading' | 'ready' | 'error';

type DeploymentsState = {
  deployments: Deployment[];
  status: Status;
  error: string;
  lastFetchedAt: number;
  /** No-ops if the cache is still fresh, unless force is true. Dedupes concurrent calls. */
  refresh: (force?: boolean) => Promise<void>;
};

let inFlight: Promise<void> | null = null;

export const useDeploymentsStore = create<DeploymentsState>((set, get) => ({
  deployments: [],
  status: 'idle',
  error: '',
  lastFetchedAt: 0,
  refresh: async (force = false) => {
    const { lastFetchedAt } = get();
    const fresh = lastFetchedAt > 0 && Date.now() - lastFetchedAt < REVALIDATE_MS;
    if (!force && fresh) return;
    if (inFlight) return inFlight;

    if (get().status !== 'ready') set({ status: 'loading' });
    inFlight = (async () => {
      const result = await getDeployments();
      if (result.ok) {
        set({ deployments: result.deployments, status: 'ready', lastFetchedAt: Date.now() });
      } else {
        set({ error: result.error, status: 'error', lastFetchedAt: Date.now() });
      }
      inFlight = null;
    })();
    return inFlight;
  },
}));

let pollingStarted = false;

/** Kicks off the initial fetch + 60s poll exactly once, no matter how many
 *  components call this hook (guarded by a module-level singleton flag). */
export function useDeploymentsPolling() {
  useEffect(() => {
    if (pollingStarted) return;
    pollingStarted = true;
    useDeploymentsStore.getState().refresh();
    setInterval(() => useDeploymentsStore.getState().refresh(), REVALIDATE_MS);
  }, []);
}
