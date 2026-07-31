import { defineField, defineType } from 'sanity';
import { OFF_THE_CLOCK_LINK_KINDS } from '@/lib/types';

export default defineType({
  name: 'musicEntry',
  title: 'Music Entry',
  type: 'document',
  fields: [
    defineField({ name: 'band', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'tagline', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'now', title: 'Currently (optional)', type: 'string' }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
    defineField({
      name: 'links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'musicLink',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'href', type: 'url' }),
            defineField({
              name: 'kind',
              type: 'string',
              options: { list: [...OFF_THE_CLOCK_LINK_KINDS] },
              initialValue: 'link',
            }),
          ],
        },
      ],
    }),
  ],
  orderings: [
    { title: 'Order, ascending', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'band', subtitle: 'tagline' },
  },
});
