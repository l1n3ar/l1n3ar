import { type SchemaTypeDefinition } from 'sanity';

import project from './documents/project';
import siteConfig from './documents/site-config';
import workHistoryEntry from './documents/work-history-entry';
import recommendation from './documents/recommendation';
import musicEntry from './documents/music-entry';
import navItem from './documents/nav-item';
import caseSection from './objects/case-section';
import codeBlock from './objects/code-block';
import caseImage from './objects/case-image';
import tableBlock from './objects/table-block';
import videoEmbed from './objects/video-embed';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    project,
    siteConfig,
    workHistoryEntry,
    recommendation,
    musicEntry,
    navItem,
    caseSection,
    codeBlock,
    caseImage,
    tableBlock,
    videoEmbed,
  ],
};
