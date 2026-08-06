import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Server-only — never import this from client components.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})
