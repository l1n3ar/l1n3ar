import { defineField, defineType } from 'sanity';
import { V2_SECTIONS, NAV_GROUPS, NAV_ICON_NAMES } from '@/lib/types';

export default defineType({
  name: 'navItem',
  title: 'Nav Item',
  type: 'document',
  fields: [
    defineField({
      name: 'section',
      type: 'string',
      description: 'Which v2 view this item opens — fixed to views that actually exist in code.',
      options: { list: [...V2_SECTIONS] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'label', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'group',
      type: 'string',
      options: { list: [...NAV_GROUPS] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      type: 'string',
      description: 'Fixed to icon names actually bundled in the sidebar (see components/v2/nav-icons.ts).',
      options: { list: [...NAV_ICON_NAMES] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
    defineField({ name: 'hidden', type: 'boolean', initialValue: false }),
  ],
  orderings: [
    { title: 'Order, ascending', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'label', subtitle: 'group' },
  },
});
