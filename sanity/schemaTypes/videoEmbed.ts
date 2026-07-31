import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'videoEmbed',
  title: 'Video Embed',
  type: 'object',
  fields: [
    defineField({ name: 'url', type: 'url', validation: (Rule) => Rule.required() }),
    defineField({ name: 'title', title: 'Accessible title', type: 'string', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { subtitle: 'url' },
    prepare({ subtitle }) {
      return { title: 'Video embed', subtitle };
    },
  },
});
