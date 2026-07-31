import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteConfig',
  title: 'Site Config',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'role', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'location', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'email', type: 'string', validation: (Rule) => Rule.required().email() }),
    defineField({ name: 'about', type: 'text', validation: (Rule) => Rule.required() }),
    defineField({ name: 'alterEgo', type: 'string', title: 'Alter ego', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'footerLinks',
      title: 'Footer links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerLink',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'href', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'codingProfiles',
      title: 'Coding profiles',
      type: 'object',
      fields: [
        defineField({ name: 'codeforces', type: 'string' }),
        defineField({ name: 'leetcode', type: 'string' }),
        defineField({ name: 'atcoder', type: 'string' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
});
