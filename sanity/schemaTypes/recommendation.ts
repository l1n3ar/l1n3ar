import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'recommendation',
  title: 'Recommendation',
  type: 'document',
  fields: [
    defineField({ name: 'who', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'quote', type: 'text', validation: (Rule) => Rule.required() }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Order, ascending', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'who', subtitle: 'quote' },
  },
});
