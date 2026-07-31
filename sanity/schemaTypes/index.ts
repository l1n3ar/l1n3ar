import { type SchemaTypeDefinition } from 'sanity';

import project from './project';
import siteConfig from './siteConfig';
import workHistoryEntry from './workHistoryEntry';
import recommendation from './recommendation';
import musicEntry from './musicEntry';
import caseSection from './caseSection';
import codeBlock from './codeBlock';
import caseImage from './caseImage';
import tableBlock from './tableBlock';
import videoEmbed from './videoEmbed';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    project,
    siteConfig,
    workHistoryEntry,
    recommendation,
    musicEntry,
    caseSection,
    codeBlock,
    caseImage,
    tableBlock,
    videoEmbed,
  ],
};
