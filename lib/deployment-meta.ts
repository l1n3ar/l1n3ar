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
