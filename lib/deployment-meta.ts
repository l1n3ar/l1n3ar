export function stateDotClass(state?: string) {
  switch (state) {
    case 'READY':
      return 'bg-primary';
    case 'ERROR':
    case 'CANCELED':
      return 'bg-destructive';
    default:
      return 'bg-muted-foreground';
  }
}

export function stateBadgeVariant(state?: string): 'default' | 'destructive' | 'secondary' {
  switch (state) {
    case 'READY':
      return 'default';
    case 'ERROR':
    case 'CANCELED':
      return 'destructive';
    default:
      return 'secondary';
  }
}

/** Traffic-light coloring (ready=green, error=red, building/queued=yellow) for a Badge's className. */
export function stateBadgeClass(state?: string): string {
  switch (state) {
    case 'READY':
      return 'bg-green-600/15 text-green-700 dark:text-green-400 border-transparent';
    case 'ERROR':
    case 'CANCELED':
      return 'bg-red-600/15 text-red-700 dark:text-red-400 border-transparent';
    case 'BUILDING':
    case 'QUEUED':
    case 'INITIALIZING':
      return 'bg-yellow-600/15 text-yellow-700 dark:text-yellow-400 border-transparent';
    default:
      return 'bg-muted text-muted-foreground border-transparent';
  }
}

export function timeAgo(input: string | number) {
  const then = typeof input === 'number' ? input : Number(input);
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Pulls the commit message out of whichever git-provider-specific meta key is present. */
export function commitMessage(meta?: Record<string, string>) {
  if (!meta) return undefined;
  return meta.githubCommitMessage ?? meta.gitlabCommitMessage ?? meta.bitbucketCommitMessage;
}

/** Pulls the branch/ref out of whichever git-provider-specific meta key is present. */
export function commitRef(meta?: Record<string, string>) {
  if (!meta) return undefined;
  return meta.githubCommitRef ?? meta.gitlabCommitRef ?? meta.bitbucketCommitRef;
}

/** Pulls the short (7-char) commit sha out of whichever git-provider-specific meta key is present. */
export function commitSha(meta?: Record<string, string>) {
  if (!meta) return undefined;
  const sha = meta.githubCommitSha ?? meta.gitlabCommitSha ?? meta.bitbucketCommitSha;
  return sha ? sha.slice(0, 7) : undefined;
}
