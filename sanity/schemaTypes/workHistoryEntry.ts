import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'workHistoryEntry',
  title: 'Work History Entry',
  type: 'document',
  fields: [
    defineField({ name: 'org', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'range', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Order, descending', name: 'orderDesc', by: [{ field: 'order', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'org', subtitle: 'role' },
  },
});
