import { defineField, defineType } from 'sanity';
import { HOME_TILE_KEYS, NAV_ICON_NAMES } from '@/lib/types';

export default defineType({
  name: 'homeTile',
  title: 'Home Tile',
  type: 'document',
  fields: [
    defineField({
      name: 'key',
      type: 'string',
      description: 'Which Home bento tile this is — fixed to tiles that actually exist in code.',
      options: { list: [...HOME_TILE_KEYS] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', type: 'text', description: 'Optional — the "work" tile has none.' }),
    defineField({ name: 'buttonLabel', type: 'string', description: 'Not used by the "work" tile.' }),
    defineField({
      name: 'icon',
      type: 'string',
      description: 'Fixed to icon names actually bundled (see components/v2/nav-icons.ts).',
      options: { list: [...NAV_ICON_NAMES] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Order, ascending', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'key' },
  },
});
