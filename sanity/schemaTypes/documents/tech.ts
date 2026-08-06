import { defineField, defineType } from 'sanity';

// A single canonical list projects reference, instead of each project typing its
// own free-text tech strings — that's what caused "redis"/"redis "/"Redis" and
// "postgres"/"postGreSQL"/"PostgreSQL" to all exist as separate, undeduplicated values.
export default defineType({
  name: 'tech',
  title: 'Tech',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: 'name' },
  },
});
