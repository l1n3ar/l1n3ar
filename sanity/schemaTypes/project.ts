import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'card', title: 'Card', default: true },
    { name: 'caseStudy', title: 'Case Study' },
  ],
  fields: [
    defineField({ name: 'name', type: 'string', group: 'card', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'card',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'org', type: 'string', group: 'card', validation: (Rule) => Rule.required() }),
    defineField({ name: 'year', type: 'string', group: 'card', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', type: 'string', group: 'card', validation: (Rule) => Rule.required() }),
    defineField({ name: 'line', type: 'string', group: 'card', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', type: 'text', group: 'card', validation: (Rule) => Rule.required() }),
    defineField({ name: 'tech', type: 'array', group: 'card', of: [{ type: 'string' }] }),
    defineField({ name: 'github', type: 'url', group: 'card' }),
    defineField({ name: 'demo', type: 'url', group: 'card' }),
    defineField({
      name: 'metrics',
      type: 'array',
      group: 'card',
      of: [
        {
          type: 'object',
          name: 'metric',
          fields: [
            defineField({ name: 'key', type: 'string' }),
            defineField({ name: 'value', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({ name: 'order', type: 'number', group: 'card', initialValue: 0 }),
    defineField({ name: 'asks', type: 'array', group: 'card', of: [{ type: 'string' }] }),

    defineField({
      name: 'highlights',
      type: 'array',
      group: 'caseStudy',
      of: [
        {
          type: 'object',
          name: 'highlight',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'body', type: 'text' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'body',
      title: 'Case study body',
      type: 'array',
      group: 'caseStudy',
      of: [
        { type: 'caseSection' },
        { type: 'codeBlock' },
        { type: 'caseImage' },
        { type: 'tableBlock' },
        { type: 'videoEmbed' },
      ],
    }),
  ],
  orderings: [
    { title: 'Order, ascending', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', subtitle: 'line' },
  },
});
