# Database Rules

## Local Development
- SQLite default: `DATABASE_URL=file:./gitfinder.db`
- Use lazy initialization — never open DB connection at import time
- Export `export const dynamic = "force-dynamic"` on pages that query DB

## Production (Railway)
- PostgreSQL via Railway plugin
- DATABASE_URL injected automatically by Railway
- Strip `file:` prefix before using as filesystem path

## Migrations
- Use Drizzle ORM: `drizzle-kit push` for dev, `drizzle-kit migrate` for production
- Never edit migration files manually
- Schema in `apps/gitfinder-hub/src/db/schema.ts`

## Forbidden
- Never hardcode database credentials
- Never commit .db files to git
