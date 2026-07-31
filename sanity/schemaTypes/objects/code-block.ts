import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'codeBlock',
  title: 'Code Block',
  type: 'object',
  fields: [
    defineField({ name: 'code', type: 'text', validation: (Rule) => Rule.required() }),
    defineField({ name: 'language', type: 'string' }),
  ],
  preview: {
    select: { subtitle: 'language' },
    prepare({ subtitle }) {
      return { title: 'Code block', subtitle };
    },
  },
});
