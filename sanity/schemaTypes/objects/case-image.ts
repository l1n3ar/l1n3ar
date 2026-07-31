import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'caseImage',
  title: 'Image',
  type: 'image',
  fields: [
    defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'border', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { imageUrl: 'asset.url', title: 'alt' },
  },
});
