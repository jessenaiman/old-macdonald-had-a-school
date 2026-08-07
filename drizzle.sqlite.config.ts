import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema-sqlite.ts',
  out: './src/db/migrations-sqlite',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data/omhas.db',
  },
} satisfies Config;
