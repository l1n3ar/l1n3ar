import { defineField, defineType } from 'sanity';
import { NAV_GROUPS } from '@/lib/types';

export default defineType({
  name: 'navItem',
  title: 'Nav Item',
  type: 'document',
  fields: [
    defineField({
      name: 'href',
      type: 'string',
      description: 'The path this item links to, e.g. /projects (use / for home). The icon is chosen in code based on this path.',
      validation: (Rule) => Rule.required().regex(/^\//, { name: 'leading slash' }),
    }),
    defineField({ name: 'label', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'group',
      type: 'string',
      options: { list: [...NAV_GROUPS] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
    defineField({ name: 'hidden', type: 'boolean', initialValue: false }),
  ],
  orderings: [
    { title: 'Order, ascending', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
});
