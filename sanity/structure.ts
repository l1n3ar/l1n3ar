import type { StructureResolver } from 'sanity/structure';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Config')
        .id('siteConfig')
        .child(S.document().schemaType('siteConfig').documentId('siteConfig')),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'siteConfig'),
    ]);
