import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'tableBlock',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tableRow',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'description', type: 'string' }),
            defineField({ name: 'count', type: 'number' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'description' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { rows: 'rows' },
    prepare({ rows }) {
      return { title: 'Table', subtitle: `${rows?.length ?? 0} rows` };
    },
  },
});
