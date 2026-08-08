import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'workHistoryEntry',
  title: 'Work History Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Company ID',
      type: 'string',
      description: 'Slug for this company, e.g. barbri, lega, tuteck, conxult, pwc — used for the logo filename and to group multiple roles under one company.',
      validation: (Rule) => Rule.required().regex(/^[a-z0-9-]+$/, { name: 'lowercase slug' }),
    }),
    defineField({ name: 'org', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'range', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'description',
      title: 'Description bullets',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Order, descending', name: 'orderDesc', by: [{ field: 'order', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'org', subtitle: 'role' },
  },
});
