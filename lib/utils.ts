import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['0_6', '0_7', '0_8', '0_9', '1_1', '1_2', '1_4', '2_6'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBuildInfo() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  if (!sha) return undefined;

  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const slug = process.env.VERCEL_GIT_REPO_SLUG;
  const url = owner && slug ? `https://github.com/${owner}/${slug}/commit/${sha}` : undefined;
  const isProduction = process.env.VERCEL_ENV === 'production';

  return {
    sha: sha.slice(0, 7),
    url,
    message: process.env.VERCEL_GIT_COMMIT_MESSAGE,
    branch: !isProduction ? process.env.VERCEL_GIT_COMMIT_REF : undefined,
  };
}
